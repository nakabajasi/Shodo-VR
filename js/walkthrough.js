/**
 * XR正道官衙遺跡 — Web ウォークスルー AR/VR エンジン (Three.js + GLTFLoader)
 * - 5棟の復元建物 (.glb) を実測座標に基づく相対位置（メートル単位）に一括配置
 * - VRモード（青空＋地面）と ARモード（背面カメラ映像オーバーレイ）を1タップ切替
 * - ジャイロセンサー（iOS許可対応）＋画面ドラッグ360°視点＋移動パッド＋スポットワープ＋GPS歩行連動
 */
import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

const CFG = window.XR_CONFIG;

// 庁屋を原点 (0, 0, 0) とした実測相対位置 (m) と向き (+X=東, -Z=北)
const WORLD_ORIGIN = { lat: 34.86040607968549, lng: 135.78424322774643 };
const M_PER_LAT = 110940.0;
const M_PER_LNG = 111320.0 * Math.cos((WORLD_ORIGIN.lat * Math.PI) / 180);

function latLngToWorldXZ(lat, lng) {
  const x = (lng - WORLD_ORIGIN.lng) * M_PER_LNG;
  const z = -(lat - WORLD_ORIGIN.lat) * M_PER_LAT;
  return { x, z };
}

const BUILDING_ROT_Y = {
  choya: 0,
  soeya: 0,
  higashiya: Math.PI / 2, // 南北棟
  mukaiya: 0,
  nanmon: 0
};

// ワープ用プリセット視点（カメラ位置と初期視線方向 yaw [rad], 0 = 北向き）
const WARP_SPOTS = [
  { id: "nanmon", label: "南門前", x: 3.2, z: 86.0, yaw: 0 },
  { id: "plaza", label: "前庭中央", x: 2.0, z: 32.0, yaw: 0 },
  { id: "choya", label: "庁屋前", x: 0.0, z: 16.0, yaw: 0 },
  { id: "higashiya", label: "東屋前", x: 8.0, z: 17.1, yaw: -Math.PI / 2 },
  { id: "soeya", label: "副屋前", x: -2.2, z: -4.0, yaw: 0 }
];

let initialized = false;
let running = false;
let renderer, scene, camera, groundMesh;
let animId = null;
let arMode = false;
let gyroEnabled = false;
let gpsWalkEnabled = false;
let cameraStream = null;
let gpsWatchId = null;

// カメラ状態（一人称目線 y = 1.65m）
const EYE_HEIGHT = 1.65;
let yaw = 0;   // 0 = 北 (-Z)
let pitch = 0;
let isDragging = false;
let lastPointer = { x: 0, y: 0 };
const moveInput = { forward: 0, right: 0 };
let clock = null;

function setLoadingText(txt, show = true) {
  const el = document.getElementById("wt-loading");
  if (!el) return;
  el.textContent = txt;
  el.style.display = show ? "block" : "none";
}

