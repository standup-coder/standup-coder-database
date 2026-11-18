# 跨 JD 共享资产（shared/）

> 多个 JD 都会用到的东西放这里，**避免每个 JD 重复造**。解析新 JD 时先查这里。

---

## 内容

| 文件 | 用途 |
|------|------|
| [skills-library.md](./skills-library.md) | 通用技能库：按领域沉淀的核心能力，标注哪些 JD 需要 |
| [resources.md](./resources.md) | 通用资源：论文 / 开源源码 / benchmark / 信息源 |

---

## 使用规则

1. **解析新 JD 时**：抽出的技能先查 `skills-library.md`，已存在的直接在该 JD 里引用（不必重写），并在 shared 对应技能后补一个「✓ <JD目录>」标记。
2. **新出现的通用技能**（多个岗位都可能要的）回填到 `skills-library.md`。
3. **JD 专属技能**（只此一家要的）留在该 JD 的 study 里，不进 shared。
4. **资源**：发现新的高质量论文/源码/基准，补到 `resources.md`，所有 JD 共享。

> 原则：shared 放「领域通用」，jobs/<jd>/ 放「岗位专属」。重复出现的就提升到 shared。
