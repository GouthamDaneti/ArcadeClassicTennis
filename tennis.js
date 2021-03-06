var canvas;
var canvasContext;

var ballX;
var ballY;

var ballSpeedX = 10;
var ballSpeedY = 6;

var paddleOneY = 250;
var paddleTwoY = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

var playerOneScore = playerTwoScore = 0;
const WIN_SCORE = 5;
var showWinScore = false;
const COMPUTER_MOVEMENT = 6;


function calCulateMousePos(evt)
{
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
      x: mouseX,
      y: mouseY
    }
}

function handleMouseClick(evt)
{
    if (showWinScore)
    {
        playerOneScore = playerTwoScore = 0;
        showWinScore = false;
    }
}

window.onload = function()
{
    canvas = document.getElementById('canvas_id');
    canvasContext = canvas.getContext('2d');
    var framesPerSeconds = 30;
    ballReset();
    setInterval(function() {
      draw();
      move();
    }, 1000/framesPerSeconds);
    canvas.addEventListener('mousemove',
            function(evt) {
                  var mousePos = calCulateMousePos(evt);
                  paddleOneY = mousePos.y - (PADDLE_HEIGHT/2);
            });

    canvas.addEventListener('mousedown', handleMouseClick);
}

function computerMovement()
{
    var paddleTwoCenter = paddleTwoY + (PADDLE_HEIGHT/2);
    if (paddleTwoCenter < ballY - 35)
    {
        paddleTwoY += COMPUTER_MOVEMENT;
    }
    else if (paddleTwoCenter > ballY + 35)
    {
        paddleTwoY -= COMPUTER_MOVEMENT;
    }
}

function move()
{
    if (showWinScore)
    {
        return;
    }
    computerMovement();
    if (ballX < 0)
    {
        if (ballY > paddleOneY && ballY < paddleOneY + PADDLE_HEIGHT)
        {
            ballSpeedX = - ballSpeedX;

            var deltaY = ballY - (paddleOneY + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        }
        else
        {
            playerTwoScore++;
            ballReset();
        }
    }
    if (ballX > canvas.width)
    {
      if (ballY > paddleTwoY && ballY < paddleTwoY + PADDLE_HEIGHT)
      {
          ballSpeedX = - ballSpeedX;

          var deltaY = ballY - (paddleTwoY + PADDLE_HEIGHT/2);
          ballSpeedY = deltaY * 0.35;
      }
      else
      {
          playerOneScore++;
          ballReset();
      }
    }
    if ( ballY < 0)
    {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height)
    {
        ballSpeedY = -ballSpeedY;
    }
    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;
    //ballSpeedX = ballSpeedX + 1;
}

function drawNet()
{
    for (var i=0; i<canvas.height; i+=20)
    {
        colorRect(canvas.width/2 - 1, i, 2, 10, 'white');
    }
}

function draw()
{
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if (showWinScore)
    {
        canvasContext.fillStyle = 'white';
        if (playerTwoScore >= WIN_SCORE)
        {
            canvasContext.fillText("Right Player Won!", canvas.width - 450, 100);
        }
        else if (playerOneScore >= WIN_SCORE)
        {
            canvasContext.fillText("Left Player Won!", canvas.width - 450, 100);
        }
        canvasContext.fillText("Click to continue", canvas.width - 450, canvas.height - 100);
        return;
    }
    drawNet();
    colorRect(0, paddleOneY, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    colorRect(canvas.width - PADDLE_THICKNESS, paddleTwoY, PADDLE_THICKNESS,  PADDLE_HEIGHT, 'white');
    colorCirc(ballX, ballY, 10);

    canvasContext.fillText(playerOneScore, 100, 100);
    canvasContext.fillText(playerTwoScore, canvas.width - 110, 100);
}

function ballReset()
{
    if (playerTwoScore >= WIN_SCORE || playerOneScore >= WIN_SCORE)
    {
        showWinScore = true;
    }

    ballSpeedX = - ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function colorCirc(x, y, radius, color)
{
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}
function colorRect(x, y, width, height, color)
{
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}
