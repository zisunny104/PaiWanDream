module.exports = Object.freeze({
  PLAYER: {
    MAX_HP: 180,
    SPEED: 150,
    RADUIS: 50,
    SIZE_W: 0,
    SIZE_H: 0,
    FIRE: .1
  },

  BULLET: {
    SPEED: 1500,
    RADUIS: 20
  },

  CARD: {
    SIZE_W: 240,
    SIZE_H: 305,
    SIZE_B_W: 300,
    SIZE_B_H: 245,
    CREATE_TIME: 150,
  },

  PROP: {
    CREATE_TIME: 10,
    RADUIS: 30
  },

  MAP_SIZE_W: 1920,
  MAP_SIZE_H: 1200,

  MSG_TYPES: {
    JOIN_GAME: 1,
    UPDATE: 2,
    INPUT: 3,
    GAME_OVER: 4,
    GET_DELAY: 5
  },

})