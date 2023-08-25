const xss = require("xss");
const Constants = require("../../shared/constants");
const Player = require("../objects/player");
const Prop = require("../objects/prop");
const Card = require("../objects/card");

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.props = [];
    this.cards = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    this.createPropTime = 0;
    this.createCardTime = 0;
    setInterval(this.update.bind(this), 1000 / 60);
  }
  c
  update() {
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    this.createPropTime -= dt;
    this.props = this.props.filter(item => !item.isOver)
    if (this.createPropTime <= 0 && this.props.length < 10) {
      this.createPropTime = Constants.PROP.CREATE_TIME;
      this.props.push(new Prop('speed'));
    }

    //TODO:卡片類型變換
    this.createCardTime -= dt;
    this.cards = this.cards.filter(item => !item.isOver)
    if (this.createCardTime <= 0 && this.cards.length < 10) {
      this.createCardTime = Constants.PROP.CREATE_TIME;
      this.cards.push(new Card("能力", "多樣性耕種", "puljakarakaravan", "一塊良田除主要作物外，四周會再種上豆類、根莖等其他作物，讓部落一年四季都有糧食，也不容易因作物欠收而鬧飢荒。而在每個家屋旁也常設有花園，裡面就種植了藥材、食材及花材等植物，可以說是多樣化的最好體現。此外植物種子保存極為重要，包括一些不常種或不好吃的作物種子。在族人觀念裡，所有作物都有它的用處，會在不同的時間點展現。",
        "能力-多樣性耕種"));
    }

    this.bullets = this.bullets.filter(item => !item.isOver)
    this.bullets.map(bullet => {
      bullet.update(dt);
    })

    Object.keys(this.players).map(playerID => {
      const player = this.players[playerID]
      const bullet = player.update(dt)
      if (bullet) {
        this.bullets.push(bullet);
      }
    })

    this.collisionsBullet(Object.values(this.players), this.bullets);
    this.collisionsProp(Object.values(this.players), this.props);
    this.collisionsCard(Object.values(this.players), this.cards)

    Object.keys(this.sockets).map(playerID => {
      const socket = this.sockets[playerID]
      const player = this.players[playerID]
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER)
        this.disconnect(socket);
      }
    })

    if (this.shouldSendUpdate) {
      Object.keys(this.sockets).map(playerID => {
        const socket = this.sockets[playerID]
        const player = this.players[playerID]
        socket.emit(
          Constants.MSG_TYPES.UPDATE,
          this.createUpdate(player)
        )
      })
    } else {
      this.shouldSendUpdate = true;
    }
  }

  collisionsProp(players, props) {
    for (let i = 0; i < props.length; i++) {
      for (let j = 0; j < players.length; j++) {
        let prop = props[i];
        let player = players[j];

        if (player.distanceTo(prop) <= Constants.PLAYER.RADUIS + Constants.PROP.RADUIS) {
          prop.isOver = true;
          player.pushBuff(prop);
          break;
        }
      }
    }
  }

  collisionsCard(players, cards) {
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < players.length; j++) {
        let card = cards[i];
        let player = players[j];

        if (player.distanceTo(cards) <= Constants.PLAYER.RADUIS + Constants.PROP.RADUIS * 6) {
          //cards.isOver = true;
          player.catchCard(cards);
          break;
        }
      }
    }
  }

  collisionsBullet(players, bullets) {
    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < players.length; j++) {
        let bullet = bullets[i];
        let player = players[j];

        if (bullet.parentID !== player.id
          && player.distanceTo(bullet) <= Constants.PLAYER.RADUIS + Constants.BULLET.RADUIS
        ) {
          bullet.isOver = true;
          player.takeBulletDamage();
          if (player.hp <= 0) {
            this.players[bullet.parentID].score++;
          }
          break;
        }
      }
    }
  }

  createUpdate(player) {
    const otherPlayer = Object.values(this.players).filter(
      p => p !== player
    )

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: otherPlayer,
      bullets: this.bullets.map(bullet => bullet.serializeForUpdate()),
      leaderboard: this.getLeaderboard(),
      props: this.props.map(prop => prop.serializeForUpdate()),
      cards: this.cards.map(card => card.serializeForUpdate())
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => ({ username: xss(item.username), score: item.score }))
  }

  joinGame(socket, username) {
    this.sockets[socket.id] = socket;

    const x = 1700;
    const y = 930;
    this.players[socket.id] = new Player({
      id: socket.id,
      username,
      x, y,
      r: Constants.PLAYER.RADUIS
    })
  }

  disconnect(socket) {
    delete this.sockets[socket.id]
    delete this.players[socket.id]
  }

  handleInput(socket, item) {
    const player = this.players[socket.id];
    if (player) {
      let data = item.action.split('-');
      let type = data[0];
      let value = data[1];
      switch (type) {
        case 'move':
          player.move[value] = typeof item.data === 'boolean'
            ? item.data ? 1 : -1
            : 0
          break;
        case 'dir':
          player.fireMouseDir = item.data;
          break;
        case 'bullet':
          player.fire = item.data;
          break;
        //TODO:del
        case 'card':
          console.log(item.data);
          //player.card_list.push(item.data);
          break;
      }
    }
  }
}

module.exports = Game;