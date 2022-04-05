window.addEventListener("DOMContentLoaded", () => {
    const soundImg = document.querySelector(".sound");
    const canvas = document.querySelector("#canvas-one");
    const ctx = canvas.getContext("2d");
    let height = innerHeight - 4;
    let width = Math.floor((height * 9) / 16);
    canvas.height = height;
    canvas.width = width;

    let numSprite = new Image();
    numSprite.src = "assets/number.png";

    let mountain = new Image();
    mountain.src = "assets/mountain.png";
    let ground = new Image();
    ground.src = "assets/ground.png";
    let pipe_1 = new Image();
    pipe_1.src = "assets/pipe_1.png";
    let pipe_2 = new Image();
    pipe_2.src = "assets/pipe_2.png";
    let welcome = new Image();
    welcome.src = "assets/welcome.png";
    let gameOver = new Image();
    gameOver.src = "assets/game_over.png";

    let pointAudio = new Audio("assets/point.wav");
    let gameOverAudio = new Audio("assets/over.wav");

    let muted = false;
    let game_running = false;
    let game_over = false;
    let pressed = false;
    let pipeArr = [];

    let bird_size = 25;
    let game_speed = 2;
    let score = 0;
    let scoreSize = 25;
    let scoreX = width / 2 - scoreSize + 5;

    bird = {
        img: new Image(),
        size: bird_size,
        x: 20,
        y: Math.floor(height / 2 - bird_size / 2),
    };
    bird.img.src = "assets/bird.png";

    class Pipe {
        constructor() {
            this.pipe_1_x = width + 20;
            this.pipe_2_x = width + 20;
            let temp = height - 300;
            let buffer = 100;
            let height_one = Math.floor(Math.random() * (temp - 200) + 200);
            this.height_one = height_one;
            this.height_two = height - this.height_one - buffer;
            this.pipe_1_y = height - this.height_one;
            this.pipe_2_y = 0;
            this.width = 15;
            this.score = false;
        }
        draw() {
            ctx.drawImage(
                pipe_1,
                0,
                0,
                pipe_1.width,
                pipe_1.height,
                this.pipe_1_x,
                this.pipe_1_y,
                this.width,
                this.height_one
            );
            ctx.drawImage(
                pipe_2,
                0,
                0,
                pipe_2.width,
                pipe_2.height,
                this.pipe_2_x,
                this.pipe_2_y,
                this.width,
                this.height_two
            );
        }
        update() {
            this.pipe_1_x -= game_speed;
            this.pipe_2_x -= game_speed;
        }
        isCollided() {
            let collision = false;
            if (
                bird.x < this.pipe_1_x + this.width &&
                bird.x + bird.size > this.pipe_1_x &&
                bird.y < this.pipe_1_y + this.height_one &&
                bird.size + bird.y > this.pipe_1_y
            ) {
                collision = true;
            }
            if (
                bird.x < this.pipe_2_x + this.width &&
                bird.x + bird.size > this.pipe_2_x &&
                bird.y < this.pipe_2_y + this.height_two &&
                bird.size + bird.y > this.pipe_2_y
            ) {
                collision = true;
            }
            return collision;
        }
    }

    let x = 0;
    let frame = 0;
    function animate() {
        let animationFrame = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);
        if (game_running) {
            ctx.drawImage(
                mountain,
                x,
                0,
                width,
                mountain.height,
                0,
                0,
                width,
                height
            );
            ctx.drawImage(
                mountain,
                x - mountain.width + 1,
                0,
                width,
                mountain.height,
                0,
                0,
                width,
                height
            );
            x += game_speed;
            if (x > mountain.width) x = 0;

            if (pressed) {
                bird.y -= 3;
            } else {
                bird.y += 3;
            }
            if (bird.y > height - bird.size) bird.y = height - bird.size;
            else if (bird.y < 0) bird.y = 0;

            if (frame % 125 == 0) {
                let pipe = new Pipe();
                pipeArr.push(pipe);
            }
            for (let i = pipeArr.length - 1; i >= 0; i--) {
                pipeArr[i].draw();
                pipeArr[i].update();
                if (pipeArr[i].pipe_1_x < bird.x && !pipeArr[i].score) {
                    pipeArr[i].score = true;
                    score += 1;
                    if (!muted) pointAudio.play();
                }
                if (pipeArr[i].x < -20) {
                    pipeArr.splice(i, 1);
                }
                if (pipeArr[i].isCollided()) {
                    ctx.drawImage(
                        gameOver,
                        0,
                        0,
                        gameOver.width,
                        gameOver.height,
                        0,
                        0,
                        width,
                        height
                    );
                    cancelAnimationFrame(animationFrame);
                    game_over = true;
                    if (!muted) gameOverAudio.play();
                }
            }
            showScore(score);
            ctx.drawImage(
                ground,
                x,
                0,
                width,
                ground.height,
                0,
                0,
                width,
                height
            );
            ctx.drawImage(
                ground,
                x - ground.width + 1,
                0,
                width,
                ground.height,
                0,
                0,
                width,
                height
            );
            ctx.drawImage(
                bird.img,
                0,
                0,
                bird.img.width,
                bird.img.height,
                bird.x,
                bird.y,
                bird.size,
                bird.size
            );
        }
        if (!game_running) {
            ctx.drawImage(
                welcome,
                0,
                0,
                welcome.width,
                welcome.height,
                0,
                0,
                canvas.width,
                canvas.height
            );
        }
        frame++;
        if (frame >= 6000) frame = 0;
    }

    function showScore(number) {
        scoreX = width / 2 - scoreSize;
        let singleNumber = numSprite.width / 10;
        if (number < 10) number = "0" + number;
        let num = number + "";
        num = num.split("");
        for (let i = 0; i < num.length; i++) {
            num[i] = parseInt(num[i]);
            ctx.drawImage(
                numSprite,
                singleNumber * num[i],
                0,
                singleNumber,
                numSprite.height,
                scoreX,
                20,
                scoreSize,
                scoreSize * 1.5
            );
            scoreX += scoreSize;
        }
    }
    animate();
    let canvasDetails = canvas.getBoundingClientRect();
    let leftSpace = canvasDetails.left - 50;
    if (leftSpace < 0) leftSpace = 0;
    soundImg.style.left = `${leftSpace}px`;
    soundImg.addEventListener("click", () => {
        if (!muted) {
            soundImg.style.content = `url(./assets/mute.png)`;
        } else {
            soundImg.style.content = `url(./assets/sound.png)`;
        }
        muted = !muted;
    });
    window.addEventListener("keydown", (e) => {
        if (e.key == " " || e.key == "ArrowUp") {
            pressed = true;
            game_running = true;
        } else if (e.key == "Escape") {
            game_running = false;
        }
    });
    window.addEventListener("keyup", (e) => {
        if (e.key == " " || e.key == "ArrowUp") {
            pressed = false;
        }
        if (e.key == "r") {
            if (game_running && game_over) {
                game_over = false;
                score = 0;
                pipeArr = [];
                bird.y = height / 2 - bird.size / 2;
                animate();
            }
        }
    });
});
