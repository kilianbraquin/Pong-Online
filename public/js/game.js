define("../types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("functions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GetPlayingPlayers = exports.GetAllPlayersID = void 0;
    var GetAllPlayersID = function (players) {
        var keys = Object.keys(players);
        return keys;
    };
    exports.GetAllPlayersID = GetAllPlayersID;
    var GetPlayingPlayers = function (players) {
        var allPlayersID = exports.GetAllPlayersID(players);
        return allPlayersID
            .filter(function (id) { return players[id].status === "PLAYING"; })
            .map(function (id) { return players[id]; });
    };
    exports.GetPlayingPlayers = GetPlayingPlayers;
});
define("../constants", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rightPlayerPositionX = exports.leftPlayerPositionX = exports.ballInitialPositionX = exports.ballInitialPositionY = exports.playerInitialPositionY = exports.playerHeight = exports.playerWidth = exports.playerOffset = exports.ballRadius = exports.playerSpeed = exports.ballSpeed = exports.width = exports.height = void 0;
    exports.height = 600;
    exports.width = 1200;
    exports.ballSpeed = 5;
    exports.playerSpeed = 8;
    exports.ballRadius = 10;
    exports.playerOffset = 20;
    exports.playerWidth = 15;
    exports.playerHeight = 80;
    exports.playerInitialPositionY = exports.height / 2 - exports.playerHeight / 2;
    exports.ballInitialPositionY = exports.height / 2 - exports.ballRadius;
    exports.ballInitialPositionX = exports.width / 2 - exports.ballRadius;
    exports.leftPlayerPositionX = exports.playerOffset;
    exports.rightPlayerPositionX = exports.width - exports.playerOffset - exports.playerWidth / 2;
});
define("game", ["require", "exports", "../constants", "functions"], function (require, exports, Constants, functions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    var playerID;
    var ball;
    var players;
    var socket = io();
    socket.on("connect", function () { return (playerID = socket.id); });
    socket.on("currentPlayers", function (data) {
        players = data;
        draw();
    });
    socket.on("removePlayer", function (playerID) {
        delete players[playerID];
        draw();
    });
    socket.on("infoBall", function (data) {
        ball = data;
        draw();
    });
    socket.on("newPlayer", function (player) {
        players[player.playerId] = player;
        draw();
    });
    socket.on("infoPlayer", function (player) {
        players[player.playerId] = player;
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
    function drawBall(isSecondPlayer) {
        if (ball) {
            ctx.beginPath();
            ctx.arc(Constants.width - ball.x, ball.y, Constants.ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
            ctx.closePath();
        }
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
        var playingPlayers = functions_1.GetPlayingPlayers(players);
        var isSecondPlayer = playingPlayers.length >= 2 && playingPlayers[1].playerId === playerID; // Pour être le joueur de gauche tout le temps
        for (var i = 0; i < playingPlayers.length; i++) {
            var x = void 0;
            var y = playingPlayers[i].y;
            if ((i === 1 && isSecondPlayer) || (i === 0 && !isSecondPlayer))
                x = Constants.leftPlayerPositionX;
            else
                x = Constants.rightPlayerPositionX;
            drawBall(isSecondPlayer);
            drawPaddle(x, y);
        }
        drawScore();
    }
});
