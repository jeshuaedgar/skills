// Font sizes of visible text: a size/weight histogram and text under 12px (first 25).
// Function-style tools (Playwright browser_evaluate, DevTools evaluate_script): pass as is.
// Expression-style tools (T3 preview_evaluate, page.evaluate): wrap as `(<file>)()`.
function fontSizes() {
  const root = document.querySelector("main") || document.body;
  const counts = new Map();
  const small = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent.replace(/\s+/g, " ").trim();
    const element = node.parentElement;
    if (!text || !element) continue;
    if (!element.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    const box = element.getBoundingClientRect();
    // Skip visually hidden text (sr-only and similar clip it to 1px).
    if (box.width <= 1 || box.height <= 1) continue;
    const style = getComputedStyle(element);
    const key = `${style.fontSize} ${style.fontWeight}`;
    const entry = counts.get(key) || { elements: 0, characters: 0 };
    entry.elements += 1;
    entry.characters += text.length;
    counts.set(key, entry);
    if (parseFloat(style.fontSize) < 12 && small.length < 25) {
      small.push(`${style.fontSize} ${element.tagName.toLowerCase()}: ${text.slice(0, 50)}`);
    }
  }
  return {
    url: location.href,
    histogram: [...counts.entries()]
      .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]) || a[0].localeCompare(b[0]))
      .map(([key, entry]) => ({ sizeWeight: key, ...entry })),
    under12px: small,
  };
}
