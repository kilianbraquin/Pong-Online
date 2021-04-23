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
  | "currentPlayers"
  | "newPlayer"
  | "action"
  | "disconnect"
  | "removePlayer"
  | "updatePlayer";
