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
    o.move = function() {
        o.x--;
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
        speed: 5,
        alive: true,
        needup: false,
    }
    o.img = a;
    o.imgup = b;
    o.imgdown = c;
    o.width = o.img.width;
    o.height = o.img.height;
    o.x = canvas.width / 3 - o.width / 2;
    o.y = canvas.height / 2.5;
    o.down = function() {
        o.y += o.speed;
        o.img = o.imgdown;
    }
    o.up = function() {
        o.y -= o.speed + 5;
        o.img = o.imgup;
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
