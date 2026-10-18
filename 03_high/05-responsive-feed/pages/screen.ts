export const screen = {
  path: '/03_high/05-responsive-feed/',
  title: '動画フィードのPage Objectと複数環境',
  heading: '動画フィードのPage Objectと複数環境',
  elements: {
    navigation: { kind: 'navigation', name: '動画カテゴリ' },
    menu: { kind: 'button', name: 'メニュー' },
    videos: { kind: 'listitem', name: '' },
    watchLater: { kind: 'status', name: '' },
  },
  mobileMaxWidth: 600,
} as const;
