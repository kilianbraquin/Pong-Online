import * as Constants from "../constants";
import { GetAllPlayersID } from "../functions";
import { Player, PlayerAction, PlayerStatus } from "../types";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let playerID: string;
let players: Record<string, Player>;
const socket = io();
socket.on("connect", () => (playerID = socket.id));
socket.on("currentPlayers", (data) => {
  players = data as Record<string, Player>;
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

function drawBall(x: number, y: number) {
  ctx.beginPath();
  ctx.arc(x, y, Constants.ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();
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
  drawBall(400, 200);
  const playersID = GetAllPlayersID(players);
  for (let i = 0; i < Math.min(2, playersID.length); i++) {
    let x: number;
    const y = players[playersID[i]].y;
    if (i == 0) x = Constants.playerOffset;
    else x = Constants.width - Constants.playerOffset;
    drawPaddle(x, y);
    console.log({ x, y });
  }

  drawScore();
}
