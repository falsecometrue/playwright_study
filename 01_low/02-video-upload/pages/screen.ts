export const screen = {
  path: '/01_low/02-video-upload/',
  title: '動画の投稿設定',
  heading: '動画の投稿設定',
  elements: {
    titleInput: { kind: 'label', name: '動画タイトル' },
    visibility: { kind: 'label', name: '公開設定' },
    rights: { kind: 'label', name: '著作権を確認しました' },
    save: { kind: 'button', name: '投稿設定を保存' },
    result: { kind: 'status', name: '' },
  },
} as const;
