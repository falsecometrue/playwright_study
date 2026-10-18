import { fileURLToPath } from 'node:url';

// 実行時のカレントディレクトリに依存しない絶対パス。
export const authFile = fileURLToPath(new URL('../../playwright/.auth/user.json', import.meta.url));
