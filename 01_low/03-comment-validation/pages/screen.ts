export const screen = {
  path: '/01_low/03-comment-validation/',
  title: 'コメント投稿の入力検証',
  heading: 'コメント投稿の入力検証',
  elements: {
    author: { kind: 'label', name: '表示名' },
    comment: { kind: 'label', name: 'コメント' },
    submit: { kind: 'button', name: 'コメントを投稿' },
    error: { kind: 'alert', name: '' },
    result: { kind: 'status', name: '' },
  },
} as const;
