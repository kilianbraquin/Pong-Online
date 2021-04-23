import {
  ballRadius,
  ballSpeed,
  height,
  playerHeight,
  playerSpeed,
  width,
} from "./constants";
import { Ball, Player } from "./types";

export const GetAllPlayersID = (players: Record<string, Player>) => {
  const keys = Object.keys(players);
  return keys;
};

export const GetPlayingPlayers = (
  players: Record<string, Player>
): Player[] => {
  const allPlayersID = GetAllPlayersID(players);
  return allPlayersID
    .filter((id) => players[id].status === "PLAYING")
    .map((id) => players[id]);
};

export const MovePlayer = (player: Player) => {
  const { y, currentAction } = player;

  if (currentAction === "UP" && y - playerSpeed < 0) return 0;
  else if (currentAction === "DOWN" && y + playerSpeed > height - playerHeight)
    return height - playerHeight;
  else {
    if (currentAction === "UP") return player.y - playerSpeed;
    else if (currentAction === "DOWN") return player.y + playerSpeed;
    else return player.y;
  }
};

export const MoveBall = (ball: Ball) => {
  let { x, y } = ball;
  let { xSpeed, ySpeed } = ball;

  if (y + ySpeed < 0 + ballRadius) {
    y = y - ySpeed + ballSpeed;
    ySpeed *= -1;
  } else if (y + ySpeed > width - ballRadius) {
    y = width - y + ySpeed - ballSpeed;
    ySpeed *= -1;
  } else {
    y += ySpeed;
  }

  x += xSpeed;
  return {
    x,
    y,
    ySpeed,
  };
};

export const GetGoal = (ball: Ball, width: number) => {
  if (ball.x < 0 + ballRadius) return "LEFT";
  else if (ball.x > width - ballRadius) return "RIGHT";
  else return "NONE";
};
