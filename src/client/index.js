import { connect, play, getDelay, setHeadSide, setFamily } from './networking';
import { setCookie, getCookie, getRandom, sleep } from '../shared/utils';
import { downloadAssets } from './asset';
import { getCurrentState } from './state';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import './css/main.css';
import './css/style.css';

import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';

const username_input = document.querySelector('#username-input');
const play_button = document.querySelector('#play-button');

const join = document.querySelector("#join");
const footer = document.querySelector('#footer');
const game_canvas = document.querySelector('#game-canvas');
const game_control = document.querySelector('#game-control');
const step_head = document.querySelector('#step-head');
const head_switch = document.querySelector('#head-switch');
const head_l_button = document.querySelector('#head-l-button');
const head_r_button = document.querySelector('#head-r-button');
const head_l_img = document.querySelector('#head-l-img');
const head_r_img = document.querySelector('#head-r-img');
const bead = document.querySelector('#bead-img');
const family_img = document.querySelector('#family-img');
const button = document.querySelector('#bead-button');

const game_over = document.querySelector("#game-over");
const over_username = document.querySelector("#over-username");
const over_body = document.querySelector("#over-body");
const over_reconnect_button = document.querySelector('#over-reconnect-button');



const family_list = ["太陽種子", "太陽枝葉", "大地種子", "大地枝葉"];

var username = "匿名玩家";
var family = "大地枝葉";
var head_side = "左";

const HIDDEN = "hidden";

Promise.all([
  connect(gameOver),
  downloadAssets()
]).then(() => {
  randBead();//隨機琉璃珠

  username_input.focus();
  play_button.onclick = () => {
    username = username_input.value;
    username = username.replace(/\s*/g, '');
    family = getCookie('family');
    if (username === '') {
      alert('請輸入名稱!');
      return;
    }
    if (family === "預設氏族") {
      alert('請擲骰選擇氏族!');
      return;
    }
    setCookie('username', username);
    play(username);
    setFamily(family);
    setHeadSide(head_side);

    setUserTop();//設定遊玩頁面上方玩家資訊
    join.classList.add(HIDDEN);//關閉加入畫面
    game_control.classList.remove(HIDDEN);//開啟遊戲控制畫面
    footer.classList.add(HIDDEN);//關閉底部
    game_canvas.classList.remove(HIDDEN);//開啟遊戲畫面

    over_username.innerHTML = getCookie('username');
    over_body.src = "/assets/img/body/" + family + "_" + head_side + ".svg";

    startRendering();
    startCapturingInput();
  }
  getDelay(document.querySelector('.delay'));
}).catch(console.error)

function setUserTop() {
  const userhead_top = document.querySelector('#userhead-top');
  const username_top = document.querySelector('#username-top');
  userhead_top.src = "/assets/img/heads/" + family + "_" + head_side + ".svg";
  username_top.innerHTML = getCookie('username');
}

function onGameOverdo() {
  game_canvas.classList.add(HIDDEN);
  game_control.classList.add(HIDDEN);
  game_over.classList.remove(HIDDEN);
  over_reconnect_button.onclick = () => {
    window.location.reload();
  };
  footer.classList.remove(HIDDEN);
  document.querySelector('.ranking').classList.add('hidden');
  document.querySelector('.delay').classList.add('hidden');
}


function gameOver() {
  stopRendering();
  stopCapturingInput();
  onGameOverdo();
}

function randBead() {
  bead.src = "/assets/img/beads/琉璃珠-" + getRandom(1, 5) + ".png";
  family = family_list[getRandom(0, 3)];
  setCookie("family", family);
  family_img.src = "/assets/img/cards/氏族-" + family + ".svg";
  head_l_img.src = "/assets/img/heads/" + family + "_左.svg";
  head_r_img.src = "/assets/img/heads/" + family + "_右.svg";
}

button.onclick = function () {
  switchFamily();
};

async function throwDice() {
  bead.style.transform = `rotate(${Math.round(Math.random() * (360 - 0 + 1)) * 5}deg)`
}

async function switchFamily() {
  throwDice();
  await sleep(900);
  bead.classList.add(HIDDEN);
  family_img.classList.remove(HIDDEN);
  button.textContent = family;
  button.disabled = "disabled";
  await sleep(900);
  family_img.classList.add(HIDDEN);
  step_head.classList.remove(HIDDEN);
  head_l_button.onclick = () => {
    head_r_button.classList.add(HIDDEN);
    head_l_button.disabled = "disabled";
    head_switch.classList.add(HIDDEN);
    head_side = "左";
    setCookie('head_side', head_side);
  }
  head_r_button.onclick = () => {
    head_l_button.classList.add(HIDDEN);
    head_r_button.disabled = "disabled";
    head_switch.classList.add(HIDDEN);
    head_side = "右";
    setCookie('head_side', head_side);
  }
  /*document.querySelector('#step-fami').scrollIntoView({
    behavior: 'smooth'
  });
  username_input.focus();*/
}

function getCardByFileName(file_name) {
  var card = null;
  card_list.map(item => {
    console.log(item.file_name)
    if (item.file_name == file_name) {
      card = new Card(0, 0,
        item.type,
        item.card_name,
        item.raw_name,
        item.description,
        item.file_name);
    }
  });
  return card;
}
