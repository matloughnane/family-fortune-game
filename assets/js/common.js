// console.log("common");

function generateQuiz(id) {
  var round = getQuiz().rounds[parseInt(id) - 1];
  if (!round) {
    // The round doesn't exist (e.g. rounds were deleted in settings)
    window.location.href = "index.html";
    return;
  }
  renderQuiz(id, round.question, round.answers);
}

function renderQuiz(id, question, answers) {

  if (parseInt(id) < getQuiz().rounds.length) {
    $("#next").attr("href", "interstitial.html?id=" + (parseInt(id) + 1));
  } else {
    // Last round: there is no next round, so hide the next button
    $("#next").hide();
  }

  $('#question').text(question);

  html = ""
  for (var i = 0; i < answers.length; i++) {
    // answers[i]
    html += '<div id="' + i + '" class="answer-container"><div class="row">';
    html += '<div class="col-lg-1 text-center position">' + (i + 1) + '</div>';
    html += '<div class="col-lg-10"><div id="answer' + i + '" class="answer-text"></div></div>'
    html += '<div class="col-lg-1 text-center" id="answer-points' + i + '"></div></div></div>';
  }
  $("#answers").html(html);
  // $('.answer-container').
  addAnswerListeners(parseInt(id) - 1);
  addKeyDownListeners();
}

function addAnswerListeners(quizID) {
  $('.answer-container').on('click', function() {
    //do something
    // console.log(this.id);
    CorrectAnswer(quizID, this.id);
  });
}

function CorrectAnswer(quizID, answerID) {
  var answer = getQuiz().rounds[quizID].answers[answerID];
  if (!answer) {
    // No answer for this number key on this round
    return;
  }
  $('#answer' + answerID).text(answer.answer);
  $('#answer-points' + answerID).addClass("points");
  $('#answer-points' + answerID).text(answer.points);
  playCorrect();
}

function wrongAnswer() {
  var html = '<div class="wrong-sign"><i class="wrong-sign fas fa-times-circle"></i></div>';
  $('#wrong-col').append(html);
  playWrong();
}

function resetWrong() {
  $('#wrong-col').empty();
}

// SOUNDS
function playWrong() {
  var audio = document.getElementById("wrong");
  audio.play();
}

function playCorrect() {
  var audio = document.getElementById("correct");
  audio.play();
}

$("#previous").click(function() {
  goBack();
})

function goBack() {
  window.history.back();
}


function getRoundSubtitle(id) {
  var round = getQuiz().rounds[parseInt(id) - 1];
  return round ? round.name : "";
  //
  // switch (parseInt(id)) {
  //   case 1:
  //     return "Numero Uno";
  //     break
  //   case 2:
  //     return "Double Trouble";
  //     break;
  //   case 3:
  //     return "Triple Points";
  //     break;
  //   case 4:
  //     return "The 4th Round"
  //     break;
  //   case 5:
  //     return "The Final Round"
  //     break;
  //   case 6:
  //     return "Quickfire";
  //     break;
  //   default:
  //     return "";
  //     break;
  // }
}

function addKeyDownListeners() {
  document.addEventListener('keydown', function(event) {

    // const urlParams = new URLSearchParams(window.location.search);
    // const nextID = urlParams.get('id');
    // const quizID = parseInt(nextID)-1;
    quizID = $('#hiddenquizID').val() - 1;

    if (event.key == 1) {
      // alert(quizID+' 1');
      CorrectAnswer(quizID, 0);
    } else if (event.key == 2) {
      // alert('2');
      CorrectAnswer(quizID, 1);
    } else if (event.key == 3) {
      // alert('2');
      CorrectAnswer(quizID, 2);
    } else if (event.key == 4) {
      // alert('2');
      CorrectAnswer(quizID, 3);
    } else if (event.key == 5) {
      // alert('2');
      CorrectAnswer(quizID, 4);
    } else if (event.key == 6) {
      // alert('2');
      CorrectAnswer(quizID, 5);
    } else if (event.key == 7) {
      // alert('2');
      CorrectAnswer(quizID, 6);
    } else if (event.key == 8) {
      // alert('2');
      CorrectAnswer(quizID, 7);
    } else if (event.key == 9) {
      // alert('2');
      CorrectAnswer(quizID, 8);
    } else if (event.key == "x" || event.key == "X") {
      // alert('2');
      // CorrectAnswer(quizID, 8);
      wrongAnswer();
    }

  });
}




//
