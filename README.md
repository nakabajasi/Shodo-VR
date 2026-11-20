# XR正道官衙遺跡（GitHub Pages版）

京都府城陽市・国指定史跡「正道官衙遺跡」の Web AR/VR ガイドプロトタイプです。  
ビルド不要の静的構成（HTML/CSS/JS）のため、そのまま **GitHub Pages** に公開して動作します。

## GitHub Pages 公開手順
1. このフォルダの中身（`index.html`, `css/`, `js/`, `assets/`）を GitHub リポジトリのルート（または `/docs`）に配置して push します。
2. リポジトリの **Settings → Pages** で対象ブランチを公開設定にします。
3. 発行された `https://<ユーザー名>.github.io/<リポジトリ名>/` にスマートフォンからアクセスしてください。

## GitHub Pages での GPS・AR 動作仕様
- GitHub Pages は標準で **HTTPS** 配信されるため、ブラウザの `Geolocation API`（GPS位置情報）・`getUserMedia`（カメラ）・`<model-viewer>` による Web AR（Android: `.glb` / iOS Quick Look: `.usdz`）がそのまま動作します。
- 初期状態では動作確認しやすいように **デモモード（GPS現地制限解除）** が ON になっています。本番運用時は `js/app.js` の `demoMode: false` に変更してください。
- 地図タイルは OpenStreetMap および国土地理院タイルを使用しているため、APIキー不要・無料で運用可能です。

## 素材の差し替え方法
同梱の `ASSET_LIST.md` を参照し、`assets/images/` および `assets/models/` 内の同名ファイルを上書きしてください。
