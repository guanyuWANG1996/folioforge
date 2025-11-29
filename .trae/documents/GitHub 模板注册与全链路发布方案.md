## 目标
- 提供模板注册入口：仅凭 `repoUrl` 与 `distPath` 即可从 GitHub 拉取静态资源与清单，自动解析生成符合 `types.ts` 约束的模板数据。
- 去除数据驱动中的硬编码，所有编辑器字段与预览由模板 schema 驱动，足够灵活。
- 完成模板托管、Editor 自适应 UI、Preview 正确渲染；随后接入 Vercel API + Webhook 打通部署链路。

## 数据模型与约束
- 使用现有类型：`types.ts:16-30` 的 `Template` 已包含 `repoUrl`、`distPath`、`engine`、`schema`、`demoData` 字段。
- 运行时校验：新增 JSON 校验器（如 Zod 或轻量自定义校验），保证 `TemplateSchema/TemplateField` 形状满足 `types.ts:32-55`。
- 清单文件约定：模板仓库的 `distPath` 下提供 `folioforge.template.json`（或 `schema.json` + `index.hbs`），包含：
  - 基本信息：`name/description/thumbnail/tags/style`
  - 引擎：`engine: 'handlebars'`
  - `schema: TemplateSchema`（编辑器驱动）
  - `demoData: Record<string, any>`（预览占位）
  - `files: { main: 'index.hbs', partials?: string[] }`

## 注册工作流（后端 API）
1. POST `/api/template/register` body: `{ repoUrl, distPath, branch? }`
2. 解析 repo 信息，拼 raw 内容地址（或 GitHub Contents API）拉取 `folioforge.template.json`；若不存在则回退读取 `schema.json` 与 `index.hbs`。
3. 校验 JSON → 归一化为 `Template` 类型；写入模板库（开发期可用本地 JSON/SQLite，生产迁移到持久化 DB）。
4. 拉取 `index.hbs` 与 `partials/` 目录，存储为静态资源，挂载 `/api/templates/:id/source` 与 `/api/templates/:id/partials/*`。
5. GET `/api/templates` 提供列表；GET `/api/templates/:id` 提供详情；PUT `/api/templates/:id` 支持清单更新与重拉取。

## 去硬编码与灵活化
- 替换 `constants.ts` 中的内置模板与字段，改为从 `/api/templates` 获取列表，选择后加载其 `schema` 与 `demoData`。
- Editor 使用动态表单：`components/SchemaForm.tsx:158-168`、`components/SchemaForm.tsx:103-114` 已按 `TemplateSchema` 渲染；保留现有控件，删除与模板耦合的常量。
- 版本数据结构保持不变：`PortfolioVersion.data` 承载模板数据（`types.ts:58-66`）。

## Editor 自适应 UI
- 依据 `TemplateSchema.sections[].fields[]` 动态生成控件；扩展字段属性兼容：`required/default/validation/items/options`（`types.ts:44-54`）。
- 字段类型支持现有限定：`text/textarea/select/color/image/repeatable`（`types.ts:42-43`）。必要时允许模板端提供 `ui` hints（如占位符、说明、布局），不破坏现有类型。
- 保存与 AI 功能保持：Editor 只读 `schema` 与写 `data`；不再依赖固定键名。

## Preview 正确性
- 预览编译：`components/PreviewFrame.tsx:84-93` 会请求 `/api/templates/:id/source`，用 Handlebars 编译。
- 数据归一化：保留 `normalizeData` 的基本映射（`components/PreviewFrame.tsx:35-52`），但将其最小化；优先以模板 `schema` 字段直接渲染。
- 资源托管：注册时将 `index.hbs` 与 `partials` 缓存到静态目录，确保预览与发布一致。

## 模板托管策略
- 开发：拉取 GitHub raw → 写入本地缓存（如 `public/templates/{id}/`）。
- 生产：拉取后上传到对象存储（或 Vercel 静态目录），服务端透传 `/api/templates/:id/source`。
- 缓存与失效：Etag/Last-Modified 校验；提供 `forceRefresh` 参数触发重拉取。

## 部署集成（Vercel）
- 新增后端封装：
  - POST `/api/deploy/start` → 生成产物（将模板源 + `PortfolioVersion.data` 渲染为静态站点）→ 调用 Vercel Deploy API（项目创建/部署）
  - Webhook `/api/deploy/webhook` → 接收状态，更新 `Deployment`（`types.ts:68-80`）并回写 URL
- 配置：使用环境变量 `VERCEL_TOKEN`、`VERCEL_PROJECT` 前缀等；对不同模板可按 `style` 或 `engine` 选择构建模式（纯静态/SSR 禁用）。

## 安全与健壮性
- 输入校验：严格校验 `repoUrl/distPath/branch`；仅允许 `https://github.com/<owner>/<repo>`。
- 内容限制：只解析清单与模板文件，禁止执行脚本；对 HTML 输出进行必要的消毒（Handlebars 默认转义，图片/链接白名单）。
- 失败处理：回退到 `demoData` 预览；注册失败时返回详细错误码与日志。

## 测试与验证
- 单元测试：清单解析、schema 校验、字段映射、预览编译。
- 集成测试：注册 → 列表 → 详情 → 预览 → 部署链路；模拟 GitHub 网络错误与清单缺失场景。
- 基准模板：提供一个示例仓库含 `folioforge.template.json` 与 `index.hbs`，作为回归用例。

## 迁移与兼容
- 第一阶段：保留 `constants.ts` 作为后备；优先展示注册模板。
- 第二阶段：移除硬编码模板与字段，统一由注册清单驱动；旧版本数据通过 `normalizeData` 兼容。

## 交付物
- 后端：模板注册/解析/缓存 API、模板列表/详情 API、预览源服务、部署与 webhook。
- 前端：模板注册表单与状态页面、Editor 动态渲染无硬编码、Preview 统一从源编译。
- 文档：清单规范与示例、API 契约、部署配置说明。