
//board
let tile=32;
let rows=16;
let cols=16;

let board;
let boardWidth=tile*rows;
let boardHeight=tile*cols;
//ship
let shipWidth=tile*2;
let shipHeight=tile;
let shipX=tile*cols/2-tile;//initial position of ship on x-axis here we draw ship from 7th row
let shipY=tile*rows-tile*2; // initial position of ship on x-axis here we draw ship upto 2 columns

let ship={
    x:shipX,
    y:shipY,
    height:shipHeight,
    width:shipWidth

}
let shipImg;
let shipVelocity=tile;//ship moving speed here 1 tile at time

//aliens
let aliensArray=[];
let alienWidth = tile*2;
let alienHeight = tile
let alienX = tile;
let alienY = tile;
let alienImg;

let alienRows = 2;
let alienCols = 3;
let alienCount = 0;
let alienVelocity=1;


//bullets
let bulletsArray=[];
let bulletVelocity=-10; //in y direction and we have to move from bottom to top so -10


let gameOver=false;
let score=0;



window.onload=function(){
    board=document.getElementById("gameBoard");
    board.width=boardWidth;
    board.height=boardHeight;
    context=board.getContext("2d");//to draw on the board

    //to load ship image
    shipImg=new Image()
    shipImg.src="./ship1.png"
    
    shipImg.onload=function(){
        context.drawImage(shipImg,ship.x,ship.y,ship.width,ship.height);//draw ship on board as per given specifications
    }
    //to load alien image
    
    alienImg=new Image()
    alienImg.src="./alien.png"
    alienImg.onload=function(){
    createAliens();


    requestAnimationFrame(update);
    document.addEventListener("keydown",moveTheShip);
    document.addEventListener("keyup",shoot);

}

function update(){
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);//clearing the board
    //update ship movement
    context.drawImage(shipImg,ship.x,ship.y,ship.width,ship.height);
    ship.x = Math.max(0, Math.min(boardWidth - ship.width, ship.x));//to make sure the board stay inside the canvas

    //update alien and draw
    for(let i=0;i<aliensArray.length;i++){
        let alien=aliensArray[i];
        if(alien.alive){
            alien.x+=alienVelocity;
            //if alien touches the border we have to flip the velocity to opposite side
            //and also we have to move the aliens move forward
            if(alien.x+alienWidth>=board.width || alien.x<=0){
                alienVelocity*=-1;
                alien.x+=alienVelocity*2;

                for(let j=0;j<aliensArray.length;j++){
                    aliensArray[j].y+=alienHeight;
                }
            }
            context.drawImage(alienImg,alien.x,alien.y,alien.width,alien.height);


            if(alien.y>ship.y){
                gameOver=true;
            }
        }



        if (gameOver) {
            console.log("Game Over triggered");
            displayGameOverMessage();
            return;
        }

    }
    //bullets image and movment
    for(let i=0;i<bulletsArray.length;i++){
        let bullet=bulletsArray[i];
        bullet.y+=bulletVelocity;
        context.fillStyle="white";
        context.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);

        //bullet collision with aliens
        for (let j = 0; j < aliensArray.length; j++) {
            let alien = aliensArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score+=100
    
            }
        }
    }

    //clear the bullets
    while(bulletsArray.length>0 &&(bulletsArray[0].used || bulletsArray[0].y<0)){
        bulletsArray.shift()
    }


    if (alienCount == 0) {
        //increase the number of aliens in columns and rows by 1
        score += alienCols * alienRows * 100; //bonus points :)
        alienCols = Math.min(alienCols + 1, cols/2 -2); //cap at 16/2 -2 = 6
        alienRows = Math.min(alienRows + 1, rows-4);  //cap at 16-4 = 12
        if (alienVelocity > 0) {
            alienVelocity += 0.2; //increase the alien movement speed towards the right
        }
        else {
            alienVelocity -= 0.2; //increase the alien movement speed towards the left
        }
        aliensArray = [];
        bulletsArray = [];
        createAliens();
    }

    //score
    context.fillStyle="white";
    context.font='18px courier'
    context.fillText(score,5,20);

    
    
}

function moveTheShip(event){

    if(gameOver){
        return
    }
    if(event.code=="ArrowLeft"){
        ship.x -=shipVelocity;// ship moves to one tile right since velocity=1tile
    }
    else if(event.code=="ArrowRight"){
        ship.x +=shipVelocity;// // ship moves to one tile left since velocity=1tile
    }
}

function createAliens(){
    for(let c=0;c<alienCols;c++){
        for(let r=0;r<alienRows;r++){
            let alien={
                x:alienX+c*alienWidth,
                y:alienY+r*alienHeight,
                width:alienWidth,
                height:alienHeight,
                img:alienImg,
                alive:true

            }
        aliensArray.push(alien)
        }
    }
    alienCount=aliensArray.length;
}}


function shoot(event){
    if(gameOver){
        return
    }

    if(event.code=="Space"){
        let bullet={
            x:ship.x+shipWidth*15/32,
            y:ship.y,
            width:tile/8,
            height:tile/2,
            used:false
        }
        bulletsArray.push(bullet);
    }
}

//for detecting the collision of two rectangles: bullet and alien
function detectCollision(a, b) {
    if (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    ) {
        return true; // Collision detected
    }
    return false; // No collision
}


function displayGameOverMessage() {
    context.fillStyle = "red";
    context.font = "bold 36px courier";
    context.fillText("Game Over", boardWidth / 2 - 90, boardHeight / 2);
}