function initScene() {
  if (initialized) return;
  initialized = true;

  const container = document.getElementById("wt-canvas-wrap");
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9ec5e8);
  scene.fog = new THREE.Fog(0xd8e8f5, 65, 220);

  camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 400);
  camera.rotation.order = "YXZ";

  // 照明（自然な屋外日光）
  const hemi = new THREE.HemisphereLight(0xf6fbff, 0x7d725e, 1.15);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff7e6, 1.35);
  sun.position.set(45, 75, 55);
  scene.add(sun);

  // 地面（史跡公園の芝生・土広場）
  const groundGeo = new THREE.PlaneGeometry(360, 360);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0xc9bfa8, roughness: 0.96, metalness: 0.0 });
  groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = 0;
  scene.add(groundMesh);

  // 薄い地面グリッド（距離感の補助）
  const grid = new THREE.GridHelper(240, 24, 0x9b9078, 0xb5aa92);
  grid.position.y = 0.02;
  grid.material.opacity = 0.25;
  grid.material.transparent = true;
  scene.add(grid);

  // 5棟の復元建物 .glb を順次ロードして実測位置へ配置
  const loader = new GLTFLoader();
  let loadedCount = 0;
  const total = CFG.buildings.length;
  setLoadingText(`復元建物を読み込み中 (0 / ${total})...`, true);

  CFG.buildings.forEach((b) => {
    const pos = latLngToWorldXZ(b.lat, b.lng);
    loader.load(
      b.glb,
      (gltf) => {
        const model = gltf.scene;
        // バウンディングボックスから底面を Y=0 に接地補正
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.set(pos.x - center.x, -box.min.y, pos.z - center.z);
        model.rotation.y = BUILDING_ROT_Y[b.id] || 0;
        scene.add(model);
        loadedCount++;
        if (loadedCount >= total) {
          setLoadingText("", false);
        } else {
          setLoadingText(`復元建物を読み込み中 (${loadedCount} / ${total})...`, true);
        }
      },
      undefined,
      () => {
        loadedCount++;
        if (loadedCount >= total) setLoadingText("", false);
      }
    );
  });

  // 視点ドラッグ操作
  const dom = renderer.domElement;
  dom.addEventListener("pointerdown", (e) => {
    isDragging = true;
    lastPointer = { x: e.clientX, y: e.clientY };
  });
  window.addEventListener("pointermove", (e) => {
    if (!isDragging || !running || gyroEnabled) return;
    const dx = e.clientX - lastPointer.x;
    const dy = e.clientY - lastPointer.y;
    lastPointer = { x: e.clientX, y: e.clientY };
    yaw += dx * 0.005;
    pitch = Math.max(-Math.PI / 2.6, Math.min(Math.PI / 2.6, pitch + dy * 0.005));
  });
  window.addEventListener("pointerup", () => { isDragging = false; });

  window.addEventListener("resize", () => {
    if (!renderer || !camera) return;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // 移動パッドバインド
  const bindPad = (id, key, val) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    const start = (e) => { e.preventDefault(); moveInput[key] = val; };
    const stop = () => { if (moveInput[key] === val) moveInput[key] = 0; };
    btn.addEventListener("pointerdown", start);
    btn.addEventListener("pointerup", stop);
    btn.addEventListener("pointerleave", stop);
    btn.addEventListener("pointercancel", stop);
  };
  bindPad("wt-move-fwd", "forward", 1);
  bindPad("wt-move-back", "forward", -1);
  bindPad("wt-move-left", "right", -1);
  bindPad("wt-move-right", "right", 1);

  // スポットワープボタン生成
  const warpBar = document.getElementById("wt-warp-bar");
  if (warpBar) {
    warpBar.innerHTML = "";
    WARP_SPOTS.forEach((sp) => {
      const btn = document.createElement("button");
      btn.className = "wt-warp-btn";
      btn.textContent = sp.label;
      btn.addEventListener("click", () => warpTo(sp.id));
      warpBar.appendChild(btn);
    });
  }

  // AR/VR 切替ボタン
  document.getElementById("wt-btn-ar").addEventListener("click", toggleARMode);
  // ジャイロ切替ボタン
  document.getElementById("wt-btn-gyro").addEventListener("click", toggleGyro);
  // GPS歩行連動ボタン
  document.getElementById("wt-btn-gps").addEventListener("click", toggleGpsWalk);
  // 撮影ボタン
  document.getElementById("wt-btn-snap").addEventListener("click", takeSnapshot);
  // 閉じるボタン
  document.getElementById("wt-btn-close").addEventListener("click", closeWalkthrough);

  clock = new THREE.Clock();
  warpTo("plaza");
}

function warpTo(spotId) {
  const sp = WARP_SPOTS.find((s) => s.id === spotId) || WARP_SPOTS[1];
  if (camera) {
    camera.position.set(sp.x, EYE_HEIGHT, sp.z);
    yaw = sp.yaw;
    pitch = 0;
  }
  document.querySelectorAll(".wt-warp-btn").forEach((b) => {
    b.classList.toggle("is-active", b.textContent === sp.label);
  });
}

async function toggleARMode() {
  const video = document.getElementById("wt-ar-video");
  const btn = document.getElementById("wt-btn-ar");
  if (!arMode) {
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      video.srcObject = cameraStream;
      video.style.display = "block";
      scene.background = null;
      scene.fog = null;
      if (groundMesh) groundMesh.visible = false;
      arMode = true;
      btn.textContent = "VR切替";
      btn.classList.add("is-on");
    } catch (e) {
      alert("背面カメラを起動できませんでした（HTTPS環境とカメラ許可が必要です）。VRモードのまま体験できます。");
    }
  } else {
    stopCamera();
    arMode = false;
    btn.textContent = "AR切替";
    btn.classList.remove("is-on");
  }
}

