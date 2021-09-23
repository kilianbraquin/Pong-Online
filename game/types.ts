export type Ball = {
  x: number;
  y: number;
  xSpeed: number;
  ySpeed: number;
};

export type Player = {
  playerId: string;
  currentAction: PlayerAction;
  status: PlayerStatus;
  y: number;
  score: number;
};

export type PlayerAction = "UP" | "DOWN" | "NONE";

export type PlayerStatus = "PLAYING" | "WAITING";

export type SocketEvent =
  | "connect"
  | "connection"
  | "infoBall"
  | "infoPlayer"
  | "currentPlayers"
  | "newPlayer"
  | "action"
  | "disconnect"
  | "removePlayer";

export type GoalEvent = "LEFT" | "RIGHT" | "NONE";
