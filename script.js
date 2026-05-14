/* Tianshun Xing — Portfolio interactions
   Lightweight: scroll reveal + smooth focus ring. No external deps. */

(function () {
  "use strict";

  /* ------------- Scroll reveal ------------- */
  const revealTargets = [
    ".hero__main > *",
    ".hero__meta",
    ".section__head > *",
    ".abstract > *",
    ".entry",
    ".paper",
    ".contact__lead",
    ".contact__card",
    ".cite",
  ];

  const allTargets = [];
  revealTargets.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute("data-reveal", "");
      // Stagger by group, capped to keep things snappy
      const delay = Math.min(i * 70, 420);
      el.style.setProperty("--delay", delay + "ms");
      allTargets.push(el);
    });
  });

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    allTargets.forEach((el) => io.observe(el));

    // Fail-safe: after 4s, force-reveal anything still hidden so the
    // page is never stuck blank (e.g. on very fast / programmatic scroll
    // or if the browser throttles IntersectionObserver).
    setTimeout(() => {
      allTargets.forEach((el) => el.classList.add("is-visible"));
    }, 4000);
  } else {
    allTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------- Topbar shadow on scroll ------------- */
  const topbar = document.querySelector(".topbar");
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (y > 12) topbar.style.boxShadow = "0 1px 0 rgba(24,22,19,0.06)";
    else topbar.style.boxShadow = "none";
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------- Tiny touch: live time in metadata ------------- */
  const statusEl = document.querySelector(".meta-row .meta-val .dot");
  if (statusEl) {
    const parent = statusEl.parentElement;
    const updateStatus = () => {
      const now = new Date();
      const hr = now.getHours();
      const isAwake = hr >= 9 && hr <= 23;
      parent.lastChild &&
        parent.childNodes.forEach((n) => {
          if (n.nodeType === 3) n.textContent = isAwake ? " open to research collab" : " typically asleep · email anyway";
        });
    };
    updateStatus();
  }

  /* ------------- "Cite as" — copy on click ------------- */
  const citeBlock = document.querySelector(".cite__block");
  if (citeBlock) {
    citeBlock.style.cursor = "pointer";
    citeBlock.title = "Click to copy BibTeX";
    citeBlock.addEventListener("click", async () => {
      const text = citeBlock.innerText;
      try {
        await navigator.clipboard.writeText(text);
        const original = citeBlock.style.background;
        citeBlock.style.transition = "background 0.3s ease";
        citeBlock.style.background = "#b9381b";
        const flash = document.createElement("div");
        flash.textContent = "✓ copied to clipboard";
        flash.style.cssText =
          "position:absolute;top:8px;right:12px;font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:.18em;color:#f3ede0;background:rgba(0,0,0,.2);padding:4px 8px;border-radius:3px;pointer-events:none;";
        const wrapper = citeBlock.parentElement;
        if (getComputedStyle(wrapper).position === "static") wrapper.style.position = "relative";
        wrapper.appendChild(flash);
        setTimeout(() => {
          citeBlock.style.background = original || "var(--ink)";
          flash.remove();
        }, 1300);
      } catch (e) {
        // Fallback ignored
      }
    });
  }
})();
