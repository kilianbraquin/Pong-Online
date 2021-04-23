import { Server } from "socket.io";
import {
  ballInitialPositionX,
  ballInitialPositionY,
  ballRadius,
  ballSpeed,
  playerInitialPositionY,
  width,
} from "./constants";
import {
  CheckCollide,
  GetGoal,
  GetPlayingPlayers,
  MoveBall,
  MovePlayer,
} from "./functions";
import { Ball, GoalEvent, Player } from "./types";

export default function serverGameLoop(
  io: Server,
  players: Record<string, Player>,
  ball: Ball
) {
  // Engagement
  if (ball.xSpeed === 0) ball.xSpeed = -ballSpeed;
  if (ball.ySpeed === 0) ball.ySpeed = -ballSpeed;

  const ActivePlayers = GetPlayingPlayers(players);

  let goal: GoalEvent;
  if (ActivePlayers.length === 2) {
    // Mode Versus
    goal = GetGoal(ball, width);
    if (goal === "LEFT") {
      ball.xSpeed = -ballSpeed;
      ball.ySpeed = -ballSpeed;
      ActivePlayers[0].score += 1;
    } else if (goal === "RIGHT") {
      ball.xSpeed = ballSpeed;
      ball.ySpeed = ballSpeed;
      ActivePlayers[1].score += 1;
    }
    if (goal !== "NONE") {
      ball.x = ballInitialPositionX;
      ball.y = ballInitialPositionY;
      ActivePlayers.forEach((player) => {
        player.y = playerInitialPositionY;
        io.emit("infoPlayer", player);
      });
    }
  } else if (ActivePlayers.length === 1) {
    // Mode Training
    goal = GetGoal(ball, width / 2 - ballRadius - 3);
    if (goal === "LEFT") {
      ball.xSpeed = -ballSpeed;
      goal = "NONE";
    }
    if (goal === "RIGHT") {
      ball.xSpeed = -ballSpeed;
      ball.ySpeed = -ballSpeed;
      ball.x = ballInitialPositionX;
      ball.y = ballInitialPositionY;
    }
  } else goal = "NONE";

  if (goal === "NONE") {
    if (ball.xSpeed < 0 && ActivePlayers.length > 0) {
      if (CheckCollide(ball, ActivePlayers[0], "LEFT")) ball.xSpeed = ballSpeed;
    } else if (ball.xSpeed > 0 && ActivePlayers.length > 1) {
      if (CheckCollide(ball, ActivePlayers[1], "RIGHT"))
        ball.xSpeed = -ballSpeed;
    }
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
  }
  io.emit("infoBall", ball);

  setTimeout(() => serverGameLoop(io, players, ball), 1000 / 60);
}
