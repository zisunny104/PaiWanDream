import { connect, play, getDelay } from './networking';
import { $, setCookie, getCookie, getRandom, sleep } from './util';
import { downloadAssets } from './asset';

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
const bead = document.querySelector('#bead-img');
const family_img = document.querySelector('#family-img');
const button = document.querySelector('#bead-button');

const family_list = ["太陽種子", "太陽枝葉", "大地種子", "大地枝葉"];

var username = "匿名玩家";
var family = "預設氏族";

const HIDDEN = "hidden";

var debug = true;

Promise.all([
  connect(gameOver),
  downloadAssets()
]).then(() => {

  if (debug) {
    //alert('Debug');
    document.querySelector("body").style.overflow = HIDDEN;
    play("debug");
    $('#cnv').classList.remove(HIDDEN);
    $('.ranking').classList.remove(HIDDEN);
    $('.delay').classList.remove(HIDDEN);

    join.classList.add(HIDDEN);
    game_control.classList.add(HIDDEN);
    footer.classList.add(HIDDEN);

    startRendering();
    startCapturingInput();

  } else {
    //$('.connect').classList.add('hidden')
    //$('.play').classList.remove('hidden');
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


      setUserTop();//設定遊玩頁面上方玩家資訊
      join.classList.add(HIDDEN);//關閉加入畫面
      game_control.classList.remove(HIDDEN);//開啟遊戲控制畫面
      footer.classList.add(HIDDEN);//關閉底部

      $('#cnv').classList.remove(HIDDEN);
      $('.ranking').classList.remove(HIDDEN);
      $('.delay').classList.remove(HIDDEN);


      startRendering();
      startCapturingInput();
    }
  }


  getDelay($('.delay'))
}).catch(console.error)

function setUserTop() {
  const userhead_top = document.querySelector('#userhead-top');
  const username_top = document.querySelector('#username-top');
  userhead_top.src = "/assets/img/heads/" + getCookie('family') + "_" + getCookie('head-side') + ".svg";
  username_top.innerHTML = getCookie('username');
}

function gameOver() {
  stopRendering();
  stopCapturingInput();
  join.classList.remove(HIDDEN);
  footer.classList.remove(HIDDEN);

  $('.ranking').classList.add('hidden')
  $('.delay').classList.add('hidden')
  alert('重新加入遊戲(尚未更改完成)。');
}

function randBead() {
  bead.src = "/assets/img/beads/琉璃珠-" + getRandom(1, 5) + ".png";
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
  family = family_list[getRandom(0, 3)];
  setCookie('family', family);
  family_img.src = "/assets/img/cards/氏族-" + family + ".png";
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
    setCookie('head-side', "左");
  }
  head_r_button.onclick = () => {
    head_l_button.classList.add(HIDDEN);
    head_r_button.disabled = "disabled";
    head_switch.classList.add(HIDDEN);
    setCookie('head-side', "右");
  }
  /*document.querySelector('#step-fami').scrollIntoView({
    behavior: 'smooth'
  });
  username_input.focus();*/
}

function showCardInfo(card) {
  const card_img = document.querySelector('#card-img');
  const card_name = document.querySelector('#card-name');
  const raw_name = document.querySelector('#raw-name');
  const description = document.querySelector('#description');

  card_img.src = "assets/img/cards/" + card.file_name + ".png";
  card_name = card.card.card_name;
  raw_name = card.raw_name;
  description = card.description;
}
