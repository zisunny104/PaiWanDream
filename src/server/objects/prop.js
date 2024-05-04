const Constants = require('../../shared/constants')
const Item = require('./item')

class Prop extends Item {
  constructor(type) {
    const x = (Math.random() * .5 + .25) * Constants.MAP_SIZE_W;
    const y = (Math.random() * .5 + .25) * Constants.MAP_SIZE_H;
    super({
      x, y,
      w: Constants.PROP.RADUIS,
      h: Constants.PROP.RADUIS
    });

    this.isOver = false;
    // 什麼類型的buff
    this.type = type;
    // 持續10秒
    this.time = 10;
  }

  add(player) {
    switch (this.type) {
      case 'speed':
        player.speed += 500;
        break;
    }
  }

  remove(player) {
    switch (this.type) {
      case 'speed':
        player.speed -= 500;
        break;
    }
  }

  update(dt) {
    this.time -= dt;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      type: this.type,
      time: this.time
    }
  }
}

module.exports = Prop;