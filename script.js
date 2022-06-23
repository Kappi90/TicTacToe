const cellElements = document.querySelectorAll('[data-cell]') //Select all the cell
const board = document.getElementById('board') //Select the board
const X_CLASS = 'x'; //Name of the class X
const CIRCLE_CLASS = 'circle'; //Name of the class O
let circleTurn;

/* ********** Win variables ********** */
const WINNING_COMBINATION = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const restartButton = document.getElementById('restartButton')

/* ********** Variables for the counter ********** */
let counterDrawElem = document.querySelector('.counter-draw');
let counterXElem = document.querySelector('.counter-X');
let counterOElem = document.querySelector('.counter-O');

let count = 0;
let countX = 0;
let countO = 0;

/* ********** Update the score ********** */
updateDisplay();

function updateDisplay(){
    counterDrawElem.innerHTML = count;
    counterXElem.innerHTML = countX;
    counterOElem.innerHTML = countO;
};

/* ********** Restart game button ********** */
restartButton.addEventListener('click', startGame);

/* ********** Start game function ********** */
function startGame(){
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, {once:true}) //fire this event only once
    })
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}

/* ********** Action when we click on the cell ********** */
function handleClick(e){
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS; //If is circle turn then circle_class otherwise X_CLASS
    //Place Mark
    placeMark(cell, currentClass);
    //Check for Win
    if(checkWin(currentClass)){
        endGame(false);
    } 
    //Check for Draw
    else if (isDraw()){
        endGame(true)
    }
    //Switch Turns
    else{
        swapTurns();
        setBoardHoverClass();
    } 
}

/* ********** Check if you win ********** */ 
function checkWin(currentClass){
    return WINNING_COMBINATION.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass); //If the current class is in all of three those elements, inside the combination, we have a win
        })
    })
}

/* ********** Check if is draw ********** */ 
function isDraw(){
    return [...cellElements].every(cell => { //Array destruction to call the every method
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

/* ********** End game ********** */ 
function endGame(draw){
    if(draw){
        winningMessageTextElement.innerText = 'Draw!'
        count++;
        updateDisplay();
    }else{
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!` //If is O turn print O WINS otherwise print X WINS
        if(circleTurn = !circleTurn){
            countX++
            updateDisplay();
        }else{
            countO++
            updateDisplay();
        }
    }
    winningMessageElement.classList.add('show');
}

/* ********** Adding the mark ********** */ 
function placeMark(cell, currentClass){
    cell.classList.add(currentClass);
}

/* ********** Change the turn ********** */
function swapTurns(){
    circleTurn = !circleTurn;
}

/* ********** Set the hover class ********** */
function setBoardHoverClass(){
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)
    if(circleTurn){
        board.classList.add(CIRCLE_CLASS)
    }else{
        board.classList.add(X_CLASS)
    }
}

/* ********** Fireworks effect ********** */

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
function Firework(x,y,height,yVol,R,G,B){
  this.x = x;
  this.y = y;
  this.yVol = yVol;
  this.height = height;
  this.R = R;
  this.G = G;
  this.B = B;
  this.radius = 2;
  this.boom = false;
  var boomHeight = Math.floor(Math.random() * 200) + 50;
  this.draw = function(){
   
   ctx.fillStyle = "rgba(" + R + "," + G + "," + B + ")";
    ctx.strokeStyle = "rgba(" + R + "," + G + "," + B + ")";
    ctx.beginPath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.x,this.y,3,Math.PI * 2,0,false);
    ctx.fill();
  }
  this.update = function(){
    this.y -= this.yVol;
    if(this.radius < 20){
      this.radius += 0.35;
    }
    if(this.y < boomHeight){
      this.boom = true;
      
      for(var i = 0; i < 120; i++){
        particleArray.push(new Particle(
          this.x,
          this.y,
          // (Math.random() * 2) + 0.5//
          (Math.random() * 2) + 1,
          this.R,
          this.G,
          this.B,
          1,
        ))

      }
    }
    this.draw();
  }
  this.update()
}

window.addEventListener("click", (e)=>{
    var x = e.clientX;
  var y = canvas.height;
  var R = Math.floor(Math.random() * 255)
  var G = Math.floor(Math.random() * 255)
  var B = Math.floor(Math.random() * 255)
  var height = (Math.floor(Math.random() * 20)) + 10;
  fireworkArray.push(new Firework(x,y,height,5,R,G,B))
})

function Particle(x,y,radius,R,G,B,A){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.R = R;
  this.G = G;
  this.B = B;
  this.A = A;
  this.timer = 0;
  this.fade = false;
 
  // Change random spread
  this.xVol = (Math.random() * 10) - 4
  this.yVol = (Math.random() * 10) - 4
  
  
  console.log(this.xVol,this.yVol)
  this.draw = function(){
    ctx.fillStyle = "rgba(" + R + "," + G + "," + B + "," + this.A + ")";
    ctx.save();
    ctx.beginPath(); 
    ctx.globalCompositeOperation = "screen"
    ctx.arc(this.x,this.y,this.radius,Math.PI * 2,0,false);
    ctx.fill();
   
    ctx.restore();
  }
  this.update = function(){
    this.x += this.xVol;
    this.y += this.yVol;
    
    // Comment out to stop gravity. 
    if(this.timer < 200){
        this.yVol += 0.12;
    }
    this.A -= 0.02;
    if(this.A < 0){
      this.fade = true;
    }
    this.draw();
  }
  this.update();
}

var fireworkArray = [];
var particleArray = [];
for(var i = 0; i < 6; i++){
  var x = Math.random() * canvas.width;
  var y = canvas.height;
  var R = Math.floor(Math.random() * 255)
  var G = Math.floor(Math.random() * 255)
  var B = Math.floor(Math.random() * 255)
  var height = (Math.floor(Math.random() * 20)) + 10;
  fireworkArray.push(new Firework(x,y,height,5,R,G,B))
}


function animate(){
  requestAnimationFrame(animate);
 // ctx.clearRect(0,0,canvas.width,canvas.height)
  ctx.fillStyle = "rgba(0,0,0,0.1)"
  ctx.fillRect(0,0,canvas.width,canvas.height);
  for(var i = 0; i < fireworkArray.length; i++){
    fireworkArray[i].update();
  }
  for(var j = 0; j < particleArray.length; j++){
    particleArray[j].update();
  }
  if(fireworkArray.length < 4){
      var x = Math.random() * canvas.width;
      var y = canvas.height;
      var height = Math.floor(Math.random() * 20);
      var yVol = 5;
      var R = Math.floor(Math.random() * 255);
      var G = Math.floor(Math.random() * 255);          
      var B = Math.floor(Math.random() * 255);
      fireworkArray.push(new Firework(x,y,height,yVol,R,G,B));
  }
 
  
  fireworkArray = fireworkArray.filter(obj => !obj.boom);
  particleArray = particleArray.filter(obj => !obj.fade);
}
animate();

window.addEventListener("resize", (e) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})