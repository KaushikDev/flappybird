// JAVASCRIPT CODE //
//Declare and define the canvas
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
//setting canvas width and height
let cWidth = cnv.width = window.innerWidth - 25;
let cHeight = cnv.height = window.innerHeight - 25;

//constants and variables
let frames= 0;
const DEGREE  = Math.PI /180; //since we have rotation in radians, we will convert them to degrees

//load the sprite image
let sprite = new Image();
sprite.src = "img/sprite.png";

//game sounds
const SCORE_S =  new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLAP =  new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT =  new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING =  new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE =  new Audio();
DIE.src = "audio/sfx_die.wav";

//game state
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

//start button coordinates
const startBtn = {
    x : cWidth/2 - 225/2,
    y : 90+100,
    w : 104,
    h : 36
}

//game controller
cnv.addEventListener("click", function(event){
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;

        case state.game:
            bird.flap();
            FLAP.play();
            break;

        case state.over:
            // let rect = cnv.getBoundingClientRect();
            // let clickX = event.clientX - rect.left;
            // let clickY = event.clientY - rect.top;

            // console.log("clicked coordinates are : " + clickX, clickY);
            // //checking if click on start button
            // if (clickX >= startBtn.x && clickX <= startBtn.x+startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h) {
                state.current = state.getReady;
                pipes.reset();
                bird.speedReset();
                score.reset();
            // }
            
            break;
    }
});

//background
const bg = {
    sX :  0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : cHeight-226,

    draw : function (){
                    //TODO: refactor this code by introducing the target width
            for (let i = 0; i <= 5; i++) {
                
                ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
                this.x = i * this.w;
            }
                    
            
    }
}

//foreground
const fg = {
    sX : 276,
    sY : 0,
    w : 224,
    h : 112,
    x : 0,
    y : cHeight-112,
   // tW : cWidth, 
    dx : 2,

    draw : function (){
        //TODO: refactor this code by introducing the target width
        for (let i = 0; i <= 6; i++) {
                
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            this.x = i * this.w;
        }
        // ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.tW, this.h);
    },

    update : function(){
        // if (state.current == state.game) {
        //     this.x = (this.x - this.dx)%(this.w/2);
        // }
    }


}

//bird
const bird = {
    animation : [
        {sX : 276, sY: 112},
        {sX : 276, sY: 139},
        {sX : 276, sY: 164},
        {sX : 276, sY: 139},
    ],

    x : 50,
    y : 150,
    w : 34,
    h : 26,
    radius : 12,
    frame : 0, //this controls the bird flapping.
    gravity : 0.25,
    speed : 0,
    jump : 4.6,
    rotation : 0,
    
    draw : function(){
        let bird = this.animation[this.frame];
        ctx.save(); //save context while rotating the bird
        ctx.translate(this.x, this.y); //bringing the origin of rotation to bird's position
        ctx.rotate(this.rotation); //so actually we are saving the canvas context and rotating the canvas and then restoring it to give the illusion bird is rotating.

        //before rotation
        // ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, this.x -this.w/2, this.y-this.h/2, this.w, this.h);
        
        //after rotation we do not need to include this.x and this.y?? why?? Please find out.
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, -this.w/2, -this.h/2, this.w, this.h);
        ctx.restore();
    },

    flap : function(){
        this.speed = - this.jump;

    },
    update : function(){
        //If game state is in getReady mode, bird should flap slowly
        this.period = state.current == state.getReady ? 20 :10;
        //incrementing the frame by 1 for each period(ie. 10 or 5 depending upon the state)
        this.frame += frames% this.period == 0 ?1 :0;
        //If frame goes from 0 to 4, reset the frame to 0 because we only have 4 animations for bird in the animation array, so 5 and above doesn't count
        this.frame = this.frame % this.animation.length; //4 % 4 = 0

        if (state.current == state.getReady) {
            this.y = 150;
            this.rotation = 0; //no rotation when game is in ready mode
        }else{
            this.speed += this.gravity;
            this. y += this.speed;

            //collision detection with ground
            if (this.y + this.h/2 >= cHeight - fg.h) {
                this. y = cHeight - fg.h - this.h/2;
                if (state.current == state.game) {
                    state.current = state.over;
                    DIE.play();
                
                }
                
            }

            //if the speed is greater than the jump, i.e. bird is falling down, rotate to 90 degrees.
            if (this.speed >= this.jump) {
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            }else{
                this.rotation = -25 * DEGREE;
            }


        }


        
    },

    speedReset : function(){
        this.speed = 0;
    }

}