function stopCamera() {
  const video = document.getElementById("wt-ar-video");
  if (cameraStream) {
    cameraStream.getTracks().forEach((t) => t.stop());
    cameraStream = null;
  }
  if (video) {
    video.srcObject = null;
    video.style.display = "none";
  }
  if (scene) {
    scene.background = new THREE.Color(0x9ec5e8);
    scene.fog = new THREE.Fog(0xd8e8f5, 65, 220);
  }
  if (groundMesh) groundMesh.visible = true;
}

function onDeviceOrientation(ev) {
  if (!gyroEnabled || !running) return;
  if (ev.alpha == null || ev.beta == null) return;
  // スマホ縦持ち基準の簡易方位・仰角反映
  const alpha = THREE.MathUtils.degToRad(ev.alpha);
  const beta = THREE.MathUtils.degToRad(ev.beta - 90);
  yaw = alpha;
  pitch = Math.max(-Math.PI / 2.8, Math.min(Math.PI / 2.8, beta));
}

async function toggleGyro() {
  const btn = document.getElementById("wt-btn-gyro");
  if (!gyroEnabled) {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res !== "granted") {
          alert("ジャイロセンサーの許可が必要です。画面ドラッグでも360°見渡せます。");
          return;
        }
      } catch (e) {
        return;
      }
    }
    gyroEnabled = true;
    window.addEventListener("deviceorientation", onDeviceOrientation);
    btn.textContent = "ジャイロON";
    btn.classList.add("is-on");
  } else {
    gyroEnabled = false;
    window.removeEventListener("deviceorientation", onDeviceOrientation);
    btn.textContent = "ジャイロ";
    btn.classList.remove("is-on");
  }
}

function toggleGpsWalk() {
  const btn = document.getElementById("wt-btn-gps");
  if (!gpsWalkEnabled) {
    if (!("geolocation" in navigator)) {
      alert("この端末ではGPSを利用できません。");
      return;
    }
    gpsWalkEnabled = true;
    btn.textContent = "GPS連動ON";
    btn.classList.add("is-on");
    gpsWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        const xz = latLngToWorldXZ(pos.coords.latitude, pos.coords.longitude);
        // 遺跡から300m以内なら実位置へカメラを移動
        if (Math.hypot(xz.x, xz.z) < 300 && camera) {
          camera.position.set(xz.x, EYE_HEIGHT, xz.z);
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 2000 }
    );
  } else {
    gpsWalkEnabled = false;
    btn.textContent = "GPS連動";
    btn.classList.remove("is-on");
    if (gpsWatchId !== null) {
      navigator.geolocation.clearWatch(gpsWatchId);
      gpsWatchId = null;
    }
  }
}

function takeSnapshot() {
  if (!renderer) return;
  const url = renderer.domElement.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "xr_shodo_walkthrough.png";
  a.click();
}

function animate() {
  if (!running) return;
  animId = requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.1);
  const speed = 9.0; // m/s

  if (moveInput.forward !== 0 || moveInput.right !== 0) {
    const fwdX = -Math.sin(yaw);
    const fwdZ = -Math.cos(yaw);
    const rightX = Math.cos(yaw);
    const rightZ = -Math.sin(yaw);
    camera.position.x += (fwdX * moveInput.forward + rightX * moveInput.right) * speed * dt;
    camera.position.z += (fwdZ * moveInput.forward + rightZ * moveInput.right) * speed * dt;
  }

  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
  renderer.render(scene, camera);
}

export function openWalkthrough(startSpot = "plaza") {
  const modal = document.getElementById("modal-walkthrough");
  modal.classList.add("is-open");
  initScene();
  warpTo(startSpot);
  running = true;
  clock.getDelta();
  animate();
}

export function closeWalkthrough() {
  running = false;
  if (animId) cancelAnimationFrame(animId);
  stopCamera();
  arMode = false;
  const arBtn = document.getElementById("wt-btn-ar");
  if (arBtn) { arBtn.textContent = "AR切替"; arBtn.classList.remove("is-on"); }
  if (gpsWatchId !== null) {
    navigator.geolocation.clearWatch(gpsWatchId);
    gpsWatchId = null;
    gpsWalkEnabled = false;
    const gpsBtn = document.getElementById("wt-btn-gps");
    if (gpsBtn) { gpsBtn.textContent = "GPS連動"; gpsBtn.classList.remove("is-on"); }
  }
  document.getElementById("modal-walkthrough").classList.remove("is-open");
}

// グローバル公開（app.js から呼び出し）
window.XRWalkthrough = { open: openWalkthrough, close: closeWalkthrough };
