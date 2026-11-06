// axe-core check of the whole page (WCAG 2.0, 2.1 and 2.2, A and AA), trimmed to stay small.
// Loads a pinned axe-core from a CDN if needed.
// Function-style tools (Playwright browser_evaluate, DevTools evaluate_script): pass as is.
// Expression-style tools (T3 preview_evaluate, page.evaluate): wrap as `(<file>)()`.
async function axeCheck() {
  const VERSION = "4.10.2";
  const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

  try {
    if (!window.axe) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://cdn.jsdelivr.net/npm/axe-core@${VERSION}/axe.min.js`;
        script.onload = resolve;
        script.onerror = () =>
          reject(new Error("axe-core failed to load (offline or blocked by CSP)"));
        document.head.appendChild(script);
      });
    }
    const result = await window.axe.run(document, {
      runOnly: { type: "tag", values: TAGS },
      resultTypes: ["violations", "incomplete"],
    });
    const summarise = (rule, limit) => ({
      id: rule.id,
      impact: rule.impact,
      help: rule.help,
      nodes: rule.nodes.length,
      examples: rule.nodes.slice(0, limit).map((node) => ({
        target: node.target.join(" "),
        html: node.html.slice(0, 160),
        summary: (node.failureSummary || "").slice(0, 300),
      })),
    });
    return {
      url: location.href,
      colorScheme: document.documentElement.classList.contains("dark") ? "dark" : "light",
      violations: result.violations.map((rule) => summarise(rule, 5)),
      incomplete: result.incomplete.map((rule) => summarise(rule, 2)),
      passes: result.passes.length,
    };
  } catch (error) {
    return { url: location.href, error: String(error && error.message ? error.message : error) };
  }
}
