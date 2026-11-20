/**
 * XR正道官衙遺跡 — アプリ設定・スポット・モデル・素材パス定義
 * 素材を差し替える場合は ./assets/ 以下の同名ファイルを上書きしてください。
 */
window.XR_CONFIG = {
  appName: "XR正道官衙遺跡",
  // 国指定史跡 正道官衙遺跡（庁屋・史跡公園中心: 北緯34度51分37.35秒 東経135度47分3.26秒）
  siteCenter: {
    lat: 34.86015,
    lng: 135.78433,
    zoom: 18
  },
  overlayBounds: {
    restoration: [
      [34.85947916, 135.78339778],
      [34.86083430, 135.78503476]
    ],
    excavation: [
      [34.85894569, 135.78158926],
      [34.86151094, 135.78533005]
    ]
  },
  themes: [
    { id: "indigo", label: "縹（藍）", color: "#22345e", bg: "./assets/images/bg/bg_home_indigo.png" },
    { id: "matcha", label: "常盤（緑）", color: "#2d523a", bg: "./assets/images/bg/bg_home_matcha.png" },
    { id: "vermilion", label: "朱（赤）", color: "#7f2b24", bg: "./assets/images/bg/bg_home_vermilion.png" },
    { id: "sumi", label: "墨（黒）", color: "#26282c", bg: "./assets/images/bg/bg_home_sumi.png" }
  ],
  // 郡司キャラクターのガイドセリフ（各バナーの役割を簡潔に案内）
  gunjiQuotes: [
    "ようこそ。「正道官衙遺跡とは」で、奈良時代の役所・久世郡衙の歴史を知ろう。",
    "「現地マップ&探索」では、GPSで遺跡を歩きながら復元建物配置図や発掘調査図面を見比べられるぞ。",
    "「3Dで楽しむ」では、復元建物5棟と出土遺物3点の3Dモデルをじっくり鑑賞できるぞ。",
    "建物5棟をすべて見ると「お楽しみ」が解放される。わしと一緒にAR記念撮影をしようぞ。"
  ],
  // お楽しみAR（旧おまけ：建物5棟コンプリートで解放）
  omake: {
    title: "正道官衙の郡司と記念撮影",
    glb: "./assets/models/gunji.glb",
    usdz: "./assets/models/gunji.usdz",
    triggerImg: "./assets/images/character/gunji.png",
    lockedImg: "./assets/images/omake/omake_locked.png",
    bannerLocked: "./assets/images/banners/banner_otanoshimi_locked.svg",
    bannerUnlocked: "./assets/images/banners/banner_otanoshimi_unlocked.svg",
    description: "下の郡司キャラクター画像をタップすると、iPhoneはクイックルック、AndroidはScene ViewerなどのネイティブARが直接起動します。実空間に郡司を呼び出して記念撮影をお楽しみください！"
  },
  buildings: [
    {
      id: "choya",
      name: "庁屋",
      kana: "ちょうや",
      role: "郡衙の中心建物",
      glb: "./assets/models/choya.glb",
      usdz: "./assets/models/choya.usdz",
      thumb: "./assets/images/thumbs/choya_thum.png",
      pin: "./assets/images/map/pin_choya.png",
      pinDone: "./assets/images/map/pin_choya_done.png",
      lat: 34.86040607968549,
      lng: 135.78424322774643,
      description: "官衙Ⅲ期の中心建物で、6間×2間の身舎（もや）の四方に庇（ひさし）がめぐる『四面庇建物』と推定されます。掘立柱建物は瓦葺きの重い屋根を支えられないため板葺きや檜皮葺きが採用され、屋根は入母屋造りで復元しました。前面には柵（目隠し塀）が巡っていました。"
    },
    {
      id: "nanmon",
      name: "南門",
      kana: "なんもん",
      role: "官衙区画の正門",
      glb: "./assets/models/nanmon.glb",
      usdz: "./assets/models/nanmon.usdz",
      thumb: "./assets/images/thumbs/nanmon_thum.png",
      pin: "./assets/images/map/pin_nanmon.png",
      pinDone: "./assets/images/map/pin_nanmon_done.png",
      lat: 34.85972746193886,
      lng: 135.7842785339946,
      description: "官衙Ⅲ期の西と南を区画する築地状の遺構の南辺、庁屋正面で溝が途切れる位置に配置された門です。東西に築地塀が取り付く構造で、柱の位置は明確ではないものの『八脚門（桁行3間・梁間2間の門）』として掘立柱建物で復元しています。"
    },
    {
      id: "higashiya",
      name: "東屋",
      kana: "ひがしや",
      role: "前庭東側の実務棟",
      glb: "./assets/models/higashiya.glb",
      usdz: "./assets/models/higashiya.usdz",
      thumb: "./assets/images/thumbs/higashiya_thum.png",
      pin: "./assets/images/map/pin_higashiya.png",
      pinDone: "./assets/images/map/pin_higashiya_done.png",
      lat: 34.860251823950115,
      lng: 135.7844854049314,
      description: "庁屋前方の広場を挟んで東側に配置された5間×3間の南北棟の掘立柱建物です。二面庇の平面構成をもち、側面（妻）側に庇が付かないことから、板葺き・檜皮葺きの切妻造りの屋根で復元しました。"
    },
    {
      id: "mukaiya",
      name: "向屋",
      kana: "むかいや",
      role: "前庭西側の対称棟",
      glb: "./assets/models/mukaiya.glb",
      usdz: "./assets/models/mukaiya.usdz",
      thumb: "./assets/images/thumbs/mukaiya_thum.png",
      pin: "./assets/images/map/pin_mukaiya.png",
      pinDone: "./assets/images/map/pin_mukaiya_done.png",
      lat: 34.86007355224724,
      lng: 135.78439152761808,
      description: "東屋の前方に配置された8間×2間の東西棟の細長い掘立柱建物です。身舎（もや）のみの平面構成で側面（妻）側に庇が付かないことから、板葺き・檜皮葺きの切妻造りの屋根で復元しました。"
    },
    {
      id: "soeya",
      name: "副屋",
      kana: "そえや",
      role: "庁屋後方の付属棟",
      glb: "./assets/models/soeya.glb",
      usdz: "./assets/models/soeya.usdz",
      thumb: "./assets/images/thumbs/soeya_thum.png",
      pin: "./assets/images/map/pin_soeya.png",
      pinDone: "./assets/images/map/pin_soeya_done.png",
      lat: 34.860562341922886,
      lng: 135.78421908786578,
      description: "中心建物である庁屋の後方に配置された7間×2間の掘立柱建物です。身舎（もや）のみの平面構成で側面（妻）側に庇が付かないことから、板葺き・檜皮葺きの切妻造りの屋根で復元しました。"
    }
  ],
  artifacts: [
    {
      id: "nokimarugawara",
      name: "複弁八葉蓮華文軒丸瓦",
      subtitle: "正道官衙遺跡 出土",
      thumb: "./assets/images/thumbs/ibutsu_nokimarugawara_thum.png",
      sketchfabUid: "356cc80d3dc348518d2b54e3513a0ff4",
      modelUrl: "https://sketchfab.com/3d-models/356cc80d3dc348518d2b54e3513a0ff4",
      authorName: "京都府城陽市 JOYO エコミュージアム",
      authorUrl: "https://sketchfab.com/joyo-ecomuseum",
      description: "奈良時代の屋根の軒先を飾った丸瓦です。八葉の複弁蓮華文が精緻に表現されています。"
    },
    {
      id: "nokihiragawara",
      name: "均整唐草文軒平瓦",
      subtitle: "正道官衙遺跡 出土",
      thumb: "./assets/images/thumbs/ibutsu_nokihiragawara_thum.png",
      sketchfabUid: "e0e5606fcc254c36afdda1e0b8f09913",
      modelUrl: "https://sketchfab.com/3d-models/e0e5606fcc254c36afdda1e0b8f09913",
      authorName: "京都府城陽市 JOYO エコミュージアム",
      authorUrl: "https://sketchfab.com/joyo-ecomuseum",
      description: "軒丸瓦と対になって軒先を葺いた平瓦です。左右対称の均整の取れた唐草文様が特徴です。"
    },
    {
      id: "enmenken",
      name: "円面硯",
      subtitle: "正道官衙遺跡 出土",
      thumb: "./assets/images/thumbs/ibutsu_enmenken_thum.png",
      sketchfabUid: "a570f128181c4870903feacd0f240c93",
      modelUrl: "https://sketchfab.com/3d-models/a570f128181c4870903feacd0f240c93",
      authorName: "京都府城陽市 JOYO エコミュージアム",
      authorUrl: "https://sketchfab.com/joyo-ecomuseum",
      description: "役人が木簡や文書に墨で文字を書くために使用した須恵器の硯です。ここが役所（官衙）であったことを示す重要な遺物です。"
    }
  ],
  extraSpots: [
    {
      id: "dig_01",
      type: "dig",
      name: "発掘体験：南門付近の瓦だまり",
      lat: 34.85983,
      lng: 135.78438,
      artifactName: "複弁八葉蓮華文軒丸瓦",
      description: "画面を指でこすって土の中から奈良時代の瓦を掘り出してみよう！"
    },
    {
      id: "info_01",
      type: "info",
      name: "発掘調査の歩み",
      lat: 34.86036,
      lng: 135.78408,
      description: "昭和48年（1973年）からの発掘調査により、整然と配置された大型掘立柱建物群が確認され、昭和49年（1974年）に国の史跡に指定されました。"
    }
  ],
  // ウォークスルー体験開始カメラ地点（マップタップで vr/index.html?camera=... へ遷移）
  vrSpots: [
    {
      id: "Camera_choya",
      name: "ウォークスルー体験（庁屋前）",
      pin: "./assets/images/map/pin_vr_choya.png",
      lat: 34.86031017489957,
      lng: 135.78424215410848
    },
    {
      id: "Camera_higashiya",
      name: "ウォークスルー体験（東屋前）",
      pin: "./assets/images/map/pin_vr_higashiya.png",
      lat: 34.860152811740384,
      lng: 135.78447550628817
    },
    {
      id: "Camera_mukaiya",
      name: "ウォークスルー体験（向屋前）",
      pin: "./assets/images/map/pin_vr_mukaiya.png",
      lat: 34.86002075850735,
      lng: 135.78445404861648
    },
    {
      id: "Camera_nanmon",
      name: "ウォークスルー体験（南門前）",
      pin: "./assets/images/map/pin_vr_nanmon.png",
      lat: 34.859670014134956,
      lng: 135.78428288126926
    }
  ],
  helpSlides: [
    {
      img: "./assets/images/help/help_slide_01.png",
      title: "現地マップ&探索で遺跡を歩こう",
      text: "GPSで現在地を表示しながら、復元建物配置図や発掘調査図面を現代の地図・航空写真と重ねて見比べることができます。"
    },
    {
      img: "./assets/images/help/help_slide_02.png",
      title: "3Dで楽しむ（復元建物5棟）",
      text: "庁屋・南門・東屋・向屋・副屋の3Dモデルを自由に回転・拡大でき、対応スマホではARで実空間に配置できます。"
    },
    {
      img: "./assets/images/help/help_slide_03.png",
      title: "出土遺物の3Dモデル鑑賞",
      text: "正道官衙遺跡から出土した軒丸瓦・軒平瓦・円面硯の高精細3Dモデルを自在に回して鑑賞できます。"
    },
    {
      img: "./assets/images/help/help_slide_04.png",
      title: "全5棟を見ると『お楽しみ』解放",
      text: "5棟すべての建物を鑑賞すると、『お楽しみ』が解放され、郡司をタップしてネイティブARで記念撮影ができます。"
    }
  ]
};
