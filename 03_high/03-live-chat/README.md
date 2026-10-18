# ライブ配信のチャット同期

YouTubeをテーマにしたローカル教材 / 難易度：高 / 目安：75分

## 学習内容

複数context・expect.poll・後片付け

## 前提条件

AliceとBobは同じUUID配信、Carolは別UUID配信。250msポーリングで同期する。

## 対象画面

`http://127.0.0.1:4173/03_high/03-live-chat/`

## 課題・合格条件

1. 独立した3つのcontextで2配信に参加する。
2. Aliceのこんにちは、Bobの了解が双方に1回ずつ同じ順序で表示されること。
3. Carolの投稿は別配信にのみ表示されること。
4. APIでも配信ごとの投稿を検証する。
5. finallyで全contextを閉じ、配信データを削除する。

## pagesと結果設定の観点

fixture/setupによる前提条件の準備、データ分離、test.step、仕様添付、projectごとの結果を確認する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 03_high/03-live-chat
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

別配信が空であるだけでは参加失敗を区別できません。Carol自身の投稿が見えることを確認し、機能している別配信への漏えいがないと検証します。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)

## API契約

- `GET /api/messages?room=...` → `{messages:[{user,text}]}`
- `POST /api/messages`：`{room,user,text}` → 201 `{message:{user,text}}`
- `DELETE /api/messages?room=...` → 204
- APIのroomは画面の配信IDに対応。
