# XR正道官衙遺跡 — 完全素材化 差し替えアセット一覧

本プロジェクトは、アイコン・背景・バナー・ピン・3Dモデルをすべて外部ファイル化しています。  
現在同梱されているダミーファイルを**同じファイル名・同じパスで上書き**するだけで、HTML/CSSを書き換えずにデザイン全体を入れ替えられます。

---

## 1. キャラクター素材（実装済み・差し替え可）

| ファイルパス | 用途 | 推奨サイズ (px) | 透過 | 備考 |
| :--- | :--- | :--- | :---: | :--- |
| `assets/images/character/gunji.png` | スプラッシュ・お楽しみARトリガー立ち絵 | 800 × 1400 目安 | 必須 | 背景透過済みで同梱 |
| `assets/images/character/gunji_face.png` | ホーム画面「郡司の案内」丸顔アイコン | 336 × 336 | 必須 | アップロード画像を解像度・透過最適化済み |
| `assets/images/character/gunji_icon.png` | マップのスポット案内丸アイコン | 320 × 320 | 必須 | `gunji.png` から自動切り出し済み |

---

## 2. ブランド・ロゴ・背景素材

| ファイルパス | 用途 | 推奨サイズ (px) | 透過 | 備考 |
| :--- | :--- | :--- | :---: | :--- |
| `assets/images/brand/splash_logo.png` | 起動画面のタイトルロゴ | 720 × 480 | 必須 | 白背景上に表示 |
| `assets/images/brand/ecomu_logo.png` | ホーム画面左上端ロゴ（JOYOエコミュージアム） | 320 × 120 | 必須 | タイトルと同じ高さで左端に配置 |
| `assets/images/brand/home_title_logo.png` | ホーム画面上部中央のタイトルロゴ | 860 × 180 | 必須 | 暗色背景上・中央揃え |
| `assets/images/bg/bg_home_indigo.png` | ホーム背景（藍・標準テーマ） | 1080 × 1920 | 不要 | 縦長フルスクリーン |
| `assets/images/bg/bg_home_matcha.png` | ホーム背景（緑テーマ） | 1080 × 1920 | 不要 | 設定画面で切替可能 |
| `assets/images/bg/bg_home_vermilion.png` | ホーム背景（朱テーマ） | 1080 × 1920 | 不要 | 設定画面で切替可能 |
| `assets/images/bg/bg_home_sumi.png` | ホーム背景（墨テーマ） | 1080 × 1920 | 不要 | 設定画面で切替可能 |
| `assets/images/bg/bg_subpage_washi.png` | サブページ共通背景（和紙等） | 1080 × 1920 | 不要 | 3D鑑賞・解説・おまけ・設定 |
| `assets/images/bg/bg_header_bar.png` | サブページ上部ヘッダー帯 | 1080 × 180 | 不要 | 上に白文字タイトルを重ねて表示 |
| `assets/images/bg/bg_speech_bubble.png` | ホーム画面の郡司セリフ吹き出し枠 | 960 × 240 | 必須 | 左に郡司立ち絵を配置 |

---

## 3. ホームメニュー用バナー素材

| ファイルパス | 用途 | 推奨サイズ (px) | 透過 | 備考 |
| :--- | :--- | :--- | :---: | :--- |
| `assets/images/banners/banner_about.svg` | 上段左：「正道官衙遺跡とは」正方形バナー | 400 × 400 SVG | 任意 | 2×2グリッド上段左 |
| `assets/images/banners/banner_map.svg` | 上段右：「現地マップ&探索」正方形バナー | 400 × 400 SVG | 任意 | 2×2グリッド上段右 |
| `assets/images/banners/banner_3d.svg` | 下段左：「3Dで楽しむ」正方形バナー | 400 × 400 SVG | 任意 | 2×2グリッド下段左 |
| `assets/images/banners/banner_otanoshimi_locked.svg` | 下段右：「お楽しみ」解放前バナー（グレーアウト） | 400 × 400 SVG | 任意 | 建物5棟鑑賞前は選択不可 |
| `assets/images/banners/banner_otanoshimi_unlocked.svg` | 下段右：「お楽しみ」解放後バナー | 400 × 400 SVG | 任意 | 建物5棟すべて鑑賞で切替・選択可 |

---

## 4. ナビゲーション・共通アイコン素材

| ファイルパス | 用途 | 推奨サイズ (px) | 透過 | 備考 |
| :--- | :--- | :--- | :---: | :--- |
| `assets/images/nav/tab_home_on.png` / `_off.png` | 下部タブ：ホーム（選択／非選択） | 96 × 96 | 必須 | 2枚セット |
| `assets/images/nav/tab_map_on.png` / `_off.png` | 下部タブ：マップ（選択／非選択） | 96 × 96 | 必須 | 2枚セット |
| `assets/images/nav/tab_models_on.png` / `_off.png` | 下部タブ：3D鑑賞（選択／非選択） | 96 × 96 | 必須 | 2枚セット |
| `assets/images/nav/tab_menu_on.png` / `_off.png` | 下部タブ：設定（選択／非選択） | 96 × 96 | 必須 | 2枚セット |
| `assets/images/icons/icon_back.png` | 戻るボタン | 96 × 96 | 必須 | 暗色ヘッダー上 |
| `assets/images/icons/icon_help.png` | ヘルプボタン（？） | 96 × 96 | 必須 | ホーム・マップ・3D鑑賞 |
| `assets/images/icons/icon_close.png` | モーダル閉じるボタン（×） | 96 × 96 | 必須 | モーダル右上 |
| `assets/images/icons/icon_gps.png` | 現在地フォーカスボタン | 96 × 96 | 必須 | マップ右側ツールレール |
| `assets/images/icons/icon_ar.png` | AR起動ボタン内アイコン | 96 × 96 | 必須 | `<model-viewer>` ARボタン |
| `assets/images/icons/icon_layer_cg.png` | レイヤー切替：復元建物配置図 | 96 × 96 | 必須 | マップ上部バー／右側ツールレール |
| `assets/images/icons/icon_layer_dig.png` | レイヤー切替：発掘調査図面 | 96 × 96 | 必須 | マップ上部バー／右側ツールレール |
| `assets/images/icons/icon_layer_sat.png` | レイヤー切替：航空写真 | 96 × 96 | 必須 | マップ上部バー／右側ツールレール |

