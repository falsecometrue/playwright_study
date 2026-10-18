# 動画サイトの表示テーマと永続化

YouTubeをテーマにしたローカル教材 / 難易度：中 / 目安：40分

## 学習内容

localStorage・addInitScript・context分離

## 前提条件

localStorageなしではライト。theme=darkが保存されていればダーク。

## 対象画面

`http://127.0.0.1:4173/02_midium/05-appearance/`

## 課題・合格条件

1. ライトの初期表示とbodyのdata-theme=lightを検証する。
2. ダークに変更後リロードし、表示文とdata-themeが保持されること。
3. addInitScriptでtheme=darkを設定し、初回からダークであること。
4. 別テストではライトとlocalStorage未設定を確認し、実行順に依存させない。

## pagesと結果設定の観点

Page Objectの操作・通信モック・前提条件を分け、HTML/JSON/JUnitと失敗時の記録を確認する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 02_midium/05-appearance
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

テーマの永続化は同一context内で確認し、テスト間は新しいcontextで分離します。select内の選択肢を含むラベルは部分一致で取得します。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)
