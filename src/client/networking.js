import io from 'socket.io-client'
import Constants from '../shared/constants';

import { processGameUpdate } from './state'

const socketProtocal = (window.location.protocol.includes('https') ? 'wss' : 'ws');
const socket = io(`${socketProtocal}://${window.location.host}`, { reconnection: false })

const disconnect_modal = document.querySelector('#disconnect-modal');
const reconnect_button = document.querySelector('#reconnect-button');

const connectPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connect to server!')
    resolve();
  })
})

export const connect = onGameOver => {
  connectPromise.then(() => {
    socket.on(Constants.MSG_TYPES.UPDATE, processGameUpdate);
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    socket.on("disconnect", () => {
      disconnect_modal.classList.add('is-visible');
      console.log('Disconnected from server.');
      reconnect_button.onclick = () => {
        window.location.reload();
      };
      const lastToDisconnect = io.of("/").sockets.size === 0;
      if (lastToDisconnect) {
        gc();
      }
    });
  })
}

export const play = username => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
}

export const setFamily = family => {
  if (family === "") {
    family = "大地種子";
  }
  socket.emit(Constants.MSG_TYPES.SET_FAMILY, family);
}

export const setHeadSide = head_side => {
  if (head_side === "") {
    head_side = "左";
  }
  socket.emit(Constants.MSG_TYPES.SET_HEAD_SIDE, head_side);
}

export const emitControl = data => {
  socket.emit(Constants.MSG_TYPES.INPUT, data);
}

export const getDelay = dom => {
  let prev = 0;
  setInterval(() => {
    prev = new Date().getTime()
    socket.emit(Constants.MSG_TYPES.GET_DELAY);
  }, 1000);
  socket.on(Constants.MSG_TYPES.GET_DELAY, () => {
    let now = new Date().getTime();
    dom.innerHTML = (now - prev) / 2 + 'ms';
  })
}