(function () {
  try {
    var stored = localStorage.getItem("airhop-theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.dataset.theme = stored;
    }
  } catch {
    return;
  }
})();
