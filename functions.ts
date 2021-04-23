import { Player } from "./types";

export const GetAllPlayersID = (players: Record<string, Player>) => {
  const keys = Object.keys(players);
  return keys;
};