// get ready message
 const getReady = {
     sX : 0, 
     sY : 228,
     w : 173,
     h : 152,
     x : cWidth/2 - 173/2,
     y : 80,
         
    draw : function(){
        if (state.current == state.getReady) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x , this.y, this.w, this.h);
        }
        
    }
 }

 //game over
 const gameOver = {
    sX : 192, 
    sY : 228,
    w : 192,
    h : 42, //202
    x : cWidth/2 - 192/2,
    y : cHeight/2 - 42/2,
        
   draw : function(){
      if (state.current ==  state.over) {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x , this.y, this.w, this.h);    
      }
      
   }
}

//pipes
const pipes={
    position: [],
    top : {
        sX : 553,
        sY : 0
    },
    bottom : {
        sX : 502,
        sY : 0
    },
    w : 53,
    h : 400, //400
    gap: 125,
    maxYPos : -150,
    dx : 5,
    draw : function(){
        for(let i =0; i< this.position.length; i++){
            let p = this.position[i];

            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;

            //top pipe
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x , topYPos, this.w, this.h);  

            //bottom pipe
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x , bottomYPos, this.w, this.h); 
        }
    },

    update : function(){

        if (state.current !== state.game) {
            return;
        }

        if (frames%50 == 0) {
            this.position.push({
                x : cWidth,
                y : this.maxYPos * (Math.random() + 1)
            });
        }
        for(let i =0; i< this.position.length; i++){
            let p = this.position[i];

           

            let bottomPipeYPos = p.y + this.h + this.gap;

            //collision detection with top pipe
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
                state.current = state.over;
                HIT.play();
            }
            //collision detection with bottom pipe
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){
                state.current = state.over;
                HIT.play();
            }

            //Move the pipes to the left
            p.x -= this.dx

            //if pipes go beyond the canvas, we delete them from the array
            if (p.x + this.w <= 0) {
                this.position.shift();
                score.value+=1;
                SCORE_S.play();
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }

        }


    },

    reset : function(){
        this.position = [];
    }

}

//score
const score = {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    draw : function(){
        ctx.fillStyle = "yellow";
        ctx.strokeStyle = "#000";
        if (state.current == state.game) {
            ctx.font = "15px Verdana";
            ctx.fillText("Score : "+this.value, 20, 20);
            ctx.strokeText("Score : "+this.value, 20, 20);
        }else if (state.current == state.over) {
            ctx.fillStyle = "yellow";
            ctx.strokeStyle = "#000";
           //score value
            ctx.font = "30px Verdana";
            ctx.fillText("Score : "+this.value, cWidth/2 - 192/2+20, cHeight/2+42);
            ctx.strokeText("Score : "+this.value, cWidth/2 - 192/2+20, cHeight/2+42);
          
            //best score
           
            ctx.fillText("Best : "+this.best, cWidth/2 - 192/2+20, cHeight/2+42+42);
            ctx.strokeText("Best : "+this.best, cWidth/2 - 192/2+20, cHeight/2+42+42);
        }
    },

    reset : function(){
        this.value = 0;
    }
}

//branding
const kca = {
    draw : function(){
        ctx.fillStyle = "yellow";
        ctx.strokeStyle = "#000";
        ctx.font = "20px Verdana";
        ctx.fillText("@KaushikCodeArts", cWidth/2 - 75, cHeight-(fg.h/2));
        ctx.strokeText("@KaushikCodeArts", cWidth/2 - 75, cHeight-(fg.h/2));
    }
}

//draw fucntion that draws everything
function draw(){
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, cWidth, cHeight);
    bg.draw();
    pipes.draw();
    fg.draw();
    kca.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
    

}



//update function that updates the images on canvas
function update(){
    bird.update();
    fg.update();
    pipes.update();
}

//loop function that loops over the frames
function loop(){
    update();    
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();

