import type { PlaywrightTestConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));

/** 同一scopeの再実行では前回の結果を更新する。並行ジョブは別scopeを使う。 */
export function resultSettings(scope: string): Pick<PlaywrightTestConfig, 'outputDir' | 'reporter'> {
  const reports = path.join(root, 'reports', scope);
  return {
    outputDir: path.join(root, 'test-results', scope),
    reporter: [
      ['list'],
      ['html', { outputFolder: path.join(reports, 'html'), open: 'never' }],
      ['json', { outputFile: path.join(reports, 'results.json') }],
      ['junit', { outputFile: path.join(reports, 'junit.xml') }],
    ],
  };
}
