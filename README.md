# 能否投递 / RemoteFrom

Chrome MV3 MVP：在 LinkedIn Jobs 和 Indeed 具体职位页面，点击右下角「分析职位」，仅读取当前 DOM 中的职位正文，按设置的所在国家提示 **可投递 / 限地区（不含你所在地区）/ 无法判定**，并展示匹配证据及独立时区提示。先在设置页保存 CN/中国/China、GB/UK/英国等国家。

Chrome MV3 extension matching the job's existing DOM text against your home country. No network calls, paid APIs, secrets, or ratings. Chinese UI. No dependencies or build step; Node 20 built-ins for tests.

加载 / Install: 打开 `chrome://extensions` → **开发者模式** → **加载已解压** → 选择本目录。打开或刷新职位页面。Open Chrome Extensions, enable Developer mode, Load unpacked, select this folder, then refresh a job page.

每日本地免费 3 次；后台串行扣次，本地日期跨天重置。设置页可生成公开的本地测试许可以解除额度，非付费授权或安全许可系统。数据仅存于 `chrome.storage.local`。Daily local quota: 3 analyses, reset by local date; optional public offline license stub for testing.

映射覆盖 US、CA、GB、全部 27 个 EU 成员国及部分其他国家，详见设置页与 `src/lib/eligibility.js`。地区映射并不穷尽所有国家；不支持的所在国家、模糊或冲突文本、否定表达、只有 Remote 或时区均保守判为未知。职位正文之外的地点不会推断为资格要求。SPA 地址改变后会清除旧结果，同地址正文更新后请重新点击分析。

**免责声明：尚未在真实 LinkedIn / Indeed 网站进行在线验证。NOT live-verified on real sites.** DOM selectors may change. Heuristic text matching can be wrong; “可投递” means a geographic text match only, not employment eligibility, visa advice, or employer approval. 请以职位原文和雇主确认为准。

测试 / Test: `npm test`
