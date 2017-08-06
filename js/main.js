/*
JavaScript FlappyBird
Code: https://github.com/sqmscm/FlappyBird
Demo: https://sqmscm.github.io/FlappyBird
*/
//main
var main = function() {
    var canvas = document.getElementById('viewer');
    var images = {
        bg: "img/bg.png",
        ground: "img/ground.png",
        birdfly: "img/birdfly.png",
        birdup: "img/birdup.png",
        birddown: "img/birddown.png",
        pipe: "img/pipe.png",
        s0: "img/0.png",
        s1: "img/1.png",
        s2: "img/2.png",
        s3: "img/3.png",
        s4: "img/4.png",
        s5: "img/5.png",
        s6: "img/6.png",
        s7: "img/7.png",
        s8: "img/8.png",
        s9: "img/9.png",
        over: "img/over.png",
        guide: "img/guide.png",
        ready: "img/ready.png",
        start: "img/start.png",
        logo: "img/logo.png",
    }
    var game = Game(images, function() {
        game.setBackground(game.images["bg"]);
        var ground = SImage(game.images["ground"]);
        ground.y = canvas.height - ground.height / 2;
        var bird = Bird(game.images["birdfly"], game.images["birdup"], game.images["birddown"], canvas);
        window.score = 0;
        window.over = false;
        var pipeCount = 100;
        var pipes = [];
        var pipeDistance = 120;
        var timeCounter = 0;
        var speed = 1;
        game.render = function() {
            timeCounter++;
            if (bird.needup) {
                bird.up();
                if (bird.isClick) {
                    bird.up();
                    bird.up();
                    bird.up();
                    bird.isClick = false;
                }
                bird.needup = false;
            } else {
                bird.down();
            }
            //Enter the pipe
            if (pipeCount++ >= game.fps * 6 / speed) {
                var pipe1 = Pipe(game.images["pipe"]);
                var y1 = Math.floor(Math.random() * (canvas.height - 50 - pipeDistance - ground.height / 2)) + 50;
                pipe1.y = y1 - pipe1.height;
                pipe1.x = canvas.width;
                var pipe2 = Pipe(game.images["pipe"]);
                pipe2.y = y1 + pipeDistance;
                pipe2.x = canvas.width;
                pipes.push(pipe1);
                pipes.push(pipe2);
                pipeCount = 0;
            }
            for (var i = 0; i < pipes.length; i++) {
                game.draw(pipes[i]);
                pipes[i].move(speed);
                if (game.detCol(pipes[i], bird)) {
                    window.over = true;
                }
                if (pipes[i].x < bird.x && !pipes[i].scored) {
                    pipes[i].scored = true;
                    window.score += 0.5;
                    speed += 0.05;
                }
                if (pipes[i].x < -pipes[i].width) {
                    pipes.slice(i, 1);
                }
            }
            if (bird.y + bird.height >= ground.y) {
                window.over = true;
            }
            //draw the ground
            game.draw(ground);
            ground.x -= speed;
            if (ground.x + ground.width < canvas.width)
                ground.x = 0;
            //draw the bird
            game.draw(bird);
            game.updateScore();
            //ready and tip scene
            if (timeCounter < 100 && !window.over) {
                var guide = SImage(game.images["guide"]);
                guide.x = canvas.width / 2 - guide.width / 2;
                guide.y = canvas.height / 1.5;
                var ready = SImage(game.images["ready"]);
                ready.x = canvas.width / 2 - ready.width / 2;
                ready.y = canvas.height / 5;
                game.draw(guide);
                game.draw(ready);
            }
        }
        //callbacks
        game.registerCallback(" ", function() {
            bird.needup = true;
        });
        canvas.addEventListener("click", function() {
            bird.needup = true;
            bird.isClick = true;
        });
        //Start running
        game.updateFPS();
        game.running();
    });
}
main();
