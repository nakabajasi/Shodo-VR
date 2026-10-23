# Shodo-VR
正道官衙遺跡VR体験 — Walking through experience of archaeological site

GitHub PagesのURLを開くと、スタート画面から直接 `site.glb` の中を歩けます。

## ファイル
| ファイル | 内容 |
|---|---|
| `index.html` | ビューワー本体（スタート画面・VR表示・解説表示） |
| `site.glb` | 遺跡の3Dモデル（Draco圧縮済み） |
| `sky.jpg` | 空の全天球画像 |
| `kanjin.webp` / `kanjin.png` | スタート画面のキャラクター（背景透過） |
| `kaisetsu.txt` | 建物の解説 |

## 解説（kaisetsu.txt）
1行に `建物名,距離(m),解説`。

- 建物名：3D空間に表示されている文字（GLB内の `Text_xxx` オブジェクト）。対応は `index.html` の `TEXT_LABELS` にある。Blenderで文字オブジェクトにカスタムプロパティ `label` を付けて書き出した場合はそちらが優先される。ノード名の後半（`choya` など）でも指定できる。
- 距離：文字の中心からの水平距離。範囲に入ると解説が表示され、×で閉じると範囲から出るまで再表示しない。
- 解説中の `\n` は改行。`#` で始まる行と空行は無視。

## GLBを作り直したとき
Blenderから書き出したGLBは、次の手順で軽くしてから置き換える（テクスチャを使っていないのでUVを削除し、Draco圧縮する）。

```
npx @gltf-transform/cli dedup in.glb tmp1.glb
npx @gltf-transform/cli weld tmp1.glb tmp2.glb
npx @gltf-transform/cli draco tmp2.glb site.glb --method edgebreaker --quantize-position 16 --quantize-normal 10
```
UV（TEXCOORD）の削除はBlenderの書き出し設定で「UVs」のチェックを外すのが簡単。

## 調整用URLパラメータ
| パラメータ | 内容 |
|---|---|
| `?debug=1` | 現在位置と、最寄りの解説範囲までの距離を表示 |
| `?model=xxx.glb` | 別のGLBを表示 |
| `?spawn=x,y,z` | 開始位置を指定 |
| `?ao=off` | 陰影処理（GTAO）を切る |
| `?nowalls=1` | 壁の当たり判定を切る |
| `?radius=0.25` | 当たり判定の半径（m） |
