import { Server } from "socket.io";
import { ballSpeed, width } from "./constants";
import { GetGoal, GetPlayingPlayers, MoveBall, MovePlayer } from "./functions";
import { Ball, GoalEvent, Player } from "./types";

export default function serverGameLoop(
  io: Server,
  players: Record<string, Player>,
  ball: Ball
) {
  if (ball.xSpeed === 0) ball.xSpeed = -ballSpeed;
  if (ball.ySpeed === 0) ball.ySpeed = -ballSpeed;
  const ActivePlayers = GetPlayingPlayers(players);
  ActivePlayers.forEach((player) => {
    const newPositionY = MovePlayer(player);
    if (newPositionY !== player.y) {
      player.y = MovePlayer(player);
      io.emit("infoPlayer", player);
    }
  });
  const { x, y, ySpeed } = MoveBall(ball);
  ball.x = x;
  ball.y = y;
  ball.ySpeed = ySpeed;

  if (ActivePlayers.length === 2) {
    // Mode Versus
    const goal = GetGoal(ball, width);
    io.emit("infoBall", ball);
  } else if (ActivePlayers.length === 1) {
    // Mode Training
    const goal = GetGoal(ball, width / 2);
    io.emit("infoBall", ball);
  }

  setTimeout(() => serverGameLoop(io, players, ball), 1000 / 60);
}
