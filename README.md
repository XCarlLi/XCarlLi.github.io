# XCarlLi.github.io

目前是一个随机"丑头像"生成页：每次打开随机画一张手绘风格的脸，**ANOTHER**（或空格键）换一张，**DOWNLOAD**（或 `s` 键）下载 500×500 的 PNG。

纯静态页面，没有构建步骤，推送即上线。

## 来源与许可

头像生成算法来自 Xuan Tang（txstc55）的开源项目 [ugly-avatar](https://github.com/txstc55/ugly-avatar)，
该项目以 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) 许可发布（允许非商业使用，须署名）。

- `js/ugly-avatar/face_shape.js`、`eye_shape.js`、`hair_lines.js`、`mouth_shape.js`：原项目 `src/utils/` 下的文件（commit `220838e8`），代码未改动，只加了署名头注释。
- `js/ugly-avatar/face_generator.js`：由原项目 `src/views/FaceGenerator.vue` 改写为原生 JavaScript，改动见文件头注释。
- `js/ugly-avatar/LICENSE`：原项目许可证全文。

上述文件继续适用 CC BY-NC 4.0，不得用于商业用途。

## 文件

| 文件 | 作用 |
|---|---|
| `index.html` | 页面骨架：一个放 SVG 的容器和两个按钮 |
| `style.css` | 样式（与原版外观一致，窄屏自动缩小） |
| `js/ugly-avatar/` | 生成算法和许可证，见上一节 |
| `assets/favicon.svg` | 标签页图标 |
| `.nojekyll` | 让 GitHub Pages 原样发布，不经 Jekyll 处理 |

## 本地预览

ES 模块不能用 `file://` 直接打开，需要起一个本地服务：

```bash
python3 -m http.server 8000
```

然后访问 http://localhost:8000

## 换回学术主页

之前做好的英文学术主页模板保存在本地标签 `academic-template`（commit `d055ea8`）。恢复方法：

```bash
git rm -r -q js && git checkout academic-template -- index.html style.css README.md
```

然后提交、推送即可。
