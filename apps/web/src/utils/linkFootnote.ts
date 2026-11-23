// 主题可以通过原有的 .footnotes-sep:before 自定义标题。
export const referenceHeadingCss =
  '.reference-heading:before { content: "参考资料"; }';

// 文末手写的独立网址已可直接复制，保留作者的条目顺序和说明。
function getBibliographyHeading(root: DocumentFragment): Element | undefined {
  const headings = Array.from(root.children).filter((el) =>
    /^H[1-6]$/.test(el.tagName),
  );
  const last = headings.at(-1);
  return last &&
    /^(参考资料|参考文献|参考链接|References)$/i.test(
      (last.textContent ?? "").trim(),
    )
    ? last
    : undefined;
}

function webAddress(anchor: Element): string | undefined {
  const href = anchor.getAttribute("href")?.trim() ?? "";
  if (href.startsWith("//")) return "https:" + href;
  return /^https?:\/\//i.test(href) ? href : undefined;
}

export function convertLinksToFootnotes(html: string): string {
  const template = document.createElement("template");
  template.innerHTML = html;
  const root = template.content;
  const anchors = Array.from(root.querySelectorAll("a[href]"));
  if (!anchors.length) return html;

  const heading = getBibliographyHeading(root);
  const existing = new Set<string>();
  if (heading) {
    for (const anchor of anchors) {
      const url = webAddress(anchor);
      const p = anchor.parentElement;
      if (
        url &&
        p?.tagName === "P" &&
        p.textContent?.trim() === url &&
        anchor.textContent?.trim() === url &&
        heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING
      ) {
        existing.add(url);
        anchor.replaceWith(url);
      }
    }
  }

  const notes = new Map<string, { number: number; label: string }>();
  for (const anchor of anchors) {
    const url = webAddress(anchor);
    if (!url || !anchor.parentNode || anchor.closest("pre, code")) continue;
    const word = document.createElement("span");
    for (const { name, value } of anchor.attributes) {
      if (
        ["class", "id", "style", "lang", "dir"].includes(name) ||
        name.startsWith("data-")
      ) {
        word.setAttribute(name, value);
      }
    }
    word.classList.add("footnote-word");
    const label =
      anchor.getAttribute("title") ||
      anchor.textContent?.trim() ||
      anchor.querySelector("img")?.alt ||
      "";
    word.append(...Array.from(anchor.childNodes));
    anchor.replaceWith(word);
    if (existing.has(url)) continue;

    let note = notes.get(url);
    if (!note) {
      note = { number: notes.size + 1, label: label === url ? "" : label };
      notes.set(url, note);
    }
    const marker = document.createElement("sup");
    marker.className = "footnote-ref";
    marker.textContent = "[" + note.number + "]";
    word.after(marker);
  }

  if (notes.size) {
    if (!heading) {
      const title = document.createElement("h3");
      title.className = "footnotes-sep reference-heading";
      root.append(title);
    }
    const footer = document.createElement("section");
    footer.className = "footnotes";
    for (const [url, note] of notes) {
      const item = document.createElement("div");
      item.className = "footnote-item";
      item.style.flexDirection = "column";
      const label = document.createElement("p");
      const number = document.createElement("span");
      number.className = "footnote-num";
      number.textContent = `[${note.number}]`;
      label.append(number);
      if (note.label) label.append(" " + note.label);
      const address = document.createElement("p");
      address.style.display = "block";
      address.style.overflowWrap = "anywhere";
      address.style.wordBreak = "break-all";
      address.textContent = url;
      item.append(label, address);
      footer.append(item);
    }
    root.append(footer);
  }
  return template.innerHTML;
}
