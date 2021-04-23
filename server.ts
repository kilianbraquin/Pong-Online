import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { GetAllPlayersID } from "./functions";
import { initialPositionY } from "./constants";
import { Player, PlayerAction, PlayerStatus } from "./types";

const port = 80;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + "/public"));

const players: Record<string, Player> = {};

io.on("connection", (socket) => {
  players[socket.id] = {
    playerId: socket.id,
    currentAction: "NONE",
    status: GetAllPlayersID(players).length > 2 ? "WAITING" : "PLAYING",
    y: initialPositionY,
    score: 0,
  };

  socket.emit("currentPlayers", players);
  socket.broadcast.emit("newPlayer", players[socket.id]);

  socket.on("action", (action: PlayerAction) => {
    console.log(action);
    players[socket.id].currentAction = action;
  });

  socket.on("disconnect", () => {
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
      socket.broadcast.emit("updatePlayer", players[versusPlayerID]);
    }
    if (waitingPlayerID) {
      players[waitingPlayerID].status = "PLAYING";
      socket.broadcast.emit("updatePlayer", players[waitingPlayerID]);
    }
  });
});

server.listen(port, function () {
  console.log(`Listening on ${port}`);
});
