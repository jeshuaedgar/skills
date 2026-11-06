// Waits up to 15 s for the view to load and returns { ok, ... }. No screenshot.
// Set MARKER (required) to the view's marker. Set ORIGIN (optional) to the dev server
// origin, e.g. http://localhost:3000.
// Function-style tools (Playwright browser_evaluate, DevTools evaluate_script): pass as is.
// Expression-style tools (T3 preview_evaluate, page.evaluate): wrap as `(<file>)()`.
async function healthCheck() {
  const MARKER = "";
  const ORIGIN = "";
  const TIMEOUT = 15000;
  const SETTLE = 500;

  if (!MARKER) return { ok: false, error: "MARKER is not set" };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const check = () => {
    const main = document.querySelector("main");
    const skeletons = [...document.querySelectorAll("[data-slot=skeleton]")].filter((el) =>
      el.checkVisibility(),
    ).length;
    const result = {
      url: location.href,
      title: document.title,
      ready: document.readyState === "complete",
      origin: !ORIGIN || location.origin === ORIGIN,
      marker: document.body.innerText.includes(MARKER),
      overlay: Boolean(document.querySelector("vite-error-overlay")),
      skeletons,
      mainText: ((main || document.body).innerText || "").trim().length,
    };
    result.ok =
      result.ready &&
      result.origin &&
      result.marker &&
      !result.overlay &&
      result.skeletons === 0 &&
      result.mainText > 0;
    return result;
  };

  const deadline = Date.now() + TIMEOUT;
  let result = check();
  while (!result.ok && Date.now() < deadline) {
    await sleep(250);
    result = check();
  }
  if (result.ok) {
    await sleep(SETTLE);
    result = check();
  }
  return result;
}
