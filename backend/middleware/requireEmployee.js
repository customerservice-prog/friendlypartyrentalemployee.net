/**
 * Requires POST /api/employee/login success (session.employeeAuthenticated).
 */
function requireEmployee(req, res, next) {
  if (req.session && req.session.employeeAuthenticated) {
    return next();
  }
  res.set("Cache-Control", "no-store");
  return res.status(401).json({
    error: "employee_login_required",
    message: "Sign in with your employee PIN to use this.",
  });
}

function normalizeBodyQuizSlug(body) {
  const raw =
    body && body.quizSlug != null ? String(body.quizSlug).trim() : "";
  const slug = raw.replace(/[^a-z0-9-]/gi, "").slice(0, 64) || "pricing";
  return slug;
}

/**
 * Allows POST /api/submit for the pricing quiz without staff PIN so applicants
 * can save results after a server-validated attempt (pricingLastSummary).
 * Other quiz slugs still require employee session.
 */
function requireEmployeeUnlessApplicantPricingSubmit(req, res, next) {
  if (req.method === "POST" && req.body && typeof req.body === "object") {
    if (normalizeBodyQuizSlug(req.body) === "pricing") {
      return next();
    }
  }
  return requireEmployee(req, res, next);
}

module.exports = {
  requireEmployee,
  requireEmployeeUnlessApplicantPricingSubmit,
};
