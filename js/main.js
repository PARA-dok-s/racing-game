'use strict';
const MAX_ENEMY = 7;
const HEIGHT_ELEM = 100;

const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div');

const music = document.createElement('embed');

music.src = 'audio.mp3';

music.classList.add('visually-hidden');

  
car.classList.add('car');

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3,
};

function getQuantityElements(heightElement) {
  return (gameArea.offsetHeight / heightElement) + 1;
}

const getRandomEnemy = (max) => Math.floor((Math.random() * max) + 1);


function startGame() {
  document.body.append(music);

  gameArea.style.minHeight = Math.floor((document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM) * HEIGHT_ELEM;


  start.classList.add('hide');
  gameArea.innerHTML = '';
  car.style.left = '125px';
  car.style.top = 'auto';
  car.style.bottom = '10px';

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * HEIGHT_ELEM) + 'px';
    line.style.height = (HEIGHT_ELEM / 2) + 'px';
    line.y = i * HEIGHT_ELEM;
    gameArea.append(line);
  }

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `
        transparent
        url(./image/enemy${getRandomEnemy(MAX_ENEMY)}.png)
        center / cover
        no-repeat`;
    gameArea.append(enemy);
  }
  setting.score = 0;
  setting.start = true;
  gameArea.append(car);
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {

  if (setting.start) {
    setting.score += setting.speed;
    score.innerHTML = 'SCORE<br>' + setting.score;
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }

    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }


    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';


    requestAnimationFrame(playGame);
  } else {
    music.remove();
  }
}

function startRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = true;
  }
}

function stopRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
  keys[event.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function (line) {
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if (line.y >= gameArea.offsetHeight) {
      line.y = -HEIGHT_ELEM;
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');

  enemy.forEach(function (item) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();
    
    if (carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top) {
        setting.start = false;
      console.warn('ДТП');
      start.classList.remove('hide');
      start.style.top = score.offsetHeight + 'px';
    }

    item.y += setting.speed / 2;
    item.style.top = item.y + "px";

    if (item.y >= gameArea.offsetHeight) {
      item.y = -HEIGHT_ELEM * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });

}




start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

