// Settings page: edit the quiz and save it to this browser (see store.js).

var quiz = cloneQuiz(getQuiz());
var dirty = false;
var showProblems = false; // only highlight problems after a save attempt
var canSave = storageAvailable();

function cloneQuiz(q) {
  return JSON.parse(JSON.stringify(q));
}

// RENDERING

function render() {
  $('#quiz-title').val(quiz.title);
  $('#quiz-subtitle').val(quiz.subtitle);

  var $rounds = $('#rounds').empty();
  quiz.rounds.forEach(function(round, r) {
    $rounds.append(renderRound(round, r));
  });

  updateStatus();
  if (showProblems) {
    highlightProblems();
  }
}

function renderRound(round, r) {
  var $card = $('<section class="card round">').attr('data-round', r);

  var $header = $('<div class="round-header">');
  $header.append($('<h2>').text('Round ' + (r + 1)));
  var $actions = $('<div class="round-actions">');
  $actions.append(iconButton('move-up', '\u2191', 'Move round up').prop('disabled', r === 0));
  $actions.append(iconButton('move-down', '\u2193', 'Move round down').prop('disabled', r === quiz.rounds.length - 1));
  $actions.append($('<button type="button" class="s-btn s-btn-small delete-round">Delete round</button>')
    .prop('disabled', quiz.rounds.length === 1));
  $header.append($actions);
  $card.append($header);

  $card.append(textField('Round name (shown before the question, optional)', 'round-name', round.name));
  $card.append(textField('Question', 'round-question', round.question));

  var $answers = $('<div class="answers">');
  $answers.append(
    '<div class="answer-row answer-head"><span></span><span>Answer</span><span>Points</span><span></span></div>'
  );
  round.answers.forEach(function(answer, a) {
    var $row = $('<div class="answer-row">').attr('data-answer', a);
    $row.append($('<span class="answer-number">').text(a + 1));
    $row.append($('<input type="text" class="answer-text" autocomplete="off">')
      .attr('aria-label', 'Round ' + (r + 1) + ' answer ' + (a + 1))
      .val(answer.answer));
    $row.append($('<input type="number" class="answer-points" min="0" step="1" inputmode="numeric">')
      .attr('aria-label', 'Round ' + (r + 1) + ' answer ' + (a + 1) + ' points')
      .val(answer.points));
    $row.append(iconButton('remove-answer', '\u00d7', 'Remove answer'));
    $answers.append($row);
  });
  $card.append($answers);

  var $buttons = $('<div class="button-row">');
  var full = round.answers.length >= MAX_ANSWERS;
  $buttons.append(
    $('<button type="button" class="s-btn add-answer"><i class="fas fa-plus"></i> Add answer</button>').prop('disabled', full)
  );
  $buttons.append(
    $('<button type="button" class="s-btn sort-answers"><i class="fas fa-sort-amount-down"></i> Sort by points</button>')
      .prop('disabled', round.answers.length < 2)
  );
  if (full) {
    $buttons.append($('<span class="help">').text('A round can have up to ' + MAX_ANSWERS + ' answers.'));
  }
  $card.append($buttons);

  return $card;
}

// Uses a text character rather than a Font Awesome icon so the button still
// shows when the icons can't load (e.g. playing offline).
function iconButton(className, symbol, label) {
  return $('<button type="button" class="icon-btn">')
    .addClass(className)
    .attr({ title: label, 'aria-label': label })
    .text(symbol);
}

function textField(label, className, value) {
  return $('<label class="field">')
    .append($('<span>').text(label))
    .append($('<input type="text" autocomplete="off">').addClass(className).val(value));
}

function updateStatus() {
  $('#source-status').text(hasSavedQuiz() ?
    'The game is using your saved quiz.' :
    'The game is using the built-in quiz from data.js.');
  $('#dirty-status').prop('hidden', !dirty);
  $('#save').prop('disabled', !canSave);
}

function showMessage(text, type) {
  $('#message')
    .removeClass('notice-success notice-error')
    .addClass(type === 'error' ? 'notice-error' : 'notice-success')
    .empty()
    .append(text)
    .prop('hidden', false);
}

function hideMessage() {
  $('#message').prop('hidden', true);
}

// Marks invalid inputs and returns the list of problems.
function highlightProblems() {
  var problems = validateQuiz(quiz);
  $('.invalid').removeClass('invalid');
  problems.forEach(function(p) {
    var $round = $('.round[data-round="' + p.round + '"]');
    if (p.field === 'question') {
      $round.find('.round-question').addClass('invalid');
    } else if (p.field === 'answers') {
      $round.find('.answers').addClass('invalid');
    } else if (p.field === 'answer') {
      $round.find('[data-answer="' + p.answer + '"] .answer-text').addClass('invalid');
    } else if (p.field === 'points') {
      $round.find('[data-answer="' + p.answer + '"] .answer-points').addClass('invalid');
    }
  });
  return problems;
}

function problemList(problems) {
  var $list = $('<ul>');
  problems.forEach(function(p) {
    $list.append($('<li>').text(p.message));
  });
  return $list;
}

// Checks the quiz, and if there are problems highlights them and explains
// what stopped the action. Returns true when the quiz is valid.
function checkQuiz(action) {
  var problems = highlightProblems();
  if (problems.length === 0) {
    return true;
  }
  showProblems = true;
  showMessage($('<div>')
    .append($('<p>').text('Please fix these before you ' + action + ':'))
    .append(problemList(problems)), 'error');
  var $first = $('.invalid').first();
  if ($first.length) {
    $first[0].scrollIntoView({ block: 'center' });
    if ($first.is('input')) {
      $first.focus();
    }
  }
  return false;
}

