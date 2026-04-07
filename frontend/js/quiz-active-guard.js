/**
 * While a training quiz screen is active, blocks context menu and copy/cut on that
 * subtree to add friction (not a security boundary — cannot stop a determined user).
 */
(function () {
  var root = null;
  function block(e) {
    e.preventDefault();
  }
  window.trainQuizHardGuard = function setTrainQuizHardGuard(el) {
    if (root === el) return;
    if (root) {
      root.removeEventListener("copy", block);
      root.removeEventListener("cut", block);
      root.removeEventListener("contextmenu", block);
    }
    root = el || null;
    if (!root) return;
    root.addEventListener("copy", block);
    root.addEventListener("cut", block);
    root.addEventListener("contextmenu", block);
  };
})();
