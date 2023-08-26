import { updateRanking, updateStandby } from "./render";

const gameUpdates = [];

export function processGameUpdate(update) {
  gameUpdates.push(update)
  updateStandby();
  updateRanking(update.leaderboard)
}

export function getCurrentState() {
  return gameUpdates[gameUpdates.length - 1]
}