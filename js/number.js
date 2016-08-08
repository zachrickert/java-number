/* This script is a number guessing game.  The computer will pick a random number, then prompt the user to pick a number.  The computer will then tell the user if the random number is higher or lower than the number guessed. */
var hideAll = function () {
  $('.levels').hide();
  $('.guessMenu').hide();
  $('.endGame').hide();
}

var resetTextInput = function() {
  $('input').val("");
}

var hideStartFunctions = function() {
  $('.startMenu').fadeOut();
}

var revealLevels = function() {
  $('.levels').delay(400).fadeIn();
}

var revealGame = function() {
  $('.guessMenu').fadeIn();
  hideHigherLower();
  $('#lastGuess').hide();
}

var hideLevels = function() {
  $('.levels').hide();
}

var hideHigherLower = function () {
  $('#higher').hide();
  $('#lower').hide();
}

var revealEndGame = function (status) {
  $('.endGame').fadeIn();
  $('#'+status).hide();
}

var hideEndGame = function () {
  $('.endGame').fadeOut();
}

var setLevel = function (levelID) {
  currentGame.updateLevel (levelID);
  hideLevels();
  revealGame();
}

var unlockInsane = function () {
  $('#rules li:last').after('<li><strong>Insane</strong> - 12 guesses to pick a number between 1 & 5,000</li>');
  //$('#hardButton').after('<br><button class = "gameButton levels" id = "insaneButton">Insane</button>').click( function() {
  //  setLevel("insaneButton");
  $('#hardButton').after($('<br><button class = "gameButton levels" id = "insaneButton">Insane</button>').click( function() {
    setLevel("insaneButton")
  }));

  $('#insaneButton').hide();
}

var User = function() {
  var message, prevJTag, jTag;
  this.wins = 0;
  this.passedEasy = false;
  this.passedMed = false;
  this.passedHard = false;
  this.passedInsane = false;
  this.gotFirstWin = false;
  this.gotAllLevels = false;
  this.gotFirstGuess = false;
  this.gotLastGuess = false;
  this.gotInsane = false;

  this.updateName = function(name) {
    this.name = name;
    $('.yourName').text(this.name);
  };

  this.checkAchievements = function () {
    if(!this.gotFirstWin) {
      $('#firstWinAch').fadeTo("slow",1.0);
      this.gotFirstWin = true;
    }
    if(!this.gotFirstGuess && currentGame.firstGuess) {
      $('#firstGuessAch').fadeTo("slow",1.0);
      this.gotFirstGuess = true;
    }
    if(!this.gotLastGuess && currentGame.lastGuess) {
      $('#lastGuessAch').fadeTo("slow",1.0);
      this.gotLastGuess = true;
    }
    if(!this.gotAllLevels && this.passedHard && this.passedMed && this.passedEasy) {
      $('#allLevelsAch').fadeTo("slow",1.0);
      this.gotAllLevels = true;
    }
    if(this.wins%5 == 0)
      if(this.wins == 5) {
        $('#Row5Ach').fadeTo("slow",1.0);
      } else {
        message = "<div class = 'secretAch' id = 'Row" + this.wins + "Ach'>" + this.wins + " in a row</div>";
        prevJTag = '#Row' + String(this.wins - 5) + 'Ach';
        jTag = '#Row' + String(this.wins) + 'Ach';

        $(prevJTag).after(message);
        $(jTag).fadeTo("slow",1.0);
      }
    if(!this.gotInsane && this.passedInsane) {
      message = "<div class = 'secretAch' id = 'insaneAch'>Beat The Insane Level</div>";
      prevJTag = '#allLevelsAch';
      jTag = '#insaneAch';

      $(prevJTag).after(message);
      $(jTag).fadeTo("slow",1.0);
      this.gotInsane = true;
    }
  };
}

var Game = function(level) {
  this.firstGuess = true;
  this.lastGuess = false;

  this.updateLevel = function(level) {
    this.level = level.substr(0,level.length - 6);  //Formatting the leverls so they do not say button on the end.
    switch(this.level){
      case "easy":
        this.numbOfGuesses = 5;
        this.topRange = 10;
        break;
      case "medium":
        this.numbOfGuesses = 8;
        this.topRange = 100;
        break;
      case "hard":
        this.numbOfGuesses = 10;
        this.topRange = 1000;
        break;
      case "insane":
        this.numbOfGuesses = 12;
        this.topRange = 5000;
        break;
      default:
        this.numbOfGuesses = 1;
        this.topRange = 1;
        console.log("Error Reading Level")
    }

    this.answer = Math.ceil(Math.random()*this.topRange);     //Picks a random number
    console.log(this.answer);
    this.firstGuess = true;
    $('#topRange').text(this.topRange);
    $('#numbOfGuesses').text(this.numbOfGuesses);
  };

  this.checkAnswer = function (guess) {
    hideHigherLower();
    if (this.answer == guess) {
      this.winGame();
    } else {
      this.firstGuess = false;
      this.decreaseGuesses();
      if (this.numbOfGuesses == 1) {
        $('#totalGuesses').hide();
        $('#lastGuess').show();
        this.lastGuess = true;
      } else if (this.numbOfGuesses == 0) {
        this.loseGame();
      }
      if (guess > this.answer) {
        $('#lower').fadeIn();
      } else {
        $('#higher').fadeIn();
      }
    }
  };

  this.decreaseGuesses = function () {
    this.numbOfGuesses --;
    $('#numbOfGuesses').text(this.numbOfGuesses);
  };

  this.winGame = function () {
    user.wins++;
    $('.guessMenu').hide();
    $('#correctAnswer').text(this.answer);
    revealEndGame("wrong");
    switch (this.level) {
      case "easy":
        user.passedEasy = true;
        break;
      case "medium":
        user.passedMed = true;
        break;
      case "hard":
        if (!user.passedHard) {
          user.passedHard = true;
          unlockInsane();
        }
        break;
      case "insane":
        user.passedInsane = true;
        break;
    }
    user.checkAchievements();
  };

  this.loseGame = function () {
    user.wins = 0;
    $('#correctAnswer').text(this.answer);
    $('#totalGuesses').show();
    $('#lastGuess').hide();
    $('.guessMenu').fadeOut();
    revealEndGame("correct");
  };
}

var user = new User();
var currentGame = new Game();

$(function() {
  hideAll();
  resetTextInput();
});

$('#startButton').on('click', function() {
  var checkName = function (name) {
    if (name == "") {
      $('#startButton').text("Cmon', Enter your name");
    }
    else {
      user.updateName(name);
      hideStartFunctions();
      revealLevels();
    }
  }

  var $name = $('#userName:text').val();
  checkName($name);
});

$('button.levels').on('click', function() {
  setLevel (this.id);
})

/*$('#insaneButton').on('click', function () {
  console.log("*");
})*/

$('#guessButton').on('click', function () {
  var $guessed = $('#userGuess:text').val();
  currentGame.checkAnswer($guessed);
})

$('#resetButton').on('click', function() {
  hideEndGame();
  hideHigherLower();
  $('#userGuess:text').val("");
  revealLevels();
})

