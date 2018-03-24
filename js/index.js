const SOUND = {
  green: "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3", 
  red: "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3", 
  yellow: "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3", 
  blue: "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
}

const RESULT = {
  correct: "Win",
  inprogress: "InProgress",
  incorrect: "Lose"
}

const COLORS = {
  container_default: "#e6e6e6",
  container_selected: "#00a74a",
  dull_green: "#00a74a",
  bright_green: "green",
  dull_red: "#9f0f17",
  bright_red: "red",
  dull_yellow: "#cca707",
  bright_yellow: "yellow",
  dull_blue: "#094a8f",
  bright_blue: "blue"
}

// Are we powered on
var power = 0;

// Are we in strict mode
var strictMode = 0;

// What is the user's current score
var score = 0;

// Do we have an active game going
var activeGame = 0;
var pattern = [];
var index = 0;

// Is it user turn or computer
var userTurn = 0;

// Id of timer
var simonTimerId = "";

function setButtonBright(btn) {
  if (btn === 0) {
    // Green
    $("#green-button").css("background-color",COLORS.bright_green);
  } else if (btn === 1) {
    // Red
    $("#red-button").css("background-color",COLORS.bright_red);
  } else if (btn === 2) {
    // Yellow
    $("#yellow-button").css("background-color",COLORS.bright_yellow);
  } else {
    // Blue
    $("#blue-button").css("background-color",COLORS.bright_blue);
  }
}

function setButtonDull(btn) {
  if (btn === 0) {
    // Green
    $("#green-button").css("background-color",COLORS.dull_green);
  } else if (btn === 1) {
    // Red
    $("#red-button").css("background-color",COLORS.dull_red);
  } else if (btn === 2) {
    // Yellow
    $("#yellow-button").css("background-color",COLORS.dull_yellow);
  } else {
    // Blue
    $("#blue-button").css("background-color",COLORS.dull_blue);
  }
}

function updateScoreLabel(value) {
  $("#score").html(value);
}

function playSound(color) {
  var a;
  if (color === 0) {
    a = new Audio(SOUND.green);
  } else if (color === 1) {
    a = new Audio(SOUND.red);
  } else if (color === 2) {
    a = new Audio(SOUND.yellow);
  } else {
    a = new Audio(SOUND.blue);
  }
  a.play();
}

function checkResult(color) {
  // If our color is correct for index
  if (color === pattern[index]) {    
    // Check score
    if (index === (pattern.length - 1)) {
      // Finished this pattern successfully
      return RESULT.correct;
    } else {
      return RESULT.inprogres;
    }
  } else {
    return RESULT.incorrect;
  }
}

function getNextColor() {
  var nextColor = Math.floor(Math.random() * 4);
  pattern.push(nextColor);
}

function performSequence() {
  // Get first item
  var color = pattern[index];
  // Flash button
  playSound(color);
  setButtonBright(color);
  setTimeout(setButtonDull, 300, color);
  
  if (index === (pattern.length - 1)) {
    // Completed sequence
    userTurn = 1;
    index = 0;
  } else {
    index++;
    simonTimerId = setTimeout(performSequence, 500);
  }
}

function nextComputerTurn() {
  getNextColor();
  index = 0;
  performSequence();
}

function restartComputerTurn() {
  updateScoreLabel(score);
  index = 0;
  performSequence();
}

function endGame() {
  updateScoreLabel("--");
  userTurn = 0;
  clearTimeout(simonTimerId);
}

function playerTurn(color) {
  // Flash button
  playSound(color);
  setButtonBright(color);
  setTimeout(setButtonDull, 300, color);
  
  // Btns from 0 to 3
  var result = checkResult(color);
  
  if (result === RESULT.correct) {
    score++;
    updateScoreLabel(score);
    if (score === 6) {
      // Win response
      userTurn = 0;
      updateScoreLabel("WIN!");
      
      // End
      setTimeout(endGame, 1000);
    } else {
      userTurn = 0;
      setTimeout(nextComputerTurn, 700);
    }
  } else if (result === RESULT.incorrect) {
    // Lose response
    userTurn = 0;
    updateScoreLabel("MISS");
    if (strictMode === 0) {
      // Restart
      setTimeout(restartComputerTurn, 1000);
    } else {
      // End
      setTimeout(endGame, 1000);
    }
  } else {
    index++;
  }
}


function powerHandler(click) {
  if (power === 1) {
    $("#power-container").css("background-color","#e6e6e6");
    $("#score").css("color", "#898989");
    endGame();
    power = 0;
    $("#strict-container").css("background-color","#e6e6e6");
    strictMode = 0;
  } else {
    $("#power-container").css("background-color","#00a74a");
    $("#score").css("color", "white");
    power = 1;
  }
}

function resetStartColor() {
  $("#start-container").css("background-color","#e6e6e6");
}

function startHandler(click) {
  if (power === 0) {
    return;  
  }
  
  // Flash button
  $("#start-container").css("background-color","#00a74a");
  setTimeout(resetStartColor, 100);
  
  // Start game
  pattern = [];
  score = 0;
  userTurn = 0;
  updateScoreLabel(0);
  clearTimeout(simonTimerId);
  nextComputerTurn();
}

function strictHandler(click) {
  if (power === 0) {
    return;
  }
  if (strictMode === 1) {
    $("#strict-container").css("background-color","#e6e6e6");
    strictMode = 0;
  } else {
    $("#strict-container").css("background-color","#00a74a");
    strictMode = 1;
  }
}

function greenHandler(click) {
  if (userTurn === 0 || power === 0) return;
  
  playerTurn(0);
}

function redHandler(click) {
  if (userTurn === 0 || power === 0) return;
  
  playerTurn(1);
}

function yellowHandler(click) {
  if (userTurn === 0 || power === 0) return;

  playerTurn(2);
}

function blueHandler(click) {
  if (userTurn === 0 || power === 0) return;
  
  playerTurn(3);
}

// Detect click on controls
var controls = document.getElementById("circle-menu");

$(controls).on("click","#start-container", startHandler);

$(controls).on("click","#strict-container", strictHandler);

$(controls).on("click", "#power-container", powerHandler);

// Detect click on row1
var board = document.getElementById("board");

$(board).on("click", "#green-button", greenHandler);

$(board).on("click", "#red-button", redHandler);

// Detech click on row2
var row2 = document.getElementById("row2");

$(row2).on("click", "#yellow-button", yellowHandler);

$(row2).on("click", "#blue-button", blueHandler);