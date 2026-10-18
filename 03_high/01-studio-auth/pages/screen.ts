export const screen = {
  path: '/03_high/01-studio-auth/',
  title: 'Studioの認証状態と再利用',
  heading: 'Studioの認証状態と再利用',
  elements: {
    email: { kind: 'label', name: 'メール' },
    password: { kind: 'label', name: 'パスワード' },
    login: { kind: 'button', name: 'ログイン' },
    account: { kind: 'heading', name: 'YouTube風Studio' },
    logout: { kind: 'button', name: 'ログアウト' },
    error: { kind: 'alert', name: '' },
  },
} as const;