---

## 5. マップ用ピン・オーバーレイ素材

| ファイルパス | 用途 | 推奨サイズ (px) | 透過 | 備考 |
| :--- | :--- | :--- | :---: | :--- |
| `assets/images/map/pin_<建物名>.png` / `_done.png` | 建物別ピン（庁屋・南門・東屋・向屋・副屋の未体験／体験済み計10点） | 104 × 118 | 必須 | 各建物名入りピン |
| `assets/images/map/pin_walkthrough.png` | ウォークスルー AR/VR START ピン | 112 × 126 | 必須 | タップで5棟一括ウォークスルー起動 |
| `assets/images/map/pin_user.png` | ユーザー現在地ピン | 96 × 112 | 必須 | GPS受信時に表示 |
| `assets/images/map/pin_vr_<カメラ名>.png` | VRウォークスルー開始ピン（庁屋・東屋・向屋・南門 計4点） | 104 × 118 | 必須 | タップで `vr/index.html?camera=...` へ遷移 |
| `assets/images/map/overlay_restoration.png` | 復元配置図オーバーレイ | 800 × 800 | 必須 | 地図上に重ねる鳥瞰図・配置図 |
| `assets/images/map/overlay_excavation.png` | 発掘調査遺構図オーバーレイ | 800 × 800 | 必須 | 地図上に重ねる遺構図 |

---

## 6. 3Dモデル・サムネイル素材（建物5棟＋郡司AR＋遺物3点）

| ファイルパス | 用途 | 推奨サイズ / 形式 | 備考 |
| :--- | :--- | :--- | :--- |
| `assets/models/choya.glb` / `choya.usdz` | 庁屋 3D / ARモデル | glTF 2.0 / USDZ | Android WebXR・iOS Quick Look |
| `assets/images/thumbs/choya_thum.png` | 庁屋 サムネイル | 512 × 512 PNG | 一覧カード＋ポスター画像 |
| `assets/models/nanmon.glb` / `nanmon.usdz` | 南門 3D / ARモデル | glTF 2.0 / USDZ | 同上 |
| `assets/images/thumbs/nanmon_thum.png` | 南門 サムネイル | 512 × 512 PNG | 同上 |
| `assets/models/higashiya.glb` / `higashiya.usdz` | 東屋 3D / ARモデル | glTF 2.0 / USDZ | 同上 |
| `assets/images/thumbs/higashiya_thum.png` | 東屋 サムネイル | 512 × 512 PNG | 同上 |
| `assets/models/mukaiya.glb` / `mukaiya.usdz` | 向屋 3D / ARモデル | glTF 2.0 / USDZ | 同上 |
| `assets/images/thumbs/mukaiya_thum.png` | 向屋 サムネイル | 512 × 512 PNG | 同上 |
| `assets/models/soeya.glb` / `soeya.usdz` | 副屋 3D / ARモデル | glTF 2.0 / USDZ | 同上 |
| `assets/images/thumbs/soeya_thum.png` | 副屋 サムネイル | 512 × 512 PNG | 同上 |
| `assets/models/gunji.glb` / `gunji.usdz` | おまけAR：久世郡司 3D / ARモデル | glTF 2.0 / USDZ | 建物5棟すべて鑑賞で解放 |
| `assets/images/thumbs/ibutsu_nokimarugawara_thum.png` | 複弁八葉蓮華文軒丸瓦 サムネイル | 512 × 512 PNG | Sketchfab開く前のカード用 |
| `assets/images/thumbs/ibutsu_nokihiragawara_thum.png` | 均整唐草文軒平瓦 サムネイル | 512 × 512 PNG | Sketchfab開く前のカード用 |
| `assets/images/thumbs/ibutsu_enmenken_thum.png` | 円面硯 サムネイル | 512 × 512 PNG | Sketchfab開く前のカード用 |

---

## 7. 解説・おまけ・発掘・ヘルプ素材

| ファイルパス | 用途 | 推奨サイズ (px) | 透過 | 備考 |
| :--- | :--- | :--- | :---: | :--- |
| `assets/images/info/about_01_overview.png`〜`about_12_suien.png` | 「正道官衙遺跡とは」・3D復元解説の図版（全12点） | 横幅960px目安 | 不要 | 図録PDF切り抜きダミーを配置済み（全幅表示） |
| `assets/images/omake/omake_locked.png` | おまけ：未解放カード | 640 × 480 | 任意 | 建物5棟鑑賞前に表示 |
| `assets/images/help/help_slide_01.png`〜`04.png` | ヘルプモーダル用スライド（4枚） | 800 × 520 | 不要 | 使い方ガイド各ページ |
