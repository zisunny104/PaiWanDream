import { emitControl } from "./networking";

const keys = document.querySelectorAll("[data-key]");

keys.forEach((key) => {
  key.addEventListener("click", () => {
    key.classList.add("pressed");
    var d = true;
    if (key.id == "move-left" || key.id == "move-top") {
      d = false;
    }
    emitControl({
      action: key.id,
      data: d,
    })
    setTimeout(() => {
      key.classList.remove("pressed");
      emitControl({
        action: key.id,
        data: 0
      })
    }, 50);
  });
});

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    // Click the up arrow button
    document.querySelector("[data-key='ArrowUp']").click();

  } else if (e.key === "ArrowDown") {
    // Click the down arrow button
    document.querySelector("[data-key='ArrowDown']").click();

  } else if (e.key === "ArrowLeft") {
    // Click the left arrow button
    document.querySelector("[data-key='ArrowLeft']").click();

  } else if (e.key === "ArrowRight") {
    // Click the right arrow button
    document.querySelector("[data-key='ArrowRight']").click();

  }
});

function onKeydown(ev) {
  let code = ev.keyCode;
  switch (code) {
    case 65:
      emitControl({
        action: 'move-left',
        data: false
      })
      break;
    case 68:
      emitControl({
        action: 'move-right',
        data: true
      })
      break;
    case 87:
      emitControl({
        action: 'move-top',
        data: false
      })
      break;
    case 83:
      emitControl({
        action: 'move-bottom',
        data: true
      })
      break;
  }
}

function onKeyup(ev) {
  let code = ev.keyCode;
  switch (code) {
    case 65:
      emitControl({
        action: 'move-left',
        data: 0
      })
      break;
    case 68:
      emitControl({
        action: 'move-right',
        data: 0
      })
      break;
    case 87:
      emitControl({
        action: 'move-top',
        data: 0
      })
      break;
    case 83:
      emitControl({
        action: 'move-bottom',
        data: 0
      })
      break;
  }
}

export function startCapturingInput() {
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('keyup', onKeyup);
}

export function stopCapturingInput() {
  window.removeEventListener('keydown', onKeydown);
  window.removeEventListener('keyup', onKeyup);
}