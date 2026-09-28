(function () {
  try {
    var stored = localStorage.getItem("icocraft-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (stored !== "light" && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch (error) {
    // Storage or matchMedia unavailable: fall back to the light theme.
  }
})();