//Globale variable. Her kan vi lave den konfiguration vi har brug for hurtigt at kunne ændre
window.onload = () => {

var clientWidth = document.getElementById('canvasHolder').clientWidth;
var clientHeigt = document.getElementById('canvasHolder').clientHeight;

let gameWidth = clientWidth-30;
const gameHeight = clientHeigt-10;
console.log(gameHeight);


const KEY_P1_UP = 'w';
const KEY_P1_DOWN = 's';
const KEY_P2_UP = 'ArrowUp';
const KEY_P2_DOWN = 'ArrowDown';

var P1SPEED = 5.5;
var P2SPEED = P1SPEED;
var AISPEED = P1SPEED + 0.5;
var BALLSPEED = 7;

let P1SCORE = 0;
let P2SCORE = 0;

let AI = true;

let keyboard = {};
window.addEventListener("keydown", function (event)
{
    keyboard[event.key] = true;
});
window.addEventListener("keyup", function (event)
{
    delete keyboard[event.key];
});

//Vi har brug for et sted vi kan tegne vores grafik - det hedder et "canvas"  i JavaScript. Her lavet vi et og sætter dets højde og bredde til vores globale variable.
var canvas = document.createElement('canvas');
canvas.width = gameWidth;
canvas.height = gameHeight;
//canvas.style.display = 'inline';
var context = canvas.getContext('2d');

console.log(gameHeight);
const animationFrame = window.requestAnimationFrame;

//Step-funktionen bliver kaldt hver "animation frame" (cirka 60 gange i sekundet), og sørger for at alt andet kører.
const step = () =>
{
    update();
    render();
    animationFrame(step);	//Hver gang vores animation frame er færdig, så beder vi den om at køre igen.
};

const createCanvas = enableAi =>
{
    AI = enableAi;
    document.getElementById("canvasHolder").appendChild(canvas);
    animationFrame(step); //Bed animation frame om at kalde vores "step"-funktionen.
}

const singleplayer = () => createCanvas(true);
const multiplayer = () => createCanvas(false);
const reset = () => location.reload();


class Ball
{
    constructor()
    {
        
        this.width = 20;
        this.height = 20;
        this.x = gameWidth / 2 - this.width / 2;
        this.y = gameHeight / 2 - this.width / 2;
        this.xspeed = BALLSPEED;
        this.yspeed = BALLSPEED;

    }
    render()
    {
        context.fillStyle = '#e5e5e5';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    update()
    {
        
        if (objectIntersects(this, player2))
        {
            this.xspeed = -this.xspeed;

        }
        if (objectIntersects(this, player1))
        {
            this.xspeed = -this.xspeed;

        }
        if (this.y > gameHeight)
        {
            this.yspeed = -this.yspeed;
        }
        if (this.y < 0)
        {
            this.yspeed = -this.yspeed;
        }


        this.x += this.xspeed;
        this.y += this.yspeed;

        if (this.x > gameWidth)
        {
            P1SCORE++;
            this.x = gameWidth / 2 - this.width / 2;
            this.y = gameHeight / 2 - this.width / 2;
            this.xspeed = -this.xspeed;
            document.getElementById("pointP1").innerHTML = P1SCORE;
        }
        if (this.x < 0)
        {
            P2SCORE++;
            this.x = gameWidth / 2 - this.width / 2;
            this.y = gameHeight / 2 - this.width / 2;
            this.xspeed = -this.xspeed;
            document.getElementById("pointP2").innerHTML = P2SCORE;
        }
    }
}

//Update-funktionen samler vi al vores logik, der har at gøre med at opdatere spillet. Det handler om at lytte på keyboardet, opdatere positioner, osv.
function update()
{
    // Player 1
    if (keyboard[KEY_P1_DOWN])
    {
        player1.move(P1SPEED);
    }
    else if (keyboard[KEY_P1_UP])
    {
        player1.move(-P1SPEED);
    }
    // Checks for ai, if no check for player 2 input.
    if (!AI)
    {
        if (keyboard[KEY_P2_DOWN])
        {
            player2.move(P2SPEED);
        }
        else if (keyboard[KEY_P2_UP])
        {
            player2.move(-P2SPEED);
        }

    }
    else
    {
        if (ball.y < player2.y)
        {
            player2.move(-AISPEED);
        }
        else if (ball.y > player2.y)
        {
            player2.move(AISPEED);
        }
    }
    //Updates the balls position attributes
    ball.update();
}

//Render-funktionen sørger for at gentegne 60 gange i sekundet, så vores canvas ser "flydende" ud.
const render = () =>
{
    context.fillStyle = "#d60c2e";			//Her vælge vi en baggrundsfarve
    context.fillRect(0, 0, gameWidth, gameHeight);	//"fillRect" fylder en rektangel ud med den farve der ligger i "fillStyle", i det koordinatsæt vi giver den. Vi beder her om at fylde hele vores canvas ud.
    player1.render();
    player2.render();
    ball.render();
    
}


class Player
{
    constructor(x)
    {
        this.x = x;
        this.height = 100;
        this.y = gameHeight / 2 - this.height / 2;
        this.width = 20;
    }
    render()
    {
        context.fillStyle = '#ffffff';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    move(speed)
    {
        if (speed > 0 && this.y < gameHeight - this.height)
        {
            this.y += speed;
        }
        else if (speed < 0 && this.y > 0)
        {
            this.y += speed;
        }
    }
}


var player1 = new Player(10);

var player2 = new Player(gameWidth - 10 - player1.width);

var ball = new Ball();

const objectIntersects = (obj1, obj2) => intersects(obj1.x, obj1.x + obj1.width, obj1.y, obj1.y + obj1.height, obj2.x, obj2.x + obj2.width, obj2.y, obj2.y + obj2.height);
const intersects = (ax1, ax2, ay1, ay2, bx1, bx2, by1, by2) => ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;


/*
let triggers = document.querySelectorAll('button');
let highlight = document.createElement('span');
highlight.classList.add('highlight');
document.getElementsByTagName('BODY')[0].appendChild(highlight);

function highlightLink()
{
    let linkCoords = this.getBoundingClientRect();
    console.log(linkCoords)
    let coords = {
        width: linkCoords.width,
        height: linkCoords.height,
        top: linkCoords.top + window.scrollY,
        left: linkCoords.left + window.scrollX,
    };
    highlight.style.width = `${coords.width}px`;
    highlight.style.height = `${coords.height}px`;
    highlight.style.transform = `translate(${coords.left}px, ${coords.top}px)`;
}

triggers.forEach(a => a.addEventListener('mouseenter', highlightLink));

*/


//Event listener's

document.getElementById('singleplayer').addEventListener('click', () => {
    singleplayer();
    
},{once : true});
document.getElementById('multiplayer').addEventListener('click', () => {
    multiplayer();
},{once : true});
document.getElementById('reset').addEventListener('click', () =>{
    reset();
});
}