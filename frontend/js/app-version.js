/**
 * Fills every .train-app-version from GET /api/live (no auth).
 */
(function () {
  function fill() {
    fetch("/api/live")
      .then(function (r) {
        return r.json().catch(function () {
          return {};
        });
      })
      .then(function (d) {
        var nodes = document.querySelectorAll(".train-app-version");
        if (!nodes.length || !d || !d.version) return;
        var text = "App version " + d.version + ".";
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].textContent = text;
        }
      })
      .catch(function () {});
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fill);
  } else {
    fill();
  }
})();
