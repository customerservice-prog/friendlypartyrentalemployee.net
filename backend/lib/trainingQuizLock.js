const { TRAINING_QUIZ_CHAT_LOCK_TTL_MS } = require("./trainingConstants");

function activeTrainingQuizLock(req) {
  if (!req.session) return null;
  const lock = req.session.trainingQuizLock;
  if (!lock || typeof lock.at !== "number" || !Number.isFinite(lock.at)) {
    return null;
  }
  if (Date.now() - lock.at > TRAINING_QUIZ_CHAT_LOCK_TTL_MS) {
    delete req.session.trainingQuizLock;
    return null;
  }
  return lock;
}

function touchTrainingQuizLock(req, slug) {
  req.session.trainingQuizLock = {
    slug: String(slug || "quiz").slice(0, 64),
    at: Date.now(),
  };
}

function clearTrainingQuizLock(req) {
  delete req.session.trainingQuizLock;
}

module.exports = {
  activeTrainingQuizLock,
  touchTrainingQuizLock,
  clearTrainingQuizLock,
};
