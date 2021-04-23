define("../constants", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialPositionY = exports.playerHeight = exports.playerWidth = exports.playerOffset = exports.ballRadius = exports.playerSpeed = exports.ballSpeed = exports.width = exports.height = void 0;
    exports.height = 600;
    exports.width = 800;
    exports.ballSpeed = 10;
    exports.playerSpeed = 10;
    exports.ballRadius = 10;
    exports.playerOffset = 20;
    exports.playerWidth = 15;
    exports.playerHeight = 40;
    exports.initialPositionY = exports.height / 2 - exports.playerHeight / 2;
});
define("../types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("../functions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GetAllPlayersID = void 0;
    var GetAllPlayersID = function (players) {
        var keys = Object.keys(players);
        return keys;
    };
    exports.GetAllPlayersID = GetAllPlayersID;
});
define("game", ["require", "exports", "../constants", "../functions"], function (require, exports, Constants, functions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    var playerID;
    var players;
    var socket = io();
    socket.on("connect", function () { return (playerID = socket.id); });
    socket.on("currentPlayers", function (data) {
        players = data;
        draw();
    });
    var score = 0;
    var keysDown = [];
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    function keyDownHandler(e) {
        var key = e.key.toLowerCase();
        if (!keysDown.includes(key) &&
            ["arrowup", "arrowdown", "z", "s"].includes(key)) {
            keysDown.push(key);
            if (keysDown.length === 1) {
                if (key === "arrowup" || key === "z")
                    socket.emit("action", "UP");
                else if (key === "arrowdown" || key === "s")
                    socket.emit("action", "DOWN");
            }
        }
    }
    function keyUpHandler(e) {
        var key = e.key.toLowerCase();
        if (keysDown.includes(key)) {
            keysDown.splice(keysDown.indexOf(key), 1);
            if (keysDown.length === 0)
                socket.emit("action", "NONE");
            else {
                var newMainKey = keysDown[0];
                if (newMainKey === "arrowup" || newMainKey === "z")
                    socket.emit("action", "UP");
                else if (newMainKey === "arrowdown" || newMainKey === "s")
                    socket.emit("action", "DOWN");
            }
        }
    }
    function drawBall(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, Constants.ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
    function drawPaddle(x, y) {
        ctx.beginPath();
        ctx.rect(x, y, Constants.playerWidth, Constants.playerHeight);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.closePath();
    }
    function drawScore() {
        ctx.font = "16px Serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("Score: " + score, 8, 20);
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall(400, 200);
        var playersID = functions_1.GetAllPlayersID(players);
        for (var i = 0; i < Math.min(2, playersID.length); i++) {
            var x = void 0;
            var y = players[playersID[i]].y;
            if (i == 0)
                x = Constants.playerOffset;
            else
                x = Constants.width - Constants.playerOffset;
            drawPaddle(x, y);
            console.log({ x: x, y: y });
        }
        drawScore();
    }
});
