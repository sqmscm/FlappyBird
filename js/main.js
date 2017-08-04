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
    }
    var game = Game(images, function() {
        game.setBackground(game.images["bg"]);
        var ground = SImage(game.images["ground"]);
        ground.y = canvas.height - ground.height;
        var bird = Bird(game.images["birdfly"], game.images["birdup"], game.images["birddown"], canvas);
        window.score = 0;
        window.over = false;
        var pipeCount = game.fps * 5;
        var pipes = [];
        game.render = function() {
            //draw the ground
            game.draw(ground);
            ground.x--;
            if (ground.x + ground.width < canvas.width)
                ground.x = 0;
            //draw the bird
            game.draw(bird);
            if (bird.needup) {
                if (bird.y > -50)
                    bird.up();
                bird.needup = false;
            } else {
                bird.down();
            }
            //Enter the pipe
            if (pipeCount++ >= game.fps * 5) {
                var pipe1 = Pipe(game.images["pipe"]);
                var y1 = Math.floor(Math.random() * (canvas.height - 50 - 150 - ground.height)) + 50;
                pipe1.y = y1 - pipe1.height;
                pipe1.x = canvas.width;
                var pipe2 = Pipe(game.images["pipe"]);
                pipe2.y = y1 + 150;
                pipe2.x = canvas.width;
                pipes.push(pipe1);
                pipes.push(pipe2);
                pipeCount = 0;
            }
            for (var i = 0; i < pipes.length; i++) {
                game.draw(pipes[i]);
                pipes[i].move();
                if (game.detCol(pipes[i], bird)) {
                    window.over = true;
                }
                if (pipes[i].x + pipes[i].width < bird.x && !pipes[i].scored) {
                    pipes[i].scored = true;
                    window.score += 0.5;
                }
                if (pipes[i].x < -pipes[i].width) {
                    pipes.slice(i, 1);
                }
            }
            game.updateScore();
        }
        //callbacks
        game.registerCallback(" ", function() {
            bird.needup = true;
        });
        game.enableDrag(bird, "plane");
        //Start running
        game.updateFPS();
        game.running();
    });
}
main();
