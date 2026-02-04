// JavaScript source code

// some code inspired by https://codepen.io/eltonkamami/pen/ECrKd?editors=0010
//
var canvas = document.querySelector('#starfield_canvas'),
    ctx = canvas.getContext('2d'),
    particles = [],
    particlesNum = 500,
    w = screen.width, //  1920 *
    h = screen.height, // 1080   in my case
    pauseAnim = false,
    doClear = true;

function Factory() {
    this.x = Math.round(Math.random() * w);
    this.y = Math.round(Math.random() * h);
    this.x_prev = null;
    this.y_prev = null;
    this.rad = Math.round(Math.random() * 1) + 1;
    this.rgba = 'rgba(' + randomRange(0, 0) + ', ' + randomRange(10, 255) + ', ' + randomRange(10, 255) + ', ' + randomRange(0.2, 1.0) + ')';
    this.vx = Math.round(Math.random() * 3) - 1.5;
    this.vy = Math.round(Math.random() * 3) - 1.5;
    this.factor = randomRange(1, 6);
}

(function init() {
    canvas.setAttribute('width', screen.width);
    canvas.setAttribute('height', screen.height);

    canvas.style.backgroundColor = 'rgba(0, 0, 0, 1.0)';
    canvas.style.cursor = 'none';

    document.addEventListener("keydown", function(e) {
        if (e.keyCode == 13) {
            toggleFullScreen();
        }
        if (e.keyCode == 32) { // space, Leertaste
            pauseAnim = !pauseAnim;
        }
        if (e.keyCode == 37) { // linker Pfeil
            rotateLeft();
        }
        if (e.keyCode == 39) { // rechter Pfeil
            rotateRight();
        }
        if (e.keyCode == 67) { // c
            e.preventDefault();
            doClear = !doClear;
        }

    }, false);

    for (var i = 0; i < particlesNum; i++) {
        particles.push(new Factory);
    }
})();

(function loop() {
    if (pauseAnim === false)
        draw();
    requestAnimationFrame(loop);
})();


function draw() {
    if (doClear === true)
        ctx.clearRect(0, 0, w, h); // with canvas.backgroundColor

    for (var i = 0; i < particlesNum; i++) {
        var temp = particles[i];
        drawParticle(temp);
        moveParticle(temp);
    }
}

function moveParticle(temp) {
    temp.x_prev = temp.x;
    temp.y_prev = temp.y;

    // bouncing off the edges
    if (temp.x + temp.vx > w || temp.x + temp.vx < 0) {
        temp.vx = -temp.vx;
    }

    if (temp.y + temp.vy > h || temp.y + temp.vy < 0) {
        temp.vy = -temp.vy;
    }

    temp.x += temp.vx;
    temp.y += temp.vy;

}

