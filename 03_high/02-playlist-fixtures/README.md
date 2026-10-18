# 再生リストのAPI準備と後片付け

YouTubeをテーマにしたローカル教材 / 難易度：高 / 目安：70分

## 学習内容

API fixture・test.extend・完全並列

## 前提条件

テストごとにUUIDのplaylistを作る。サーバーはメモリ保存で再起動時に消える。

## 対象画面

`http://127.0.0.1:4173/03_high/02-playlist-fixtures/`

## 課題・合格条件

1. fixtureでPOST /api/playlist-itemsに{playlist,title}を送り、動画を作成する。
2. UIに再生リストIDを設定して読み込み、作成した動画を検証する。
3. UI削除後、GET APIでもitems=[]であること。
4. finallyでそのplaylistの残存動画をDELETEし、失敗時も後片付けする。
5. 2テストを並列実行し、互いの動画を削除しない。

## pagesと結果設定の観点

fixture/setupによる前提条件の準備、データ分離、test.step、仕様添付、projectごとの結果を確認する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 03_high/02-playlist-fixtures
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

準備はAPI、操作はUI、期待結果はUIとAPIで確認します。固定の再生リストIDを共有すると並列テストが干渉します。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)

## API契約

- `POST /api/playlist-items`：`{playlist,title}` → 201 `{item:{id,title}}`
- `GET /api/playlist-items?playlist=...` → 200 `{items:[{id,title}]}`
- `DELETE /api/playlist-items/:id?playlist=...` → 204
- `DELETE /api/playlist-items?playlist=...` → 204（指定再生リストのみ）
