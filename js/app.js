/**
 * XR正道官衙遺跡 — メインアプリケーションロジック
 * 機能: タブ遷移 / テーマ切替 / Leaflet GPSマップ & ジオフェンス /
 *       model-viewer (.glb + .usdz AR) / Sketchfab遺物3D / 発掘Canvas / おまけAR（郡司と記念撮影）
 */
(function () {
  const CFG = window.XR_CONFIG;
  const STORAGE_KEY = "xr_shodo_kanga_state_v1";

  const state = loadState();
  let map = null;
  let userMarker = null;
  let userCoords = null;
  let watchId = null;
  let restorationOverlay = null;
  let excavationOverlay = null;
  let tileOSM = null;
  let tileSat = null;
  let mapLayers = { restoration: false, excavation: false, satellite: false };
  let pinMarkers = {};
  let currentModelTab = "buildings";
  let quoteIndex = 0;
  let helpIndex = 0;
  let activeViewId = "home";
  let viewerReturnView = "models";

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      theme: "indigo",
      sound: true,
      visitedBuildings: [],
      dugSpots: []
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
    updateProgressUI();
  }

  // Haversine 距離計算（メートル）
  function distanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // 1. 画面遷移
  function showView(viewId) {
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("is-active"));
    const target = document.getElementById(`view-${viewId}`);
    if (target) target.classList.add("is-active");

    // ボトムナビ同期
    activeViewId = viewId;
    const tabMap = { home: "home", map: "map", models: "models", viewer: "models", menu: "menu", about: "home", omake: "home" };
    const activeTab = tabMap[viewId] || "home";
    document.querySelectorAll(".nav-tab").forEach((btn) => {
      const tab = btn.dataset.tab;
      const isAct = tab === activeTab;
      btn.classList.toggle("is-active", isAct);
      const img = btn.querySelector("img");
      if (img) img.src = `./assets/images/nav/tab_${tab}_${isAct ? "on" : "off"}.png`;
    });

    if (viewId === "map") {
      initMapIfNeeded();
      setTimeout(() => map && map.invalidateSize(), 120);
    }
    if (viewId === "omake") {
      renderOmakeView();
    }
  }

  // 2. テーマ適用
  function applyTheme(themeId) {
    const theme = CFG.themes.find((t) => t.id === themeId) || CFG.themes[0];
    state.theme = theme.id;
    const homeEl = document.getElementById("view-home");
    if (homeEl) homeEl.style.backgroundImage = `url("${theme.bg}")`;
    document.querySelectorAll(".theme-swatch-btn").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.theme === theme.id);
    });
    saveState();
  }

  // 3. 進捗UI更新
  function updateProgressUI() {
    const count = state.visitedBuildings.length;
    const total = CFG.buildings.length;
    const unlocked = count >= total;
    const ov = document.getElementById("home-progress-overlay");
    if (ov) {
      ov.textContent = unlocked ? `体験スタンプ ${count}/${total}棟 解放済` : `体験スタンプ ${count} / ${total} 棟`;
      ov.classList.toggle("is-unlocked", unlocked);
    }
    const otBtn = document.getElementById("btn-home-otanoshimi");
    const otImg = document.getElementById("img-home-otanoshimi");
    if (otBtn && otImg) {
      otBtn.disabled = !unlocked;
      otBtn.setAttribute("aria-disabled", String(!unlocked));
      otBtn.classList.toggle("is-locked", !unlocked);
      otImg.src = unlocked ? CFG.omake.bannerUnlocked : CFG.omake.bannerLocked;
      otImg.alt = unlocked ? "お楽しみ（解放済み）" : "お楽しみ（解放前）";
    }
    renderModelGrid();
    refreshMapPinIcons();
  }

  // 4. 3Dモデル鑑賞画面（建物5棟 / 遺物3点）
  function renderModelGrid() {
    const grid = document.getElementById("model-grid");
    if (!grid) return;
    grid.innerHTML = "";

    if (currentModelTab === "buildings") {
      const intro = document.createElement("details");
      intro.className = "cg-intro-box";
      intro.style.gridColumn = "1 / -1";
      intro.innerHTML = `
        <summary class="serif">官衙Ⅲ期建物群の3DCG復元について（タップで開く）</summary>
        <p style="margin:8px 0 6px;">発掘調査で見つかる柱の痕跡「柱穴（ちゅうけつ）」の配置と、現存する古代の寺院建築や絵巻などの史料、早川和子氏による復元イラストを参考に3DCGで復元しました。</p>
        <p style="margin:0 0 8px;">正道官衙遺跡で見つかった建物はすべて地面に掘った穴に柱を埋める<strong>掘立柱建物</strong>で、瓦葺きのような重い屋根を支えられないため板葺きや檜皮葺きが採用されたと考えられます。中心の「身舎（もや）」と周囲の「庇（ひさし）」の配置から、庁屋は入母屋造り、副屋・向屋・東屋は切妻造り、南門は八脚門として復元しています。</p>
        <figure class="about-figure" style="margin:6px 0 0;">
          <img src="./assets/images/info/about_08_cg_overview.png" alt="官衙Ⅲ期建物群の復元">
          <figcaption>図8　官衙Ⅲ期建物群の復元</figcaption>
        </figure>
      `;
      grid.appendChild(intro);
      CFG.buildings.forEach((b) => {
        const visited = state.visitedBuildings.includes(b.id);
        const card = document.createElement("button");
        card.className = "model-card";
        card.innerHTML = `
          <img class="model-card-thumb" src="${b.thumb}" alt="${b.name}">
          <div class="model-card-body">
            <p class="model-card-title serif">${b.name}（${b.kana}）</p>
            <p class="model-card-sub">${b.role}</p>
            ${visited ? '<span class="badge-done">体験済み</span>' : ""}
          </div>
        `;
        card.addEventListener("click", () => openBuildingViewer(b));
        grid.appendChild(card);
      });
    } else {
      CFG.artifacts.forEach((a) => {
        const card = document.createElement("button");
        card.className = "model-card";
        card.innerHTML = `
          <img class="model-card-thumb" src="${a.thumb}" alt="${a.name}">
          <div class="model-card-body">
            <p class="model-card-title serif">${a.name}</p>
            <p class="model-card-sub">${a.subtitle}</p>
          </div>
        `;
        card.addEventListener("click", () => openArtifactViewer(a));
        grid.appendChild(card);
      });
    }
  }

  function markBuildingVisited(id) {
    if (!state.visitedBuildings.includes(id)) {
      state.visitedBuildings.push(id);
      saveState();
    }
  }

  // 建物3D & Web AR（全幅ページで開き、戻るボタンで元の画面へ復帰）
  function openBuildingViewer(b) {
    viewerReturnView = activeViewId === "map" ? "map" : "models";
    markBuildingVisited(b.id);
    document.getElementById("viewer-title").textContent = `${b.name}（${b.kana}）`;
    const body = document.getElementById("viewer-body");
    body.innerHTML = `
      <div class="viewer-full-stage">
        <model-viewer
          src="${b.glb}"
          ios-src="${b.usdz}"
          poster="${b.thumb}"
          alt="${b.name} 復元3Dモデル"
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          shadow-intensity="1"
          exposure="1.05"
        >
          <button slot="ar-button" class="ar-launch-btn">
            <img src="./assets/images/icons/icon_ar.png" alt="">
            <span>ARで見る</span>
          </button>
        </model-viewer>
      </div>
      <div class="viewer-plain-body">
        <p class="viewer-plain-note">ドラッグで回転・ピンチで拡大縮小できます。対応スマホでは右下の「ARで見る」から実寸配置（Android: GLB / iOS: USDZ）を起動できます。</p>
        <h3 class="serif">${b.name} — ${b.role}</h3>
        <p>${b.description}</p>
        ${b.id === "choya" ? `<figure class="about-figure"><img src="./assets/images/info/about_09_choya_interior.png" alt="庁屋内部の復元"><figcaption>図9　庁屋内部の復元</figcaption></figure>` : ""}
      </div>
    `;
    body.scrollTop = 0;
    showView("viewer");
  }

  // 遺物3D（Sketchfab 全幅ページで開き、戻るボタンで戻る）
  function openArtifactViewer(a) {
    viewerReturnView = activeViewId === "map" ? "map" : "models";
    document.getElementById("viewer-title").textContent = a.name;
    const body = document.getElementById("viewer-body");
    body.innerHTML = `
      <div class="viewer-full-sketchfab">
        <iframe
          title="${a.name}（正道官衙遺跡）"
          frameborder="0"
          allowfullscreen
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          xr-spatial-tracking
          execution-while-out-of-viewport
          execution-while-not-rendered
          web-share
          src="https://sketchfab.com/models/${a.sketchfabUid}/embed"
        ></iframe>
      </div>
      <div class="viewer-plain-body">
        <p class="sketchfab-credit">
          <a href="${a.modelUrl}" target="_blank" rel="noopener noreferrer">${a.name}（正道官衙遺跡）</a>
          by <a href="${a.authorUrl}" target="_blank" rel="noopener noreferrer">${a.authorName}</a> on Sketchfab
        </p>
        <h3 class="serif">${a.name}</h3>
        <p>${a.description}</p>
      </div>
    `;
    body.scrollTop = 0;
    showView("viewer");
  }

  // 5. マップ画面（Leaflet + GPS + レイヤー切替）
  function createPinIcon(imgPath) {
    const url = imgPath && !imgPath.startsWith("data:") && !imgPath.includes("?v=")
      ? `${imgPath}?v=20261121b`
      : imgPath;
    return L.icon({
      iconUrl: url,
      iconSize: [42, 49],
      iconAnchor: [21, 48]
    });
  }

  function initMapIfNeeded() {
    if (map) return;
    map = L.map("leaflet-map", {
      zoomControl: false,
      attributionControl: true
    }).setView([CFG.siteCenter.lat, CFG.siteCenter.lng], CFG.siteCenter.zoom);

    tileOSM = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    // 国土地理院 航空写真タイル（無料・APIキー不要・GitHub Pages対応）
    tileSat = L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg", {
      maxZoom: 18,
      attribution: "国土地理院"
    });

    restorationOverlay = L.imageOverlay(
      "./assets/images/map/overlay_restoration.png",
      CFG.overlayBounds.restoration,
      { opacity: 1.0 }
    );

    excavationOverlay = L.imageOverlay(
      "./assets/images/map/overlay_excavation.png",
      CFG.overlayBounds.excavation,
      { opacity: 0.95 }
    );

    // 建物ピン5棟
    CFG.buildings.forEach((b) => {
      const done = state.visitedBuildings.includes(b.id);
      const marker = L.marker([b.lat, b.lng], {
        icon: createPinIcon(done ? b.pinDone : b.pin)
      }).addTo(map);
      marker.on("click", () => openSpotSheet("building", b));
      pinMarkers[b.id] = marker;
    });


    // 体験（ウォークスルー）開始ピン：タップで確認モーダル → はい で即遷移
    (CFG.vrSpots || []).forEach((v) => {
      const marker = L.marker([v.lat, v.lng], {
        icon: createPinIcon(v.pin),
        zIndexOffset: 400
      }).addTo(map);
      marker.on("click", () => {
        showConfirm(
          v.name || "ウォークスルー体験",
          "この場所からのウォークスルー体験を開始しますか？",
          () => {
            if (window.__IS_CANVAS_PREVIEW) {
              showAlert("プレビュー環境", `GitHub Pages公開版では「準備中」画面を経て、この地点（${v.id}）からウォークスルー体験へ直接遷移します。`);
              return;
            }
            window.location.href = `./vr/index.html?camera=${encodeURIComponent(v.id)}`;
          }
        );
      });
    });

    // 前庭中央の体験ピン
    const wtPin = L.marker([34.86012, 135.78428], {
      icon: createPinIcon("./assets/images/map/pin_walkthrough.png"),
      zIndexOffset: 500
    }).addTo(map);
    wtPin.on("click", () => {
      showConfirm(
        "前庭からのウォークスルー体験",
        "この場所からのウォークスルー体験を開始しますか？",
        () => {
          if (window.__IS_CANVAS_PREVIEW) {
            showAlert("プレビュー環境", "GitHub Pages公開版では「準備中」画面を経て、前庭中央からウォークスルー体験へ直接遷移します。");
            return;
          }
          window.location.href = "./vr/index.html";
        }
      );
    });

    map.on("click", () => closeSpotSheet());
    startGpsWatch();
  }

  function refreshMapPinIcons() {
    if (!map) return;
    CFG.buildings.forEach((b) => {
      const m = pinMarkers[b.id];
      if (!m) return;
      const done = state.visitedBuildings.includes(b.id);
      m.setIcon(createPinIcon(done ? b.pinDone : b.pin));
    });
  }

  function startGpsWatch() {
    if (!("geolocation" in navigator)) return;
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (map) {
          if (!userMarker) {
            userMarker = L.marker([userCoords.lat, userCoords.lng], {
              icon: createPinIcon("./assets/images/map/pin_user.png")
            }).addTo(map);
          } else {
            userMarker.setLatLng([userCoords.lat, userCoords.lng]);
          }
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  }

  function openSpotSheet(type, data) {
    const sheet = document.getElementById("map-spot-sheet");
    document.getElementById("spot-sheet-title").textContent = data.name;
    let meta = "";
    if (userCoords) {
      const d = Math.round(distanceMeters(userCoords.lat, userCoords.lng, data.lat, data.lng));
      meta = `現在地から約 ${d}m`;
    } else {
      meta = "どこからでも3D・AR体験できます";
    }
    document.getElementById("spot-sheet-meta").textContent = meta;
    document.getElementById("spot-sheet-desc").textContent = data.description;

    const actBtn = document.getElementById("spot-sheet-action");
    actBtn.textContent = "3D・ARで体験する";
    actBtn.onclick = () => {
      openBuildingViewer(data);
    };
    sheet.classList.add("is-open");
  }

  function closeSpotSheet() {
    document.getElementById("map-spot-sheet").classList.remove("is-open");
  }

  // 7. おまけ画面（統一：建物5棟コンプリートで gunji.glb / gunji.usdz AR記念撮影解放）
  function renderOmakeView() {
    const container = document.getElementById("omake-stage");
    const unlocked = state.visitedBuildings.length >= CFG.buildings.length;
    const omake = CFG.omake;

    const checklistHtml = CFG.buildings
      .map((b) => {
        const done = state.visitedBuildings.includes(b.id);
        return `<span style="display:inline-block;margin:3px;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:700;background:${done ? "#2e7a4a" : "#d8d3c8"};color:${done ? "#fff" : "#5a5e6b"};">${b.name}${done ? " ✓" : ""}</span>`;
      })
      .join("");

    if (unlocked) {
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const isAndroid = /Android/i.test(navigator.userAgent);

      container.innerHTML = `
        <div class="info-card" style="width:100%;text-align:center;">
          <h3 class="serif">${omake.title}</h3>
          <p style="font-size:12.5px;line-height:1.6;margin-bottom:14px;">${omake.description}</p>

          <!-- gunji.png タップでネイティブAR（iOS Quick Look / Android Scene Viewer）起動 -->
          <a id="omake-ar-trigger" rel="ar" href="${omake.usdz}" style="display:inline-block;text-decoration:none;cursor:pointer;">
            <img src="${omake.triggerImg}" alt="郡司をタップしてAR起動" style="height:280px;width:auto;display:block;margin:0 auto;filter:drop-shadow(0 8px 16px rgba(0,0,0,0.22));">
          </a>
          <p style="margin:10px 0 4px;font-size:13px;font-weight:700;color:#22345e;">
            郡司をタップしてAR起動（記念撮影）
          </p>
        </div>
        <div style="text-align:center;">${checklistHtml}</div>
      `;

      const triggerEl = document.getElementById("omake-ar-trigger");
      triggerEl.addEventListener("click", (ev) => {
        if (isIOS && !omake.usdz.startsWith("data:")) {
          // iOS Safari は <a rel="ar" href="...usdz"> のネイティブ動作で Quick Look を直接起動
          return;
        }
        ev.preventDefault();
        if (isAndroid && !omake.glb.startsWith("data:")) {
          const absGlb = new URL(omake.glb, window.location.href).href;
          const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(absGlb)}&mode=ar_preferred&title=${encodeURIComponent(omake.title)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;
          window.location.href = intentUrl;
        } else {
          showAlert("ネイティブAR起動について", "iPhone（Safari）ではARクイックルック、Android（Chrome）ではScene Viewerが直接起動します。GitHub Pages公開URLからスマートフォンでお試しください。");
        }
      });
    } else {
      const remain = CFG.buildings.length - state.visitedBuildings.length;
      container.innerHTML = `
        <img class="reward-card-img" style="width:86%;max-width:320px;" src="${omake.lockedImg}" alt="おまけ解放前">
        <div class="info-card" style="width:100%;">
          <h3 class="serif">${omake.title}</h3>
          <p>復元建物5棟をすべて鑑賞すると、久世郡司の3Dモデル（<code>gunji.glb</code> / <code>gunji.usdz</code>）をARで呼び出して一緒に記念撮影ができるようになります。</p>
          <p style="font-weight:700;color:#9f3328;">あと ${remain} 棟の鑑賞で解放！</p>
          <div style="margin-top:8px;">${checklistHtml}</div>
        </div>
        <button class="primary-btn" style="width:100%;" id="btn-omake-to-models">3Dモデル鑑賞で建物を見る</button>
      `;
      document.getElementById("btn-omake-to-models").addEventListener("click", () => showView("models"));
    }
  }

  // 8. ヘルプモーダル
  function renderHelpSlide() {
    const slide = CFG.helpSlides[helpIndex];
    document.getElementById("help-slide-img").src = slide.img;
    document.getElementById("help-slide-title").textContent = slide.title;
    document.getElementById("help-slide-text").textContent = slide.text;
    const dots = document.getElementById("help-dots");
    dots.innerHTML = CFG.helpSlides
      .map((_, i) => `<span class="help-dot ${i === helpIndex ? "is-active" : ""}"></span>`)
      .join("");
  }

  // 汎用アラートモーダル
  function showAlert(title, message) {
    document.getElementById("alert-title").textContent = title;
    document.getElementById("alert-message").textContent = message;
    document.getElementById("modal-alert").classList.add("is-open");
  }

  // はい／いいえ確認モーダル
  function showConfirm(title, message, onYes) {
    const modal = document.getElementById("modal-confirm");
    document.getElementById("confirm-title").textContent = title;
    document.getElementById("confirm-message").textContent = message;
    const yesBtn = document.getElementById("btn-confirm-yes");
    const noBtn = document.getElementById("btn-confirm-no");
    yesBtn.onclick = () => {
      modal.classList.remove("is-open");
      if (typeof onYes === "function") onYes();
    };
    noBtn.onclick = () => modal.classList.remove("is-open");
    modal.classList.add("is-open");
  }

  // 初期化・イベントバインド
  function init() {
    setTimeout(() => {
      document.getElementById("splash-screen").classList.add("is-hidden");
    }, 1100);

    // テーマスウォッチ生成
    const swWrap = document.getElementById("theme-swatches");
    CFG.themes.forEach((t) => {
      const btn = document.createElement("button");
      btn.className = "theme-swatch-btn";
      btn.dataset.theme = t.id;
      btn.innerHTML = `<span class="theme-swatch-dot" style="background:${t.color};"></span><span>${t.label}</span>`;
      btn.addEventListener("click", () => applyTheme(t.id));
      swWrap.appendChild(btn);
    });
    applyTheme(state.theme);

    // 郡司セリフ前後切替（1/4⇔4/4 ループ禁止）
    const prevBtn = document.getElementById("btn-quote-prev");
    const nextBtn = document.getElementById("btn-quote-next");
    const renderQuote = () => {
      document.getElementById("home-speech-text").textContent = CFG.gunjiQuotes[quoteIndex];
      const pager = document.getElementById("home-speech-pager");
      if (pager) pager.textContent = `${quoteIndex + 1} / ${CFG.gunjiQuotes.length}`;
      if (prevBtn) prevBtn.disabled = quoteIndex <= 0;
      if (nextBtn) nextBtn.disabled = quoteIndex >= CFG.gunjiQuotes.length - 1;
    };
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (quoteIndex > 0) { quoteIndex--; renderQuote(); }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (quoteIndex < CFG.gunjiQuotes.length - 1) { quoteIndex++; renderQuote(); }
      });
    }
    renderQuote();

    // ナビゲーション＆バナーボタン
    document.querySelectorAll("[data-goto]").forEach((el) => {
      el.addEventListener("click", () => showView(el.dataset.goto));
    });
    const viewerBackBtn = document.getElementById("btn-viewer-back");
    if (viewerBackBtn) {
      viewerBackBtn.addEventListener("click", () => {
        document.getElementById("viewer-body").innerHTML = "";
        showView(viewerReturnView || "models");
      });
    }

    // 3Dモデル鑑賞タブ切替
    document.querySelectorAll(".segment-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentModelTab = btn.dataset.modelTab;
        document.querySelectorAll(".segment-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
        renderModelGrid();
      });
    });

    // マップレイヤー切替
    document.getElementById("btn-layer-cg").addEventListener("click", (e) => {
      mapLayers.restoration = !mapLayers.restoration;
      e.currentTarget.classList.toggle("is-on", mapLayers.restoration);
      if (restorationOverlay) {
        mapLayers.restoration ? restorationOverlay.addTo(map) : map.removeLayer(restorationOverlay);
      }
    });
    document.getElementById("btn-layer-dig").addEventListener("click", (e) => {
      mapLayers.excavation = !mapLayers.excavation;
      e.currentTarget.classList.toggle("is-on", mapLayers.excavation);
      if (excavationOverlay) {
        mapLayers.excavation ? excavationOverlay.addTo(map) : map.removeLayer(excavationOverlay);
      }
    });
    document.getElementById("btn-layer-sat").addEventListener("click", (e) => {
      mapLayers.satellite = !mapLayers.satellite;
      e.currentTarget.classList.toggle("is-on", mapLayers.satellite);
      if (map) {
        if (mapLayers.satellite) {
          map.removeLayer(tileOSM);
          tileSat.addTo(map);
        } else {
          map.removeLayer(tileSat);
          tileOSM.addTo(map);
        }
      }
    });
    const wtFab = document.getElementById("btn-start-walkthrough");
    if (wtFab) {
      wtFab.addEventListener("click", () => {
        if (window.XRWalkthrough) window.XRWalkthrough.open("plaza");
      });
    }
    document.getElementById("btn-map-gps").addEventListener("click", () => {
      if (!map) return;
      if (userCoords) {
        map.setView([userCoords.lat, userCoords.lng], 18);
      } else {
        map.setView([CFG.siteCenter.lat, CFG.siteCenter.lng], CFG.siteCenter.zoom);
      }
    });

    // ヘルプモーダル
    document.querySelectorAll(".js-open-help").forEach((b) => {
      b.addEventListener("click", () => {
        helpIndex = 0;
        renderHelpSlide();
        document.getElementById("modal-help").classList.add("is-open");
      });
    });
    document.getElementById("btn-help-prev").addEventListener("click", () => {
      helpIndex = (helpIndex - 1 + CFG.helpSlides.length) % CFG.helpSlides.length;
      renderHelpSlide();
    });
    document.getElementById("btn-help-next").addEventListener("click", () => {
      helpIndex = (helpIndex + 1) % CFG.helpSlides.length;
      renderHelpSlide();
    });

    // モーダル閉じる
    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.closeModal;
        document.getElementById(id).classList.remove("is-open");
        if (id === "modal-viewer") document.getElementById("viewer-body").innerHTML = "";
      });
    });

    document.getElementById("btn-reset-progress").addEventListener("click", () => {
      state.visitedBuildings = [];
      state.dugSpots = [];
      saveState();
      showAlert("初期化完了", "体験スタンプをリセットしました。");
    });

    updateProgressUI();
    if (window.location.hash === "#map") {
      document.getElementById("splash-screen").classList.add("is-hidden");
      showView("map");
    } else {
      showView("home");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
