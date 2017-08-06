/*
JavaScript FlappyBird
Code: https://github.com/sqmscm/FlappyBird
Demo: https://sqmscm.github.io/FlappyBird
*/
//A Simple Image
var Pipe = function(a) {
    var o = {
        style: "rect",
        property: "image",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        scored: false,
    }
    o.img = a;
    o.width = o.img.width;
    o.height = o.img.height;
    o.move = function(speed) {
        o.x -= speed;
    }
    return o;
}
//Bird
var Bird = function(a, b, c, canvas) {
    var o = {
        style: "rect",
        property: "image",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        speedup: 10,
        speeddown: 1,
        alive: true,
        needup: false,
        rotate: 0,
        isClick: false,
    }
    o.img = a;
    o.imgup = b;
    o.imgdown = c;
    o.width = o.img.width;
    o.height = o.img.height;
    o.x = canvas.width / 3 - o.width / 2;
    o.y = canvas.height / 2.5;
    o.down = function() {
        o.y += o.speeddown;
        if (o.speeddown < 20) {
            o.speeddown++;
            o.rotate += 3;
        }
        o.img = o.imgdown;
    }
    o.up = function() {
        if (o.y > -20)
            o.y -= o.speedup;
        o.img = o.imgup;
        o.speeddown = 1;
        o.rotate = -20;
    }

    return o;
}
//A Simple Image
var SImage = function(a) {
    var o = {
        style: "rect",
        property: "image",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    }
    o.img = a;
    o.width = o.img.width;
    o.height = o.img.height;
    return o;
}
