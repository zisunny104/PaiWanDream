const xss = require("xss");
const Constants = require("../../shared/constants");
const Utils = require("../../shared/utils");
const Player = require("../objects/player");
const Card = require("../objects/card");
const Prop = require("../objects/prop");

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.props = [];
    this.cards = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    this.createPropTime = 0;
    this.createCardTime = 0;
    setInterval(this.update.bind(this), 1000 / 60);
  }

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

    const card_pos_id = [0, 1, 2, 3,
      4, 5, 6,
      7, 8,
      9, 10,
      11, 12,
      13];
    const card_pos_x = [
      23, 5, 10,
      312, 270,
      597, 710,
      876,
      1140,
      1394,
      1648, 1650,
      325, 1000,
    ];
    const card_pos_y = [
      5, 416, 830,
      45, 710,
      3, 355,
      30,
      70,
      169,
      20, 395,
      412, 390,
    ];

    //TODO:卡片類型變換
    this.createCardTime -= dt;
    this.cards = this.cards.filter(item => !item.isOver)

    if (this.createCardTime <= 0) {
      this.createCardTime = Constants.PROP.CREATE_TIME;
      card_pos_id.forEach(pid => {
        if (pid < 12) {
          this.cards.push(new Card(card_pos_x[pid], card_pos_y[pid],
            "能力",
            "多樣性耕種",
            "puljakarakaravan",
            "一塊良田除主要作物外，四周會再種上豆類、根莖等其他作物，讓部落一年四季都有糧食，也不容易因作物欠收而鬧飢荒。而在每個家屋旁也常設有花園，裡面就種植了藥材、食材及花材等植物，可以說是多樣化的最好體現。此外植物種子保存極為重要，包括一些不常種或不好吃的作物種子。在族人觀念裡，所有作物都有它的用處，會在不同的時間點展現。",
            "能力-多樣性耕種"));
        } else {
          this.cards.push(new Card(card_pos_x[pid], card_pos_y[pid],
            "危機",
            "靈魂馘取",
            "maqinacap",
            "獵首是一個嚴謹的的試煉制度，對一位男人而言是體能與膽識的最大考驗，對部落來說，為的則是去奪取異族靈魂來加入自己的祖靈，壯大部落的守護能量。獵首一般會在農閒時期單獨或結伴進行。此外為了鞏固部落領域，也會透過獵首來嚇阻侵犯的敵人，透過尚武精神來證明部落的強大，以他們的靈魂換取部落間的和平。",
            "危機-靈魂馘取"));
        }
      });
    }

    //碰撞檢測
    this.collisionsCard(Object.values(this.players), this.cards);
    this.collisionsProp(Object.values(this.players), this.props);

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

  collisionsCard(players, cards) {
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < players.length; j++) {
        let card = cards[i];
        let player = players[j];

        if (player.distanceTo(card) <= Constants.PLAYER.RADUIS + card.h) {
          card.add(player);
          break;
        }
      }
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

  createUpdate(player) {
    const otherPlayer = Object.values(this.players).filter(
      p => p !== player
    )

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: otherPlayer,
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
    const x = 1700 + (Utils.getRandom(-10, 10));
    const y = 930 + (Utils.getRandom(-30, 10));
    this.players[socket.id] = new Player({
      id: socket.id,
      username,
      x, y,
      r: Constants.PLAYER.RADUIS
    })
  }

  disconnect(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
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
      }
    }
  }
}

module.exports = Game;