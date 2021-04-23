import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { GetAllPlayersID, GetPlayingPlayers } from "./functions";
import {
  ballInitialPositionX,
  ballInitialPositionY,
  playerInitialPositionY,
} from "./constants";
import { Ball, Player, PlayerAction } from "./types";
import serverGameLoop from "./serverGameLoop";

const port = 80;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + "/public"));

const players: Record<string, Player> = {};
const ball: Ball = {
  x: ballInitialPositionX,
  y: ballInitialPositionY,
  xSpeed: 0,
  ySpeed: 0,
};

function resetBall() {
  ball.x = ballInitialPositionX;
  ball.y = ballInitialPositionY;
  ball.xSpeed = 0;
  ball.ySpeed = 0;
}

io.on("connection", (socket) => {
  players[socket.id] = {
    playerId: socket.id,
    currentAction: "NONE",
    status: GetAllPlayersID(players).length >= 2 ? "WAITING" : "PLAYING",
    y: playerInitialPositionY,
    score: 0,
  };

  if (GetAllPlayersID(players).length < 3) resetBall();

  socket.emit("currentPlayers", players);
  socket.broadcast.emit("newPlayer", players[socket.id]);

  socket.on("action", (action: PlayerAction) => {
    players[socket.id].currentAction = action;
  });

  socket.on("disconnect", () => {
    const leavingPlayerID = GetAllPlayersID(players).find(
      (id) => id === socket.id
    );
    if (leavingPlayerID && players[leavingPlayerID]) {
      resetBall();
    }
    delete players[socket.id];

    const versusPlayerID = GetAllPlayersID(players).find(
      (id) => players[id].status === "PLAYING" && id === socket.id
    );
    const waitingPlayerID = GetAllPlayersID(players).find(
      (id) => players[id].status === "WAITING"
    );

    io.emit("removePlayer", socket.id);

    if (versusPlayerID) {
      players[versusPlayerID].score = 0;
      socket.broadcast.emit("infoPlayer", players[versusPlayerID]);
    }
    if (waitingPlayerID) {
      players[waitingPlayerID].status = "PLAYING";
      socket.broadcast.emit("infoPlayer", players[waitingPlayerID]);
    }
  });
});

server.listen(port, function () {
  console.log(`Listening on ${port}`);
});

process.nextTick(() => serverGameLoop(io, players, ball));
