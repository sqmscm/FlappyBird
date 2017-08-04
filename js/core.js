/*
JavaScript FlappyBird
Code: https://github.com/sqmscm/FlappyBird
Demo: https://sqmscm.github.io/FlappyBird
*/
//Core functions
var log = console.log.bind(console); //used to debug
var Game = function(images, runner) {
    var o = {
        keys: {},
        callbacks: {},
        fps: 0,
        collision: 0,
        images: {},
        mouseControl: true,
        keyboardControl: true,
        load: true,
        clickFunctions: {},
        cursorChanger: {},
    }
    var canvas = document.getElementById('viewer');
    var context = canvas.getContext('2d');
    //异步加载图片，全部加载完后才会运行！
    var loads = [];
    var names = Object.keys(images);
    for (var i = 0; i < names.length; i++) {
        let name = names[i];
        var path = images[name];
        let img = new Image();
        img.src = path;
        img.onload = function() {
            o.images[name] = img;
            loads.push(1);
            if (loads.length == names.length) {
                o.load = false;
                o.startMenu();
            }
        }
    }
    //Loading Scene
    o.loading = function() {
        if (o.load) {
            canvas.height = canvas.height;
            context.font = "30px Courier";
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = "#0000ff";
            context.fillText("Loading... " + Math.floor(loads.length / names.length * 100) + "%", canvas.width / 2, canvas.height / 2 - 15);
            context.fillText("Please Wait", canvas.width / 2, canvas.height / 2 + 15);
            setTimeout(function() {
                o.loading();
            }, 1000 / 10)
        }
    }
    o.loading();
    //Start Scene
    o.startMenu = function() {
        canvas.height = canvas.height;
        var menuback = SImage(o.images["bg"]);
        var menuground = SImage(o.images["ground"]);
        var menubird = SImage(o.images["birdfly"]);
        menuground.y = canvas.height - menuground.height / 2;
        menubird.x = canvas.width / 2 - menubird.width / 2;
        menubird.y = canvas.height / 2 - menubird.height / 2;
        var start = SImage(o.images["start"]);
        start.x = canvas.width / 2 - start.width / 2;
        start.y = canvas.height / 1.5;
        var logo = SImage(o.images["logo"]);
        logo.x = canvas.width / 2 - logo.width / 2;
        logo.y = canvas.height / 5;
        o.draw(menuback);
        o.draw(menuground);
        o.draw(start);
        o.draw(logo);
        o.draw(menubird);
        o.enableChangeCursor(start, "pointer");
        o.enableClick(start, function() {
            o.disableClick(start);
            o.disableChangeCursor(start);
            runner();
        });
    }
    //set background
    o.setBackground = function(image) {
        o.bg = SImage(image);
        o.bg.width = canvas.width;
        o.bg.height = canvas.height;
    }
    //draw items
    o.draw = function(item) {
        if (item.rotate) {
            context.save(); //保存画布状态
            context.translate(item.x + item.width / 2, item.y + item.height / 2); //以图像中心为原点
            context.rotate(item.rotate * Math.PI / 180); //旋转
            context.translate(-item.x - item.width / 2, -item.y - item.height / 2); //恢复原坐标系原点
        }
        if (item.property == "image") {
            context.drawImage(item.img, item.x, item.y, item.width, item.height);
        } else {
            context.fillStyle = item.color;
            if (item.style == "rect") {
                if (item.stroke) {
                    context.strokeStyle = item.stroke;
                    context.strokeRect(item.x, item.y, item.width, item.height);
                }
                context.fillRect(item.x, item.y, item.width, item.height);
            } else if (item.style == "circle") {
                context.beginPath();
                context.arc(item.x, item.y, item.radius, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
            }
        }
        if (item.rotate) {
            context.restore(); //恢复画布状态
        }
    }
    //events
    o.registerCallback = function(key, callback) {
        window.addEventListener('keydown', function(event) {
            if (event.key == key)
                o.keys[event.key] = true;
        })
        window.addEventListener('keyup', function(event) {
            if (event.key == key)
                o.keys[event.key] = false;
        })
        o.callbacks[key] = callback;
    }
    //Detect collision
    o.detCol = function(bullet, enemy) {
        if (bullet.y <= enemy.y + enemy.height && bullet.y + bullet.height >= enemy.y) {
            if (bullet.x + bullet.width >= enemy.x && bullet.x <= enemy.x + enemy.width) {
                return true;
            }
        }
        return false;
    }
    //Update score
    o.updateScore = function() {
        var py = 5;
        if (window.over) {
            o.end();
            py = canvas.height / 2 - 18;
            var overBanner = SImage(o.images["over"]);
            overBanner.x = canvas.width / 2 - overBanner.width / 2;
            overBanner.y = canvas.height / 2 - 25 - overBanner.height;
            o.draw(overBanner);
            var start = SImage(o.images["start"]);
            start.x = canvas.width / 2 - start.width / 2;
            start.y = canvas.height / 1.5;
            o.draw(start);
            var logo = SImage(o.images["logo"]);
            logo.x = canvas.width / 2 - logo.width / 2;
            logo.y = canvas.height / 5;
            o.draw(logo);
            o.enableChangeCursor(start, "pointer");
            o.enableClick(start, function() {
                o.disableClick(start);
                o.disableChangeCursor(start);
                o.running = o.runningTemp;
                runner();
            });
        }
        var temp = window.score;
        var bits = [];
        while (temp != 0) {
            bits.push(temp % 10);
            temp = Math.floor(temp / 10);
        }
        if (bits.length == 0) {
            var abit = SImage(o.images["s0"]);
            abit.x = canvas.width / 2 - abit.width / 2;
            abit.y = py;
            o.draw(abit);
        } else {
            var px = canvas.width / 2 - 24 * bits.length / 2
            for (var i = bits.length - 1; i >= 0; i--) {
                var abit;
                switch (bits[i]) {
                    case 0:
                        abit = SImage(o.images["s0"]);
                        break;
                    case 1:
                        abit = SImage(o.images["s1"]);
                        break;
                    case 2:
                        abit = SImage(o.images["s2"]);
                        break;
                    case 3:
                        abit = SImage(o.images["s3"]);
                        break;
                    case 4:
                        abit = SImage(o.images["s4"]);
                        break;
                    case 5:
                        abit = SImage(o.images["s5"]);
                        break;
                    case 6:
                        abit = SImage(o.images["s6"]);
                        break;
                    case 7:
                        abit = SImage(o.images["s7"]);
                        break;
                    case 8:
                        abit = SImage(o.images["s8"]);
                        break;
                    case 9:
                        abit = SImage(o.images["s9"]);
                        break;
                }
                abit.x = px;
                abit.y = py;
                px += abit.width;
                o.draw(abit);
            }
        }
    }
    //Enable drug
    o.enableDrag = function(element, mode) {
        var ofx, ofy;
        canvas.addEventListener('mousedown', function(event) {
            if (!o.mouseControl)
                return;
            if (o.isInside(element, event.offsetX, event.offsetY)) {
                ofx = event.offsetX - element.x;
                ofy = event.offsetY - element.y;
                element.selected = true;
            } else element.selected = false;
        });
        canvas.addEventListener('mousemove', function(event) {
            if (!o.mouseControl)
                return;
            if (element.style == "circle") {
                element.width = element.radius;
                element.height = element.radius;
            }
            if (element.selected) {
                if ((mode == "horizon" || mode == "plane") &&
                    event.offsetX - ofx <= canvas.width - element.width &&
                    event.offsetX - ofx >= 0)
                    element.x = event.offsetX - ofx;
                if ((mode == "vertical" || mode == "plane") &&
                    event.offsetY - ofy <= canvas.height - element.height &&
                    event.offsetY - ofy >= 0)
                    element.y = event.offsetY - ofy;
                if (o.fps < 1) {
                    canvas.height = canvas.height;
                    o.render();
                }
            }
        });
        canvas.addEventListener('mouseup', function(event) {
            if (!o.mouseControl)
                return;
            element.selected = false;
        });
    }
    //Enable click
    o.enableClick = function(element, movement) {
        function clickfunc(event) {
            if (o.isInside(element, event.offsetX, event.offsetY))
                movement();
        }
        canvas.addEventListener('click', clickfunc);
        element.clickId = Math.floor(Math.random * 1000000).toString();
        o.clickFunctions[element.clickId] = clickfunc;
    }
    //Disable click
    o.disableClick = function(element) {
        canvas.removeEventListener('click', o.clickFunctions[element.clickId]);
    }
    //change cursor
    o.enableChangeCursor = function(element, style) {
        function changeCursor(event) {
            if (o.isInside(element, event.offsetX, event.offsetY))
                canvas.style.cursor = style;
            else {
                canvas.style.cursor = "auto";
            }
        }
        canvas.addEventListener('mousemove', changeCursor);
        element.cursorId = Math.floor(Math.random * 1000000).toString();
        o.cursorChanger[element.cursorId] = changeCursor;
    }
    //Disable change cursor
    o.disableChangeCursor = function(element) {
        canvas.style.cursor = "auto";
        canvas.removeEventListener('mousemove', o.cursorChanger[element.cursorId]);
    }
    //Check if a point is inside an element
    o.isInside = function(element, offsetX, offsetY) {
        if (element.style == "rect" && offsetX >= element.x &&
            offsetX <= element.x + element.width && offsetY >= element.y &&
            offsetY <= element.y + element.height)
            return true;
        if (element.style == "circle") {
            var tempX = offsetX - element.x;
            var tempY = offsetY - element.y;
            if (Math.sqrt(tempX * tempX + tempY * tempY) <= element.radius)
                return true;
        }
        return false;
    }
    //Control fps
    o.updateFPS = function(fps) {
        var data;
        if (fps) {
            data = fps;
        } else {
            data = 30;
        }
        o.fps = data;
    }
    //Running loop
    o.running = function() {
        if (o.fps >= 1) {
            var keys = Object.keys(o.keys);
            for (var i = 0; i < keys.length; i++) {
                if (o.keys[keys[i]] && o.keyboardControl) {
                    o.callbacks[keys[i]]();
                }
            }
            canvas.height = canvas.height; //clear canvas
            if (o.bg) {
                o.draw(o.bg); //draw background
            }
            o.render();
            o.collision = 0; //clear the times.
        }
        setTimeout(function() {
            o.running();
        }, 1000 / o.fps)
    }
    //Termination
    o.end = function() {
        o.running = function() {}
    }
    o.runningTemp = o.running;
    return o;
}
