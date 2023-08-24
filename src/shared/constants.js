module.exports = Object.freeze({
  PLAYER: {
    MAX_HP: 100,
    SPEED: 50,
    RADUIS: 50,
    FIRE: .1
  },

  BULLET: {
    SPEED: 1500,
    RADUIS: 20
  },

  CARD: {
    SIZE_W: 300,
    SIZE_H: 200,
  },

  PROP: {
    CREATE_TIME: 10,
    RADUIS: 30
  },

  MAP_SIZE: 5000,
  MAP_SIZE_W: 1920,//3840,
  MAP_SIZE_H: 1080,//2160,

  MSG_TYPES: {
    JOIN_GAME: 1,
    UPDATE: 2,
    INPUT: 3,
    GAME_OVER: 4,
    GET_DELAY: 5
  }
})