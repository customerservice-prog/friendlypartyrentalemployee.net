const nodemailer = require("nodemailer");

const DEFAULT_TO = "customerservice@friendlypartyrental.com";

function isReasonableSingleEmail(s) {
  const t = String(s).trim();
  if (t.length > 254 || t.length < 3) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

function resolveResultsEmailTo() {
  const raw = process.env.RESULTS_EMAIL_TO;
  if (!raw || String(raw).trim() === "") return DEFAULT_TO;
  const t = String(raw).trim();
  if (!isReasonableSingleEmail(t)) {
    console.warn(
      "RESULTS_EMAIL_TO is not a valid email address — using default " +
        DEFAULT_TO
    );
    return DEFAULT_TO;
  }
  return t;
}

function isEmailConfigured() {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.EMAIL_FROM
  );
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildTransporter() {
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.SMTP_SECURE === "1" ||
    port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Sends quiz submission summary to the owner inbox.
 * Requires: SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM
 * Optional: RESULTS_EMAIL_TO (defaults to customerservice@friendlypartyrental.com)
 */
async function sendQuizResultEmail(payload) {
  if (!isEmailConfigured()) {
    console.warn(
      "Quiz results email skipped: set SMTP_HOST, SMTP_USER, SMTP_PASS, and EMAIL_FROM"
    );
    return { sent: false, reason: "not_configured" };
  }

  const to = resolveResultsEmailTo();

  const {
    name,
    employeeEmail,
    jobTitle,
    quizSlug,
    score,
    total,
    percent,
    timeTaken,
    passed,
    missedQuestions,
    submissionId,
  } = payload;

  const empEmailLine = employeeEmail
    ? escHtml(String(employeeEmail))
    : "—";
  const jobTitleLine = jobTitle ? escHtml(String(jobTitle)) : "—";

  const missed = Array.isArray(missedQuestions) ? missedQuestions : [];
  const missedHtml = missed.length
    ? `<ul style="margin:0;padding-left:1.1rem;line-height:1.5">${missed
        .map(
          (m) =>
            `<li style="margin-bottom:0.65rem"><strong>${escHtml(
              m.question || ""
            )}</strong><br/><span style="color:#555">Their answer:</span> ${escHtml(
              String(m.yourAnswer ?? "")
            )}<br/><span style="color:#555">Correct:</span> ${escHtml(
              String(m.correctAnswer ?? "")
            )}</li>`
        )
        .join("")}</ul>`
    : "<p style=\"margin:0;color:#15803d\">No missed questions — perfect score on every item.</p>";

  const subjectSafe = String(name)
    .replace(/[\r\n\u0000]/g, " ")
    .trim()
    .slice(0, 120);
  const subject = `[Employee Quiz] ${subjectSafe} — ${score}/${total} (${percent}%)${passed ? " — PASS" : " — did not pass"}`;

  const html = `<!DOCTYPE html><html><body style="font-family:Inter,Segoe UI,system-ui,sans-serif;background:#f4f4f5;padding:24px;margin:0">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.08)">
    <tr><td style="background:linear-gradient(135deg,#1e3a5f,#0f172a);color:#f5e6a8;padding:22px 24px;font-size:18px;font-weight:700">Friendly Party Rental · Quiz result</td></tr>
    <tr><td style="padding:24px;color:#1a1a2e">
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5"><strong>Employee:</strong> ${escHtml(
        name
      )}</p>
      <p style="margin:0 0 6px"><strong>Email:</strong> ${empEmailLine}</p>
      <p style="margin:0 0 6px"><strong>Job title:</strong> ${jobTitleLine}</p>
      <p style="margin:0 0 12px"><strong>Quiz:</strong> ${escHtml(
        String(quizSlug || "pricing")
      )}</p>
      <p style="margin:0 0 8px"><strong>Score:</strong> ${score} / ${total} (${percent}%)</p>
      <p style="margin:0 0 8px"><strong>Result:</strong> ${
        passed ? "✅ Pass" : "❌ Did not pass"
      }</p>
      <p style="margin:0 0 8px"><strong>Time taken:</strong> ${escHtml(
        String(timeTaken)
      )}</p>
      ${
        submissionId != null
          ? `<p style="margin:0 0 20px;font-size:13px;color:#64748b">Submission ID: ${escHtml(
              String(submissionId)
            )}</p>`
          : "<p style=\"margin:0 0 20px\"></p>"
      }
      <h2 style="margin:0 0 10px;font-size:15px;border-bottom:1px solid #e2e8f0;padding-bottom:8px">Missed questions</h2>
      ${missedHtml}
    </td></tr>
  </table>
  <p style="text-align:center;font-size:12px;color:#94a3b8;margin-top:16px">Sent automatically from the employee quiz app.</p>
</body></html>`;

  const text = [
    `Friendly Party Rental — Employee quiz result`,
    `Employee: ${name}`,
    `Email: ${employeeEmail || "—"}`,
    `Job title: ${jobTitle || "—"}`,
    `Quiz: ${quizSlug || "pricing"}`,
    `Score: ${score} / ${total} (${percent}%)`,
    `Result: ${passed ? "Pass" : "Did not pass"}`,
    `Time: ${timeTaken}`,
    submissionId != null ? `Submission ID: ${submissionId}` : "",
    "",
    missed.length
      ? "Missed questions:\n" +
        missed
          .map(
            (m, i) =>
              `${i + 1}. ${m.question}\n   Their answer: ${m.yourAnswer}\n   Correct: ${m.correctAnswer}`
          )
          .join("\n\n")
      : "No missed questions.",
  ]
    .filter(Boolean)
    .join("\n");

  const transporter = buildTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });

  console.log(`Quiz results email sent to ${to}`);
  return { sent: true, to };
}

module.exports = {
  isEmailConfigured,
  sendQuizResultEmail,
  DEFAULT_RESULTS_EMAIL: DEFAULT_TO,
};
