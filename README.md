# 个人学术主页

纯静态单页，部署在 GitHub Pages 上，没有构建步骤。

## 文件

| 文件 | 作用 |
|---|---|
| `index.html` | 全部内容。每个需要修改的地方都有 `<!-- 修改：… -->` 注释，占位文字用 `[方括号]` 标出 |
| `style.css` | 样式。颜色集中写在开头的 `:root` 里，深色模式跟随系统自动切换 |
| `assets/` | 头像、CV PDF、favicon 等静态文件 |
| `.nojekyll` | 告诉 GitHub Pages 不要用 Jekyll 处理，原样发布 |

## 本地预览

直接用浏览器打开 `index.html` 即可，或：

```bash
python3 -m http.server 8000
```

然后访问 http://localhost:8000

## 更新上线

```bash
git add -A && git commit -m "update homepage" && git push
```

推送后约 1 分钟生效。

## 常见修改

- **换头像**：把图片存为 `assets/avatar.jpg`，按 `index.html` 里头像处的注释替换那一行。
- **加论文**：复制一个 `<li class="pub">…</li>` 块，自己的名字用 `<strong>` 加粗。
- **放简历**：把 PDF 放进 `assets/`，把"简历（PDF）"链接的 `href` 改成 `assets/cv.pdf`。
- **改配色**：只改 `style.css` 开头的 `--accent`（主色）和 `--accent-soft`（浅底色）。
