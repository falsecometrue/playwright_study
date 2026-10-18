export const screen = {
  path: '/02_midium/01-video-search/',
  title: '動画検索と読み込み待機',
  heading: '動画検索と読み込み待機',
  elements: {
    query: { kind: 'label', name: '動画を検索' },
    searchButton: { kind: 'button', name: '検索' },
    status: { kind: 'status', name: '' },
    rows: { kind: 'listitem', name: '' },
  },
} as const;
