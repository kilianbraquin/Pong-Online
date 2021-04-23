import { Player } from "../types";

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
