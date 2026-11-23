import { describe, expect, it } from "vitest";
import { createMarkdownParser } from "@wemd/core";
import { convertLinksToFootnotes } from "../../utils/linkFootnote";

function render(markdown: string) {
  const parser = createMarkdownParser({ collectReferenceLinks: true });
  const html = convertLinksToFootnotes(parser.render(markdown));
  return new DOMParser().parseFromString(html, "text/html").body;
}

describe("公众号文末参考资料", () => {
  it("识别正文裸网址，保留段内链接格式并排除锚点、代码和普通插图", () => {
    const root = render(
      [
        "原文 https://example.org/guide?q=x#part 和 <a href='//example.org/more'><em>补充</em></a>。",
        "[目录](#toc) 与 `https://example.org/code`。",
        "![图注](https://example.org/image.png)",
      ].join("\n\n"),
    );
    expect(root.querySelector("em")?.textContent).toBe("补充");
    expect(root.querySelector("a[href='#toc']")).not.toBeNull();
    expect(root.querySelector("img")?.getAttribute("src")).toBe(
      "https://example.org/image.png",
    );
    const urls = [...root.querySelectorAll(".footnotes p")]
      .map((el) => el.textContent)
      .filter((s) => s?.startsWith("https:"));
    expect(urls).toEqual([
      "https://example.org/guide?q=x#part",
      "https://example.org/more",
    ]);
  });

  it("复用作者文末的参考文献段落，保留没有网址的出版信息", () => {
    const url = "https://example.org/original#page=7";
    const root = render(
      `正文[来源](${url})。\n\n## 参考文献\n\n作者，书名，2024。\n\n${url}`,
    );
    expect(root.querySelectorAll("h2,h3")).toHaveLength(1);
    expect(root.querySelector("a[href]")).toBeNull();
    expect(root.textContent).toContain("作者，书名，2024。");
    expect(root.lastElementChild?.textContent).toBe(url);
    expect(root.textContent?.split(url)).toHaveLength(2);
  });
});
