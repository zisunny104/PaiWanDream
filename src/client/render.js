import { CARD, PLAYER, MAP_SIZE_H, MAP_SIZE_W } from '../shared/constants'
import { getCurrentState } from './state';
import { setCookie, getCookie, getRandom, sleep } from '../shared/utils';

const cnv = document.querySelector('#cnv')
const ctx = cnv.getContext('2d')

function setCanvasSize() {
  cnv.width = MAP_SIZE_W;
  cnv.height = MAP_SIZE_H;
  cnv.classList.add("sample");
}

setCanvasSize();

window.addEventListener('resize', setCanvasSize)

function render() {
  const { me, others, cards } = getCurrentState();
  if (!me) {
    return;
  }

  clearCanvas();//確保畫布背景為空
  cards.map(renderCard.bind(null, me));
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
}

function clearCanvas() {

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  ctx.restore();
}

function renderCard(me, card) {
  const { x, y, w, h, file_name } = card;
  const img = new Image();
  img.src = "/assets/img/cards/" + file_name + ".png";
  ctx.save();
  ctx.drawImage(
    img,
    x, y,
    w, h
  )
  ctx.restore();
}

function renderPlayer(me, player) {
  const { x, y, username, cards } = player;
  if (username == "debug") {
    return;
  }

  const img = new Image();
  img.src = "/assets/img/body/" + getCookie('family') + "_" + getCookie('head-side') + ".svg";
  ctx.save();
  ctx.translate(x, y);
  ctx.drawImage(
    img,
    - PLAYER.RADUIS,
    - PLAYER.RADUIS,
    PLAYER.RADUIS * 2,
    PLAYER.RADUIS * 4
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
  ctx.font = "30px Arial"
  ctx.fillText(player.username, x, y - PLAYER.RADUIS - 16)

  /*
  player.cards.map(card => {
    const img = new Image();
    img.src = "/assets/img/cards/" + card.file_name + ".png";
    var w = CARD.SIZE_W;
    var h = CARD.SIZE_H;
    if (card.type == "危機") {
      w = CARD.SIZE_B_W;
      h = CARD.SIZE_B_H;
    }
    ctx.drawImage(
      img,
      x - PLAYER.RADUIS + i * 22,
      y + PLAYER.RADUIS + 16,
      w / 10, h / 10
    );
  });*/
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
  document.querySelector('.ranking table tbody').innerHTML = str;
}

export function updateStandby() {
  const { others } = getCurrentState();
  var dom = document.querySelector('#standby');
  //檢測無人狀態顯示待機畫面
  if (others.length < 1) {
    dom.classList.remove("hidden");
  } else {
    dom.classList.add("hidden");
  }
}