// Quiz storage.
//
// data.js holds the built-in quiz. Edits made on the settings page are saved
// in the browser's localStorage and take priority over data.js. Every page
// reads the quiz through getQuiz() so both sources look the same:
//
//   {
//     title: "...",
//     subtitle: "...",
//     rounds: [{ name: "...", question: "...", answers: [{ answer: "...", points: 10 }] }]
//   }

var QUIZ_STORAGE_KEY = "familyFortunes.quiz";
var MAX_ANSWERS = 9; // keyboard shortcuts only go from 1 to 9

var cachedQuiz = null;

function getDefaultQuiz() {
  var names = (typeof roundNames !== "undefined") ? roundNames : [];
  var titles = (typeof quizTitle !== "undefined") ? quizTitle : {};
  var questions = (typeof questiondata !== "undefined") ? questiondata : [];

  return normaliseQuiz({
    title: titles.title,
    subtitle: titles.subtitle,
    rounds: questions.map(function(q, i) {
      return {
        name: names[i],
        question: q.question,
        answers: q.answers
      };
    })
  });
}

// Turns anything quiz-shaped into a clean quiz object, or returns null if it
// isn't usable (used for saved data and imported files).
function normaliseQuiz(raw) {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.rounds)) {
    return null;
  }

  var rounds = [];
  for (var i = 0; i < raw.rounds.length; i++) {
    var r = raw.rounds[i];
    if (!r || typeof r !== "object") {
      return null;
    }
    var answers = [];
    var rawAnswers = Array.isArray(r.answers) ? r.answers : [];
    for (var j = 0; j < rawAnswers.length && j < MAX_ANSWERS; j++) {
      var a = rawAnswers[j] || {};
      answers.push({
        answer: toText(a.answer),
        points: toPoints(a.points)
      });
    }
    rounds.push({
      name: toText(r.name),
      question: toText(r.question),
      answers: answers
    });
  }

  return {
    title: toText(raw.title),
    subtitle: toText(raw.subtitle),
    rounds: rounds
  };
}

function toText(value) {
  return (value === undefined || value === null) ? "" : String(value);
}

// Returns a whole number, or "" if the value isn't one.
function toPoints(value) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }
  var n = Number(value);
  return (isFinite(n) && Math.floor(n) === n) ? n : "";
}

// Returns a list of problems that stop the quiz from being played.
// Each problem is { round, answer, field, message }; round and answer are
// indexes (or null when the problem isn't about a specific one).
function validateQuiz(quiz) {
  var problems = [];

  if (quiz.rounds.length === 0) {
    problems.push({ round: null, answer: null, field: "rounds", message: "The quiz needs at least one round." });
  }

  quiz.rounds.forEach(function(round, r) {
    var label = "Round " + (r + 1);
    if (round.question.trim() === "") {
      problems.push({ round: r, answer: null, field: "question", message: label + " needs a question." });
    }
    if (round.answers.length === 0) {
      problems.push({ round: r, answer: null, field: "answers", message: label + " needs at least one answer." });
    }
    round.answers.forEach(function(answer, a) {
      if (answer.answer.trim() === "") {
        problems.push({ round: r, answer: a, field: "answer", message: label + ", answer " + (a + 1) + " is empty." });
      }
      if (answer.points === "" || answer.points < 0) {
        problems.push({ round: r, answer: a, field: "points", message: label + ", answer " + (a + 1) + " needs points (a whole number, 0 or more)." });
      }
    });
  });

  return problems;
}

function storageAvailable() {
  try {
    var testKey = QUIZ_STORAGE_KEY + ".test";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

function loadSavedQuiz() {
  try {
    var saved = window.localStorage.getItem(QUIZ_STORAGE_KEY);
    return saved ? normaliseQuiz(JSON.parse(saved)) : null;
  } catch (e) {
    return null;
  }
}

function hasSavedQuiz() {
  return loadSavedQuiz() !== null;
}

// The quiz the game should use: saved edits if there are any, otherwise data.js.
function getQuiz() {
  if (!cachedQuiz) {
    cachedQuiz = loadSavedQuiz() || getDefaultQuiz();
  }
  return cachedQuiz;
}

function saveQuiz(quiz) {
  try {
    window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quiz));
    cachedQuiz = null;
    return true;
  } catch (e) {
    return false;
  }
}

function clearSavedQuiz() {
  try {
    window.localStorage.removeItem(QUIZ_STORAGE_KEY);
  } catch (e) {
    // Nothing saved, or storage is blocked: either way data.js is used.
  }
  cachedQuiz = null;
}

// Builds the text of a data.js file for the quiz, in the same format as the
// original, so it can replace assets/js/data.js as the built-in quiz.
function quizToDataJs(quiz) {
  var questions = quiz.rounds.map(function(round) {
    return { question: round.question, answers: round.answers };
  });
  var names = quiz.rounds.map(function(round) {
    return round.name;
  });
  var titles = { title: quiz.title, subtitle: quiz.subtitle };

  return "const questiondata = " + JSON.stringify(questions, null, 2) + "\n\n" +
    "const roundNames = " + JSON.stringify(names) + "\n\n" +
    "const quizTitle = " + JSON.stringify(titles) + "\n";
}