// Called after any change to the quiz in the editor.
function changed(rerender) {
  dirty = true;
  if (rerender) {
    render();
  } else {
    updateStatus();
    if (showProblems) {
      highlightProblems();
    }
  }
}

function roundIndex(el) {
  return parseInt($(el).closest('.round').attr('data-round'));
}

function answerIndex(el) {
  return parseInt($(el).closest('.answer-row').attr('data-answer'));
}

function download(filename, text, type) {
  var blob = new Blob([text], { type: type });
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(function() {
    URL.revokeObjectURL(url);
  }, 1000);
}

// EVENTS

$('#quiz-title').on('input', function() {
  quiz.title = this.value;
  changed(false);
});

$('#quiz-subtitle').on('input', function() {
  quiz.subtitle = this.value;
  changed(false);
});

$('#rounds')
  .on('input', '.round-name', function() {
    quiz.rounds[roundIndex(this)].name = this.value;
    changed(false);
  })
  .on('input', '.round-question', function() {
    quiz.rounds[roundIndex(this)].question = this.value;
    changed(false);
  })
  .on('input', '.answer-text', function() {
    quiz.rounds[roundIndex(this)].answers[answerIndex(this)].answer = this.value;
    changed(false);
  })
  .on('input', '.answer-points', function() {
    quiz.rounds[roundIndex(this)].answers[answerIndex(this)].points = toPoints(this.value);
    changed(false);
  })
  .on('click', '.move-up, .move-down', function() {
    var r = roundIndex(this);
    var to = $(this).hasClass('move-up') ? r - 1 : r + 1;
    var moved = quiz.rounds.splice(r, 1)[0];
    quiz.rounds.splice(to, 0, moved);
    changed(true);
    $('.round[data-round="' + to + '"]')[0].scrollIntoView({ block: 'nearest' });
  })
  .on('click', '.delete-round', function() {
    var r = roundIndex(this);
    var round = quiz.rounds[r];
    var label = round.question.trim() ? '"' + round.question.trim() + '"' : 'this round';
    if (confirm('Delete Round ' + (r + 1) + ' (' + label + ')?')) {
      quiz.rounds.splice(r, 1);
      changed(true);
    }
  })
  .on('click', '.remove-answer', function() {
    quiz.rounds[roundIndex(this)].answers.splice(answerIndex(this), 1);
    changed(true);
  })
  .on('click', '.add-answer', function() {
    var r = roundIndex(this);
    var answers = quiz.rounds[r].answers;
    if (answers.length >= MAX_ANSWERS) {
      return;
    }
    answers.push({ answer: '', points: '' });
    changed(true);
    $('.round[data-round="' + r + '"] .answer-text').last().focus();
  })
  .on('click', '.sort-answers', function() {
    quiz.rounds[roundIndex(this)].answers.sort(function(a, b) {
      return (b.points === '' ? -1 : b.points) - (a.points === '' ? -1 : a.points);
    });
    changed(true);
  });

$('#add-round').on('click', function() {
  quiz.rounds.push({ name: '', question: '', answers: [{ answer: '', points: '' }] });
  changed(true);
  var $round = $('.round').last();
  $round[0].scrollIntoView({ block: 'start' });
  $round.find('.round-question').focus();
});

$('#save').on('click', function() {
  if (!checkQuiz('save')) {
    return;
  }
  if (saveQuiz(quiz)) {
    dirty = false;
    showProblems = false;
    showMessage('Saved. The game will now use this quiz.', 'success');
  } else {
    showMessage('Sorry, the quiz could not be saved in this browser. Use Export or Download as data.js to keep it.', 'error');
  }
  updateStatus();
});

$('#reset').on('click', function() {
  if (!confirm('Delete your saved edits and go back to the built-in quiz from data.js? This can\'t be undone.')) {
    return;
  }
  clearSavedQuiz();
  quiz = cloneQuiz(getDefaultQuiz());
  dirty = false;
  showProblems = false;
  render();
  showMessage('Back to the built-in quiz from data.js.', 'success');
});

$('#export').on('click', function() {
  var data = {
    format: 'family-fortunes-quiz',
    version: 1,
    title: quiz.title,
    subtitle: quiz.subtitle,
    rounds: quiz.rounds
  };
  download('family-fortunes-quiz.json', JSON.stringify(data, null, 2), 'application/json');
});

$('#import').on('click', function() {
  $('#import-file').val('').trigger('click');
});

$('#import-file').on('change', function() {
  var file = this.files && this.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function() {
    var imported = null;
    try {
      imported = normaliseQuiz(JSON.parse(reader.result));
    } catch (e) {
      imported = null;
    }
    if (!imported || imported.rounds.length === 0) {
      showMessage('That file doesn\'t look like an exported quiz, so nothing was changed.', 'error');
      return;
    }
    if (!confirm('Replace the quiz in the editor with "' + (imported.title || file.name) + '" (' +
        imported.rounds.length + ' rounds)?')) {
      return;
    }
    quiz = imported;
    showProblems = false;
    changed(true);
    showMessage(canSave ?
      'Imported ' + quiz.rounds.length + ' rounds. Click Save to use them in the game.' :
      'Imported ' + quiz.rounds.length + ' rounds.', 'success');
    window.scrollTo(0, 0);
  };
  reader.onerror = function() {
    showMessage('Sorry, that file could not be read.', 'error');
  };
  reader.readAsText(file);
});

$('#download-datajs').on('click', function() {
  if (!checkQuiz('download it')) {
    return;
  }
  hideMessage();
  download('data.js', quizToDataJs(quiz), 'text/javascript');
});

$(window).on('beforeunload', function(event) {
  if (dirty) {
    event.preventDefault();
    return '';
  }
});

// START

$('#storage-warning').prop('hidden', canSave);
render();