function drawParticle(temp) {
    var factor = temp.factor;

    ctx.fillStyle = temp.rgba;
    ctx.strokeStyle = temp.rgba;

    ctx.beginPath();
    ctx.arc(temp.x, temp.y, temp.rad * factor, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();


    ctx.beginPath();
    ctx.arc(temp.x, temp.y, (temp.rad + 5) * factor, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.closePath();

}


function randomRange(minVal, maxVal) {
    // one of https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
}

/*
window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
*/

// -----------------------------------------------------------------------------------------------------------------------------------



MAX_DEPTH = 128;
MAX_NUM_STARS = 2048;

//var canvas, ctx;
var stars = new Array(MAX_NUM_STARS);
var fullWidth;
var fullHeight;
var halfWidth;
var halfHeight;
var pausieren = false;
var saveCursorStyle;

/*
window.onload = function() {
    canvas = document.getElementById("starfield_canvas");
    if (canvas && canvas.getContext) {
        canvas.setAttribute('width', screen.width);
        canvas.setAttribute('height', screen.height);

        ctx = canvas.getContext("2d");

		// fill some global variables
        fullWidth = canvas.width;
        fullHeight = canvas.height;
        halfWidth = canvas.width / 2;
        halfHeight = canvas.height / 2;

		// construct and fill the array
        initStars();

		// save for eventual restore
        saveCursorStyle = canvas.style.cursor;
        canvas.style.cursor = 'none';

		requestAnimationFrame(old_draw);
    }
}
*/


function initStars() {
    for (var i = 0; i < stars.length; i++) {
        stars[i] = {
            x: randomRange(-halfWidth, halfWidth),
            y: randomRange(-halfHeight, halfHeight),
            z: randomRange(1, MAX_DEPTH),
            //color: colors[Math.floor(Math.random() * colors.length)]
            // https://www.paulirish.com/2009/random-hex-color-code-snippets/
            //color: '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6)
            color: '#' + (~~(Math.random() * (1 << 24))).toString(16)
        }
    }
}

function old_draw() {

    ctx.fillStyle = "rgb(0,0,0)";
    if (pausieren === false) {
        ctx.fillRect(0, 0, fullWidth, fullHeight);
    }

    // den array nach z sortieren, damit die Punkte in der richtigen Reihenfolge
    // gemalt werden, damit die Verdeckung der hintren liegenden Punkte stimmt
    stars.sort(function(a, b) {
        return b.z - a.z;
    });


    for (var i = 0; i < stars.length; i++) {

        if (pausieren === false) {
            stars[i].z -= 0.2;

            if (stars[i].z <= 0) {
                stars[i].x = randomRange(-halfWidth, halfWidth),
                stars[i].y = randomRange(-halfHeight, halfHeight),
                stars[i].z = MAX_DEPTH,
                //stars[i].color = colors[Math.floor(Math.random() * colors.length)];
                //stars[i].color = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
                stars[i].color = '#' + (~~(Math.random() * (1 << 24))).toString(16);
            }

            var k = 128.0 / stars[i].z;
            var px = stars[i].x * k + halfWidth;
            var py = stars[i].y * k + halfHeight;

            if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
                var size = (1 - stars[i].z / 128.0) * 20;
                //var shade = parseInt((1 - stars[i].z / 32.0) * 255);
                //ctx.fillStyle = "rgb(" + shade + "," + shade + "," + shade + ")";
                //ctx.fillRect(px,py,size,size);
                if (size <= 0) {
                    size = 0.1;
                }
                drawCircle(px, py, size, stars[i].color);
            }
        } else {
            // do nothing
            var dummy = 1;
        }

    }
    requestAnimationFrame(old_draw);

}


function toggleFullScreen() {
    if (!document.mozFullScreen && !document.webkitFullScreen) {
        if (canvas.mozRequestFullScreen) {
            canvas.mozRequestFullScreen();
        } else {
            canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else {
            document.webkitCancelFullScreen();
        }
    }
}

function togglePause() {
    if (pausieren === true) {
        pausieren = false;
    } else {
        pausieren = true;
    }
}

function rotateLeft() {
    // Move registration point to the center of the canvas
    ctx.translate(halfWidth, halfHeight);
    ctx.rotate(-(20 * Math.PI / 180));
    // Move registration point back to the top left corner of canvas
    ctx.translate(-halfWidth, -halfHeight);
}

function rotateRight() {
    // Move registration point to the center of the canvas
    ctx.translate(halfWidth, halfHeight);
    ctx.rotate(20 * Math.PI / 180);
    // Move registration point back to the top left corner of canvas
    ctx.translate(-halfWidth, -halfHeight);
}

function rotate() {
    // Clear the canvas
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Move registration point to the center of the canvas
    context.translate(canvasWidth / 2, canvasWidth / 2);

    // Rotate 1 degree
    context.rotate(Math.PI / 180);

    // Move registration point back to the top left corner of canvas
    context.translate(-canvasWidth / 2, -canvasWidth / 2);

    context.fillStyle = "red";
    context.fillRect(canvasWidth / 4, canvasWidth / 4, canvasWidth / 2, canvasHeight / 4);
    context.fillStyle = "blue";
    context.fillRect(canvasWidth / 4, canvasWidth / 2, canvasWidth / 2, canvasHeight / 4);
}


/* Returns a random number in the range [minVal,maxVal] */

function randomRange(minVal, maxVal) {
    // original:
    //return Math.floor(Math.random() * (maxVal - minVal - 1)) + minVal;
    // one of https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
}

function drawCircle(x, y, r, color) {
    ctx.save(); // save the default state
    ctx.beginPath();

    var radius = r;

    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore(); // restore to the default state
}