import { Ball, Player, PlayerAction, SocketEvent } from "../types";

declare global {
  const io: (url?: string) => Socket;

  interface Socket {
    id: string;
    on: (
      event: SocketEvent,
      callback: (data: Ball | Player | Record<string, Player> | string) => void
    ) => void;
    emit: (event: SocketEvent, data: PlayerAction) => void;
  }
}
