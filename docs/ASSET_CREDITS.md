# 《雨夜回声》视觉素材来源与授权

本目录记录本地 WebGAL 版（《雨夜回声》）当前使用的背景与立绘来源。这些素材准备在日后发布到公开仓库 [Alicecooo/Toukohub](https://github.com/Alicecooo/Toukohub) 及 GitHub Pages 时一并再分发，因此只选用了可在开放游戏中使用、再分发条款明确的资源。下载均来自作者官方页面或作者许可的整理包，并在本轮核验了授权说明。

自制 SVG 占位图已全部替换。未使用 AI 生成图，也未使用 Pixiv / X 个人插画抓取、付费素材商城无再分发许可的资源，或商业游戏拆包 CG。

## 立绘（学校制服角色）

来源包：[Visual Novel Sprite Pack](https://onboroo.itch.io/visual-novel-sprite-pack)  
作者：onboroo  
许可：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)（官方页面写明：可使用与修改，须署名）  
下载：作者 itch.io 页面免费（Name your own price，最低 $0）文件 `VN Sprite Pack by onboroo.rar`  
本游戏署名：onboroo

同一包内四名高中制服角色风格一致。本作用其中三人（未使用 boyB）：

| 游戏文件 | 包内原文件 | 扮演 |
| --- | --- | --- |
| `public/game/figure/gu_neutral.png` | `boyA/default.png` | 顾舟（转学生，中性表情） |
| `public/game/figure/lin_neutral.png` | `girlA/default.png` | 林激（图书委员，中性） |
| `public/game/figure/lin_worried.png` | `girlA/sad.png` | 林激（担忧） |
| `public/game/figure/lin_smile.png` | `girlA/smile.png` | 林激（浅笑） |
| `public/game/figure/xia_neutral.png` | `girlB/default.png` | 夏遥（学生会，中性） |
| `public/game/figure/xia_determined.png` | `girlB/angry.png` | 夏遥（坚决；包内最接近“认真/坚定”的表情） |
| `public/game/figure/xia_smile.png` | `girlB/smile.png` | 夏遥（微笑） |

处理：从 RGBA PNG 等比缩放到高 1600 像素，未改画、未重绘表情。故事原文没有规定发色或制服细节，因此按角色气质选了三位外形可区分的学生。

## 背景（校园 / 雨天气氛）

来源：Uncle Mugen（mugenjohncel / Studio Mugenjohncel）免费视觉小说背景。  
官方说明帖：[UNCLE MUGEN'S FREE VN (OELVN) RESOURCES](https://lemmasoft.renai.us/forums/viewtopic.php?f=52&t=17302)（Lemma Soft Forums）  
本轮实际下载自作者素材的整理页（整理者 Alte，页面要求署名 Uncle Mugen）：

- [UNCLE MUGEN'S FREE VN BACKGROUNDS (WebP Packs)](https://alte.itch.io/uncle-mugens-backgrounds) 中的 `pack1.zip`（School / Modern Urban）
- [UNCLE MUGEN'S FREE SCHOOL BACKGROUNDS 2014](https://alte.itch.io/uncle-mugens-school) 中的 `png.zip`

包内附带的《Terms of Usage》原文（已保存副本）：

- `docs/licenses/uncle-mugen-terms-of-usage.txt`
- `docs/licenses/uncle-mugen-pack1-school-terms-of-usage.txt`

条款要点：可用于商业与免费项目；允许修改；“just take them… no strings attached”。整理页另外写明请署名 Uncle Mugen。本游戏署名：Uncle Mugen (mugenjohncel)。

处理：统一中心裁切为 16:9，缩放到 1920×1080 JPEG。未新绘制内容。

| 游戏文件 | 原文件 | 选用理由与局限 |
| --- | --- | --- |
| `public/game/background/title_rain.jpg` | `pack1/Modern Urban/street_rain_post_processed.webp` | 有雨丝的雨夜街道，比同包里更亮的 `street_bg_rain` 更衬官方标题页的白色菜单字。这是街区雨景，不是校门。 |
| `public/game/background/rainy_gate.jpg` | `pack1/School/WOHOO_May_bagyo_na_naman_walang_pasok.webp` | 包内唯一明显的恶劣天气校园外景（车棚/车位、地面积水）。不是传统拱门式校门。 |
| `public/game/background/library_rain.jpg` | `pack1/School/library.webp` | 学校图书馆/阅览大厅。画面偏白天，没有单独的“雨中图书馆”。 |
| `public/game/background/student_council.jpg` | `pack1/School/Classroom_05_day.webp` | 未找到专用学生会室，用布局较规整的教室代替。 |
| `public/game/background/archive_library.jpg` | `png/school/12.png`（2014 学校包） | 两层通高厅堂，作档案区/库房大厅。 |
| `public/game/background/old_hall_exterior.jpg` | `png/school/11.png`（2014 学校包） | 砖墙与玻璃门的楼体外观。 |
| `public/game/background/school_archive.jpg` | `png/school/06.png`（2014 学校包） | 带柜橱的小教室，作档案室。 |
| `public/game/background/radio_room.jpg` | `pack1/School/music_room_not_day.webp` | 有器材的音乐室夜景，最接近广播室。 |
| `public/game/background/archive_room.jpg` | `pack1/School/Classroom_05_night.webp` | 夜间教室，作夜里整理证据的房间。 |
| `public/game/background/sealed_corridor.jpg` | `pack1/School/school_corridor_background.webp` | 带储物柜的学校走廊。原图偏白天，不是“封死旧馆”的专用暗廊。 |
| `public/game/background/school_morning.jpg` | `png/school/01.png`（2014 学校包） | 有树木与草坪的教学楼庭院，作雨停后的早晨。 |
| `public/game/background/rainy_window.jpg` | `pack1/School/Classroom_04_evening.webp` | 未找到专用“雨窗”图，用黄昏靠窗教室代替。 |
| `public/game/background/school_garden.jpg` | `pack1/Modern Urban/lets_pretend_they_are_cherry_blossom.webp` | 樱花与绿地，适合春天结局。这是公园式场景，不是校园内花园。 |

13 张背景都是不同原图，没有把 SVG 占位留下来凑数。未能找到的专用构图（传统雨夜校门、雨窗特写、正式学生会室、封死走廊、校园内花园）已在上表注明，并改用同一套 Uncle Mugen 素材里最接近的画面。

## 发布前请注意

- 公开仓库或 GitHub Pages 发布时，请保留本文件与 `docs/licenses/` 中的条款副本，并在游戏内或仓库说明里署名 **onboroo**（CC BY 4.0，必须署名）和 **Uncle Mugen (mugenjohncel)**。
- 不要把 Uncle Mugen 或 onboroo 的原始素材包原样单独再分发成“素材合集”；把图片作为本游戏的一部分发布，符合上述条款。
- 背景是 3D 渲染风格的校园，立绘是手绘校服角色，两套画风并不完全同一作者；这是在明确许可范围内能找到的最接近“雨夜学园 Galgame”的组合。
- 本轮没有把素材推送到 GitHub。
