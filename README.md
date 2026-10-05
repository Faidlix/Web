# Faidlix Portfolio

Faidlix 的靜態作品集網站，包含關於、製作案例、工具下載、Unity 相關與 Blender 外掛版本時間軸。首頁以水平簡報換頁呈現，頂部導覽與聯絡固定；手機版使用兩列導覽。

## 本機預覽

執行 `node scripts/serve.mjs`，開啟 `http://127.0.0.1:4173`。首頁支援滾輪、左右方向鍵與左右觸控；小螢幕可上下滑動目前頁的內容，瀏覽器捲軸保持固定。

## Unity 工具與 UX 記錄

`tools.html` 是工具入口，`play.html` 收錄 FDX Attachment Motion 與按需載入的 WebGL 作品。FDX 工具公開來源為 [unity-tool](https://github.com/Faidlix/unity-tool/tree/release/fdx-attachment-motion-v1)；更新時同步下載、UPM URL、版本、SHA-256 與實際驗證紀錄。Unity 編譯與匯入結果依作者提供的紀錄標示，不以網站測試替代。

每次 UI／UX 修改需追加 `data/ux-history.json`。本次頂部導覽截圖為實際瀏覽器擷取；無法取得的本機附件與未提供的 Unity Inspector 圖片不以示意圖替代。涉及 Blender UI 的歷史版本只使用真實介面截圖。

目前全站資產版本為 `v=12`，Service Worker 快取為 `faidlix-portfolio-2.1.1`；後續更新須同步 HTML、註冊網址及預先快取清單。

## 發布

推送到 `main` 後，`.github/workflows/static.yml` 會自動發布 GitHub Pages。

## 外掛同步

外掛清單位於 `data/plugins.json`。`.github/workflows/sync-plugins.yml` 每小時讀取各外掛的 GitHub Extension index、`release.json` 或 `blender_manifest.toml`：

- 偵測到較新版本時更新版本與下載網址。
- 將最新 commit 摘要加入該外掛的歷史時間軸。
- 自動提交更新，接著觸發 Pages 重新發布。

也可在 Actions 手動執行 **Sync Blender add-ons**。新增外掛時，同時更新 `data/plugins.json` 與 `data/plugin-sources.json`。
