export const screen = {
  path: '/03_high/03-live-chat/',
  title: 'ライブ配信のチャット同期',
  heading: 'ライブ配信のチャット同期',
  elements: {
    room: { kind: 'label', name: '配信ID' },
    user: { kind: 'label', name: 'ユーザー名' },
    join: { kind: 'button', name: '参加' },
    message: { kind: 'label', name: 'メッセージ' },
    send: { kind: 'button', name: '送信' },
    rows: { kind: 'listitem', name: '' },
  },
} as const;
