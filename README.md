# Faidlix Portfolio

Faidlix 的靜態作品集網站，包含首頁、作品、Unity WebGL 作品，以及 Blender 外掛下載與版本時間軸。

## 發布

推送到 `main` 後，`.github/workflows/static.yml` 會自動發布 GitHub Pages。

## 外掛同步

外掛清單位於 `data/plugins.json`。`.github/workflows/sync-plugins.yml` 每小時讀取各外掛的 GitHub Extension index、`release.json` 或 `blender_manifest.toml`：

- 偵測到較新版本時更新版本與下載網址。
- 將最新 commit 摘要加入該外掛的歷史時間軸。
- 自動提交更新，接著觸發 Pages 重新發布。

也可在 Actions 手動執行 **Sync Blender add-ons**。新增外掛時，同時更新 `data/plugins.json` 與 `data/plugin-sources.json`。
