import { CARD, PLAYER, BULLET, PROP, MAP_SIZE_H, MAP_SIZE_W } from '../shared/constants'
import { getAsset } from './asset';
import { getCurrentState } from './state';
import { $, setCookie, getCookie, getRandom, sleep } from './util';

const cnv = $('#cnv')
const ctx = cnv.getContext('2d')

function setCanvasSize() {
  cnv.width = 1920;
  cnv.height = 1200;
  //cnv.classList.remove("hidden");
  cnv.classList.add("sample");
}

setCanvasSize();

window.addEventListener('resize', setCanvasSize)

function render() {
  const { me, others, bullets, props, cards } = getCurrentState();
  if (!me) {
    return;
  }

  clearCanvas();//確保畫布背景為空

  //ctx.strokeStyle = 'black';
  //ctx.lineWidth = 1;
  //ctx.strokeRect(0, 0, MAP_SIZE_W, MAP_SIZE_H);

  bullets.map(renderBullet.bind(null, me));
  props.map(renderProp.bind(null, me));
  cards.map(renderCard.bind(null, me));

  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
}

function clearCanvas() {
  var context = ctx;
  var canvas = cnv;

  context.save();

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.restore();
}

function renderProp(me, prop) {
  const { x, y, type } = prop;
  //var file_name = "能力-多樣性耕種";
  //const img = new Image();
  //img.src = "/assets/img/cards/" + file_name + ".png";

  ctx.save();
  ctx.drawImage(
    getAsset(`${type}.svg`),
    //baseline_w + x - me.x,
    //baseline_h + y - me.y,
    //img,
    x, y,
    PROP.RADUIS * 5,
    PROP.RADUIS * 6
  )
  ctx.restore();
}

function renderCard(me, card) {
  const { x, y, type, file_name } = card;
  const img = new Image();
  img.src = "/assets/img/cards/" + file_name + ".png";

  ctx.save();
  ctx.drawImage(
    img,
    x, y,
    PROP.RADUIS * 6,
    PROP.RADUIS * 7
  )
  ctx.restore();
}

function debugCard(x, y) {
  const img = new Image();
  img.src = "/assets/img/cards/" + file_name + ".png";

  ctx.save();
  ctx.drawImage(
    img,
    x, y,
    CARD.SIZE_W,
    CARD.SIZE_H
  )
  ctx.restore();
}

function renderBullet(me, bullet) {
  const { x, y, rotate } = bullet;
  ctx.save();
  ctx.translate(x, y)
  ctx.rotate(Math.PI / 180 * rotate)
  ctx.drawImage(
    getAsset('bullet.svg'),
    -BULLET.RADUIS,
    -BULLET.RADUIS,
    BULLET.RADUIS * 2,
    BULLET.RADUIS * 2
  )
  ctx.restore();
}

function renderPlayer(me, player) {
  const { x, y } = player;

  const img = new Image();
  img.src = "/assets/img/heads/" + getCookie('family') + "_" + getCookie('head-side') + ".svg";
  ctx.save();
  ctx.translate(x, y);
  ctx.drawImage(
    img,
    - PLAYER.RADUIS,
    - PLAYER.RADUIS,
    PLAYER.RADUIS * 2,
    PLAYER.RADUIS * 2
  )
  ctx.restore();

  ctx.fillStyle = 'white'
  ctx.fillRect(
    x - PLAYER.RADUIS,
    y - PLAYER.RADUIS - 8,
    PLAYER.RADUIS * 2,
    4
  )

  ctx.fillStyle = 'orange'
  ctx.fillRect(
    x - PLAYER.RADUIS,
    y - PLAYER.RADUIS - 8,
    PLAYER.RADUIS * 2 * (player.hp / PLAYER.MAX_HP),
    4
  )

  ctx.fillStyle = 'white'
  ctx.textAlign = 'center';
  ctx.font = "20px"
  ctx.fillText(player.username, x, y - PLAYER.RADUIS - 16)

  ctx.fillText("(" + x + "--" + y + ")", x, y - PLAYER.RADUIS - 32)

  ctx.fillText(player.cards, x, y - PLAYER.RADUIS - 48)

  player.buffs.map((buff, i) => {
    ctx.drawImage(
      getAsset(`${buff.type}.svg`),
      x - PLAYER.RADUIS + i * 22,
      y + PLAYER.RADUIS + 16,
      20, 20
    )
  })
}

let renderInterval = null;
export function startRendering() {
  renderInterval = setInterval(render, 1000 / 60);
}

export function stopRendering() {
  ctx.clearRect(0, 0, cnv.width, cnv.height)
  clearInterval(renderInterval);
}

export function updateRanking(data) {
  let str = '';

  data.map((item, i) => {
    str += `
      <tr>
        <td>${i + 1}</td>
        <td>${item.username}</td>
        <td>${item.score}</td>
      <tr>
    `
  })

  $('.ranking table tbody').innerHTML = str;
}