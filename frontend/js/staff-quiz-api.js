(function (w) {
  w.fprStaffQuizApi = {
    resetServer: function (slug) {
      return fetch("/api/training/staff-quiz-reset", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slug }),
      }).then(function (r) {
        if (!r.ok) return Promise.reject(new Error("Could not reset quiz session."));
        return r.json();
      });
    },
    fetchQuestions: function (slug) {
      return fetch(
        "/api/training/staff-quiz-questions?slug=" + encodeURIComponent(slug),
        { credentials: "same-origin" }
      ).then(function (r) {
        return r.json().then(function (data) {
          if (!r.ok) {
            const err = new Error(
              (data && data.message) || "Could not load questions."
            );
            err.httpStatus = r.status;
            return Promise.reject(err);
          }
          return data;
        });
      });
    },
    verify: function (slug, index, choiceIndex) {
      return fetch("/api/training/staff-quiz-verify", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug,
          index: index,
          choiceIndex: choiceIndex,
        }),
      }).then(function (r) {
        return r.json().then(function (data) {
          if (!r.ok) {
            const err = new Error(
              (data && data.message) || "Could not verify answer."
            );
            err.httpStatus = r.status;
            err.body = data;
            return Promise.reject(err);
          }
          return data;
        });
      });
    },
    summary: function (slug) {
      return fetch("/api/training/staff-quiz-summary", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slug }),
      }).then(function (r) {
        return r.json().then(function (data) {
          if (!r.ok) {
            const err = new Error(
              (data && data.message) || "Could not load results."
            );
            err.httpStatus = r.status;
            return Promise.reject(err);
          }
          return data;
        });
      });
    },
  };
})(window);
