import { test } from '@jupyterlab/galata';
import { expect } from '@playwright/test';
import path from 'path';
import { extractFile } from './utils';

const baseRepositoryPath = 'test-repository-dirty.tar.gz';
test.use({ autoGoto: false });

test.describe('File selection for normal staging', () => {
  test.beforeEach(async ({ baseURL, page, tmpPath }) => {
    await extractFile(
      baseURL,
      path.resolve(__dirname, 'data', baseRepositoryPath),
      path.join(tmpPath, 'repository.tar.gz')
    );

    // URL for merge conflict example repository
    await page.goto(`tree/${tmpPath}/test-repository`);
  });

  test('should select two files with ctlr-click', async ({ page }) => {
    await page.pause();
    await page.sidebar.openTab('jp-git-sessions');
    await page.click('button:has-text("Changes")');

    // Click another_file.txt
    await page.locator('#jp-git-sessions >> text=another_file.txt').click();
    // Control-click master_file.ts
    await page.locator('#jp-git-sessions >> text=master_file.ts').click({
      modifiers: ['Control', 'Meta']
    });
    const selectedFileCount = await page.locator('_react=FileItem').count();
    expect(selectedFileCount).toBeGreaterThanOrEqual(2);
  });

  test('should select four files with shift-click', async ({ page }) => {
    await page.sidebar.openTab('jp-git-sessions');
    await page.click('button:has-text("Changes")');

    // Click another_file.txt
    await page.locator('#jp-git-sessions >> text=another_file.txt').click();
    // Shift-click master_file.ts
    await page.locator('#jp-git-sessions >> text=master_file.ts').click({
      modifiers: ['Shift']
    });

    const selectedFiles = page.locator('_react=FileItem');
    expect(await selectedFiles.count()).toBeGreaterThanOrEqual(4);
  });
});
