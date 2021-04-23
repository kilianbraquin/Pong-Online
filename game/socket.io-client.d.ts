import { Player, PlayerAction, SocketEvent } from "../types";

declare global {
  const io: (url?: string) => Socket;

  interface Socket {
    id: string;
    on: (
      event: SocketEvent,
      callback: (data: Player | Record<string, Player>) => void
    ) => void;
    emit: (event: SocketEvent, data: PlayerAction) => void;
  }
}
