import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocked = vi.hoisted(() => ({
  electronClipboardWrite: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../services/wechatMathCompat", () => ({
  renderHighRiskMathAsImages: vi.fn(async () => false),
  stripHiddenMathMarkupForWechat: vi.fn(),
}));

vi.mock("../../services/wechatMermaidRenderer", () => ({
  renderMermaidBlocks: vi.fn(async () => undefined),
}));

import { copyToWechat } from "../../services/wechatCopyService";

describe("公众号复制属性语法", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    });
    mocked.electronClipboardWrite.mockResolvedValue({ success: true });
    Object.defineProperty(window, "electron", {
      configurable: true,
      value: {
        isElectron: true,
        platform: "darwin",
        clipboard: { writeHTML: mocked.electronClipboardWrite },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("在离屏 DOM 和剪贴板中均排除原生 HTML 活动内容", async () => {
    const insertedHtml: string[] = [];
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof Element) insertedHtml.push(node.outerHTML);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    try {
      await copyToWechat(
        '<p class="summary">保留正文</p><img src="data:image/png;base64,broken" onerror="window.reviewProbe=1"><a href="javascript:window.reviewProbe=1">链接</a>',
        "#wemd .summary { color: red; }",
      );
      const [payload] = mocked.electronClipboardWrite.mock.calls[0] as [
        { html: string },
      ];
      expect(payload.html).toContain("保留正文");
      expect(payload.html).not.toMatch(/onerror|javascript:/i);
      expect(insertedHtml.length).toBeGreaterThan(0);
      expect(insertedHtml.join("\n")).not.toMatch(/onerror|javascript:/i);
    } finally {
      observer.disconnect();
    }
  });

  it("按合法属性匹配自定义 CSS 并写入最终剪贴板 HTML", async () => {
    await copyToWechat(
      "摘要内容。 {.summary data-kind=abstract}",
      '#wemd .summary[data-kind="abstract"] { color: rgb(180, 0, 0); }',
    );

    const [payload] = mocked.electronClipboardWrite.mock.calls[0] as [
      { html: string; text: string },
    ];
    expect(payload.html).toContain('class="summary"');
    expect(payload.html).toContain('data-kind="abstract"');
    expect(payload.html).toContain("color: rgb(180, 0, 0)");
    expect(payload.html).not.toContain("data-tool");
    expect(payload.html).not.toContain("data-wemd-source-");
  });

  it("把带标题、引用式和重复链接汇入文末静态网址段落", async () => {
    const paper = "https://example.org/paper.pdf?lang=en&v=2#page=41";
    const otherPage = paper.replace("#page=41", "#page=9");
    const official = "https://mp.weixin.qq.com/s/example";
    const markdown = [
      `参见[**文献甲**](${paper} "实验数据")、[复引][same]以及[另一页](${otherPage})。`,
      `原文 <${official}>。`,
      `[same]: ${paper}`,
    ].join("\n\n");
    await copyToWechat(markdown, "");
    const { html, text } = mocked.electronClipboardWrite.mock.calls[0][0];
    const doc = new DOMParser().parseFromString(html, "text/html");
    expect(doc.querySelector("a[href]")).toBeNull();
    expect(doc.querySelector("strong")?.textContent).toBe("文献甲");
    expect(
      [...doc.querySelectorAll("sup")].map((el) => el.textContent),
    ).toEqual(["[1]", "[1]", "[2]", "[3]"]);
    expect(doc.querySelector("h3")?.textContent).toBe("参考资料");
    expect(
      [...doc.querySelectorAll(".footnotes p")].map((el) => el.textContent),
    ).toEqual([
      "[1] 实验数据",
      paper,
      "[2] 另一页",
      otherPage,
      "[3]",
      official,
    ]);
    expect(text).toContain(paper);
  });

  it("为图片、链接和行内格式内联局部样式", async () => {
    await copyToWechat(
      "![封面](https://example.com/cover.png){.hero-image #cover}\n\n[查看详情](https://example.com){.cta-link}\n\n这是 **重点内容**{.inline-highlight}。",
      `
        #wemd .hero-image { border-radius: 12px; }
        #wemd .cta-link { color: rgb(0, 90, 180); }
        #wemd .inline-highlight { background-color: rgb(255, 230, 120); }
      `,
    );

    const [payload] = mocked.electronClipboardWrite.mock.calls[0] as [
      { html: string; text: string },
    ];
    expect(payload.html).toContain('class="hero-image"');
    expect(payload.html).toContain('id="cover"');
    expect(payload.html).toContain("border-radius: 12px");
    const doc = new DOMParser().parseFromString(payload.html, "text/html");
    expect(doc.querySelector(".cta-link.footnote-word")?.textContent).toBe(
      "查看详情",
    );
    expect(payload.html).toContain("color: rgb(0, 90, 180)");
    expect(payload.html).toContain('class="inline-highlight"');
    expect(payload.html).toContain("background-color: rgb(255, 230, 120)");
    expect(payload.html).not.toContain("data-tool");
  });
  it("在最终剪贴板 HTML 中修正公众号不兼容属性", async () => {
    await copyToWechat(
      `正文内容。 {.spec-align}

<svg viewBox="0 0 10 10">
  <circle cx="5" cy="5" r="4">
    <animate attributeName="opacity" begin="touchstart" dur="1s"></animate>
  </circle>
</svg>`,
      `
        #wemd .spec-align {
          text-align: start;
          caret-color: rgba(0, 0, 0, 0);
        }
      `,
    );

    const [payload] = mocked.electronClipboardWrite.mock.calls[0] as [
      { html: string; text: string },
    ];
    expect(payload.html).toContain("text-align: left");
    expect(payload.html).not.toMatch(/text-align:\s*(start|end)/i);
    expect(payload.html).not.toContain("caret-color");
    // Raw SVG animation is active content and is removed before DOM insertion.
    expect(payload.html).not.toContain("<animate");
    expect(payload.html).toContain("<circle");
  });
});
