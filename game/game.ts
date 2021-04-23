import * as Constants from "../constants";
import { GetAllPlayersID, GetPlayingPlayers } from "./functions";
import { Ball, Player } from "../types";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let playerID: string;
let ball: Ball;
let players: Record<string, Player>;
const socket = io();
socket.on("connect", () => (playerID = socket.id));
socket.on("currentPlayers", (data: Record<string, Player>) => {
  players = data;
  draw();
});
socket.on("removePlayer", (playerID: string) => {
  delete players[playerID];
  draw();
});
socket.on("infoBall", (data) => {
  ball = data as Ball;
  draw();
});
socket.on("newPlayer", (player: Player) => {
  players[player.playerId] = player;
  draw();
});
socket.on("infoPlayer", (player: Player) => {
  players[player.playerId] = player;
  draw();
});

const score = 0;

const keysDown = [];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e: KeyboardEvent) {
  const key = e.key.toLowerCase();
  if (
    !keysDown.includes(key) &&
    ["arrowup", "arrowdown", "z", "s"].includes(key)
  ) {
    keysDown.push(key);
    if (keysDown.length === 1) {
      if (key === "arrowup" || key === "z") socket.emit("action", "UP");
      else if (key === "arrowdown" || key === "s")
        socket.emit("action", "DOWN");
    }
  }
}

function keyUpHandler(e: KeyboardEvent) {
  const key = e.key.toLowerCase();
  if (keysDown.includes(key)) {
    keysDown.splice(keysDown.indexOf(key), 1);
    if (keysDown.length === 0) socket.emit("action", "NONE");
    else {
      const newMainKey = keysDown[0];
      if (newMainKey === "arrowup" || newMainKey === "z")
        socket.emit("action", "UP");
      else if (newMainKey === "arrowdown" || newMainKey === "s")
        socket.emit("action", "DOWN");
    }
  }
}

function drawBall(isSecondPlayer: boolean) {
  if (ball) {
    ctx.beginPath();
    ctx.arc(
      Constants.width - ball.x,
      ball.y,
      Constants.ballRadius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
  }
}
function drawPaddle(x: number, y: number) {
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
  const playingPlayers = GetPlayingPlayers(players);
  const isSecondPlayer =
    playingPlayers.length >= 2 && playingPlayers[1].playerId === playerID; // Pour être le joueur de gauche tout le temps

  for (let i = 0; i < playingPlayers.length; i++) {
    let x: number;
    const y = playingPlayers[i].y;
    if ((i === 1 && isSecondPlayer) || (i === 0 && !isSecondPlayer))
      x = Constants.leftPlayerPositionX;
    else x = Constants.rightPlayerPositionX;
    drawBall(isSecondPlayer);
    drawPaddle(x, y);
  }

  drawScore();
}
