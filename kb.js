let kosti = [];
let walks = localStorage.getItem("walks");
let dice = [];
let chance = [];// масив шщанса
let randDice;  //рандомный куб для шанса
//[Начало] Создать игроков 
let countPlayers = +localStorage.getItem('countPlayers');
if (countPlayers == 0) {
  //Указать количество игроков
  let countPlayers = prompt('Количество игроков');
  //Создать обекты с игроками
  let objPlayers = {};
  for (i = 1; i <= countPlayers; i++) {
    //Добавить имя игрока
    let NamePromt = prompt('Игрок #' + i + 'Как вас величать ?');
    //Создать "количиство X" обектов с свойствами игроков
    objPlayers[`player${i}`] = createPlayers(i, NamePromt, 0, inGame = false, barell = false);
  };

  //Делает "строку" из обектов с игроками
  let jsonPlayersString = JSON.stringify(objPlayers);
  //Записывает строку в память 
  localStorage.setItem('players', jsonPlayersString);
  console.log(jsonPlayersString);
  //Количество всех игроков 
  localStorage.setItem('countPlayers', countPlayers);
  //Ход на даный момент
  localStorage.setItem(`walks`, 1);
  window.location.reload();

};
nameScorePlayers(param = 1); //выводит имя игрока и счет на данный момент
//бросить 
let brosit = document.querySelector('#brosit');
brosit.addEventListener('click', () => {
  for (let i = 0; i < 5; i++) {
    if (kosti[i].dataset.status != 2) {//проверяет есть ли сыграные кубы если есть ничего не записывает
    dice[i] = randomInteger(1, 6); //создается случайный масив 
    
    document.querySelector(`#kub${i + 1}`).innerHTML = `<img src='./images/${dice[i]}_dots.png'> ${dice[i]}`; //добавляем в кнопки хтмл значение масива
    kosti[i] = document.querySelector(`#kub${i + 1}`); //создаем масив с елементами dom 
 console.log(dice[i]);
  }
}
 
  console.log(kosti);
  nameScorePlayers(param = 1); //выводит имя игрока и счет на данный момент 
});

//Сохранить
let save = document.querySelector('#save');
save.addEventListener('click', () => {
  let setCube = []; //пустой масив для добавления выбраных кубиков
  //Наполняет масив выбраными кубиками
  for (let i = 0; i < 5; i++) {
    if (kosti[i].dataset.status == 1) {
      setCube.push(kosti[i].innerHTML);
    };
  };
  let score = arrayFilter(setCube); //Подсчитать очки
  if (score != 0){ //если набрал 0 очков ничего не делаем и кнопка не работает
  //Отвечает за score в памяти
  if (localStorage.getItem('score')) {
    let scoreInMemory = +localStorage.getItem('score'); //Очки в памяти
    let scoreResult = +scoreInMemory + +score; //Сложыть очки
    console.log(scoreResult, '//Сложыть очки');
    localStorage.setItem('score', scoreResult); //Записать сложеные очки в память
  } else {
    localStorage.setItem('score', score); //Записать очки если null
  }

  //меняет статус кубика с 1 на 2
  for (let i = 0; i < 5; i++) {
    kosti[i] = document.querySelector(`#kub${i+1}`);
    if (kosti[i].dataset.status == 1) {
      kosti[i].dataset.status = 2;
    };
    //Если все кости в статусе 2 перезагрузка страницы
    if (kosti.every(dice => dice.dataset.status == 2)){
      document.location.reload();
    }
    /* if (kosti[0].dataset.status == 2 && kosti[1].dataset.status == 2 &&
      kosti[2].dataset.status == 2 && kosti[3].dataset.status == 2 &&
      kosti[4].dataset.status == 2) {
      document.location.reload();
      
    }; */
    };
  };

  //Бочка
  let jsonObjPlayers = JSON.parse(localStorage.getItem('players')); //достать из памяти (players "JsonString") и сделать обектом
  let calcTotalScore = jsonObjPlayers[`player${localStorage.getItem('walks')}`].score + +localStorage.getItem('score'); //Посчитать общий счет
  //Залез на бочку
  if (calcTotalScore >= 880 && jsonObjPlayers[`player${localStorage.getItem('walks')}`].barell == false) {
    jsonObjPlayers[`player${localStorage.getItem('walks')}`].barell = true; //именить бочку "barell" на true
    localStorage.setItem('players', JSON.stringify(jsonObjPlayers)); //сделать json и перезаписать в память
    console.log('на бочке');
  };

  //Выграл или упал с бочки
  if (jsonObjPlayers[`player${localStorage.getItem('walks')}`].barell == true) {
    console.log('на бочке true');
  }
  console.log(calcTotalScore, 'Общий счет score и playerScore');
  
  nameScorePlayers(param = 1); //выводит имя игрока и счет на данный момент
});

//Закончить ход
let finish = document.querySelector('#finish')
finish.addEventListener('click', () => {
  //достать из памяти (players "JsonString") и сделать обектом
  let jsonObjPlayers = JSON.parse(localStorage.getItem('players'));
  score = +localStorage.getItem(`score`); //Получить очки из памяти счет
  walks = +localStorage.getItem('walks'); //Получить номер игрока

  //Если игрок не в игре
  if (inGame() == false) {
    //Если набронно 105 или больше изменить inGame на true
    if (localStorage.getItem('score') >= 1000) {
      alert("ты набрал 1000 сучка - это пэрэмога"); 
    }
    if (localStorage.getItem('score') >= 105) {
      //Изменить inGame на true у player[x]
      jsonObjPlayers[`player${localStorage.getItem('walks')}`].inGame = true;
      jsonObjPlayers[`player${localStorage.getItem('walks')}`].score = 105;
      //сделать json и перезаписать в память
      localStorage.setItem('players', JSON.stringify(jsonObjPlayers));
      localStorage.removeItem('score'); //Удалить времяный счет
      alert('Вошли в игру');
      nextPlayer(); //Поменять игрока walks = X  
      document.location.reload(); //перезагрузить страницу
    } else {
      alert('Не хватило очков для входа в игру!');
      localStorage.removeItem('score'); //Удалить времяный счет
      nextPlayer(); //Поменять игрока walks = X
      document.location.reload(); //перезагрузить страницу
    };
  }
  //Если игрок в игре
  else {
    //изменить счет игрока в обекте (player{x})
    jsonObjPlayers[`player${walks}`].score += score;
    //Сделать обект (JSON 'строкой') и записать в память
    let jsonStringPlayers = localStorage.setItem('players', JSON.stringify(jsonObjPlayers));
    console.log(jsonStringPlayers);
    localStorage.removeItem('score'); //Удалить времяный счет
    if (jsonObjPlayers[`player${walks}`].score >= 1000) {
      alert("ты набрал 1000 сучка - это пэрэмога");
    } else {
      nextPlayer(); //Поменять игрока walks = X
      document.location.reload(); //перезагрузить страницу
    }
  };

});

//Ничего не выпало
let next = document.querySelector("#next");
next.addEventListener('click', () => {
  localStorage.removeItem('score');
  nextPlayer();
  document.location.reload();
});

//изменить статус кубика при нажатие
for (let i = 0; i < 5; i++) {
  kosti[i] = document.querySelector(`#kub${i+1}`);
  kosti[i].addEventListener('click', () => {
    if (kosti[i].dataset.status == 0) {
      kosti[i].dataset.status = 1;
    } else if (kosti[i].dataset.status == 1) {
      kosti[i].dataset.status = 0;
    }
  });
};

//выводит имя и счет игрока
function nameScorePlayers(param){
  let jsonObjPlayers = JSON.parse(localStorage.getItem('players')); //достать из памяти (players "JsonString") и сделать обектом
  let name = document.querySelector('#countPlayer').innerHTML = jsonObjPlayers[`player${localStorage.getItem('walks')}`].name; //достать имя игрока
  let score = document.querySelector('#score').innerHTML = localStorage.getItem('score'); //достать счет
  if(param == 1){
    return name,score;
  };
};

//Насобирал игрок нужное количество очков или нет? (В игре или нет)
function inGame() {
  //Получить из памяти всех игроков в JSON формате
  let getPlayersFromMemoryInJson = localStorage.getItem('players');
  //спарсить всех игроков и получить всех игроков со свойствами в обект
  let getPlayersFromJson = JSON.parse(getPlayersFromMemoryInJson);

  //Вернуть "true" если в игре или "false" если не в игре 
  return getPlayersFromJson[`player${localStorage.getItem('walks')}`].inGame;
};

//возвращает объект с заполненными параметрами игроков
function createPlayers(id, name, score, inGame, barell) {
  return {
    id,
    name,
    score,
    inGame,
    barell,
  }
};

//Переключает игрока NEXT
function nextPlayer() {
  let walks = +localStorage.getItem('walks');
  if (walks == countPlayers) {
    localStorage.setItem('walks', 1);
  } else {
    walks += 1;
    localStorage.setItem('walks', walks);
  }
};

//рандом
function randomInteger(min, max) {
  //Cлучайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

//Счетчик очков
function arrayFilter(array) {
  //Количиство совпадений
  function kubFilter(arrayKub, num) {
    let arrayKubFilter = arrayKub.filter(a => a == num);
    return arrayKubFilter.length;//Функцыя возвращает  масив совпадений
  }


  for(i = 1; i < 7; i++){
    if (kubFilter(array, i) == 2 && dice[ i!= (1 && 5)])  {//если значение массива повторяется 2 раза и не равняется 1 и 5 
      alert('hiyh');
    }
  }

  let result = 0;

  //проверка12345
  if (array.some(bone => bone == 1) &&
    array.some(bone => bone == 2) &&
    array.some(bone => bone == 3) &&
    array.some(bone => bone == 4) &&
    array.some(bone => bone == 5)) {
      alert("150");
    result += 150;
  }
 else if (array.some(bone => bone == 6) &&
    array.some(bone => bone == 2) &&
    array.some(bone => bone == 3) &&
    array.some(bone => bone == 4) &&
    array.some(bone => bone == 5)) {
      alert("250");
    result += 250;
  }
  else if (kubFilter(array, 5) == 1) {
    alert("5");
    result += 5;
    if (kubFilter(array, 1) == 1) {
      alert("10");
      result += 10;
    }
  }
 

  
  
for (i=1; i<=6; i++){
      if (kubFilter(array, i==1) == 5) { 
     alert("1000");
    result += 1000;
  }else
       if (kubFilter(array, i) == 5) { 
     alert(`${i}00`);
    result += i*100;
     }
    
    if (kubFilter(array, i==1) == 4) { 
     alert("200");
    result += 200;
  }else
       if (kubFilter(array, i) == 4) { 
     alert(i*20);
    result += i*20;
     }
    
    if (kubFilter(array, i==1) == 3) { 
      alert("100");
     result += 100;
   }else
        if (kubFilter(array, i) == 3) { 
      alert(i*10);
     result += i*10;
      }
  }
  if (kubFilter(array, 1) == 2) {
    alert("20");
    result += 20;
  }
  if (kubFilter(array, 5) == 2) {
      alert("10");
      result += 10;
  }

  
//Код шанса
if(dice.some(bone => bone == 1) || dice.some(bone => bone == 5)) { 
  //если в масиве есть 1 или 5 шанс не работает! код дальше не выполняется
}else{
  for(i = 1;i < 7;i++){ //проверяем на количество совпадений значуний кубмка от 1 до 6
    {
      if(kubFilter(array,i) == 2){// если нашло  совпадения 
        alert(i);
        chance.push(i); //добавляем совпадкние в масив шанса
    };
    };
  };
};

  if(chance.length == 2 ){ //если в масиве шанс 2 значения то это и есть шанс
    alert('Шанс! Испытай удачу');
    randDice = randomInteger(1,6); //кидаем последний кубик что бы сыграл шанс 
    chance.push(randDice); //добавляем его в масив шанса
    alert(chance);
 
    for(i = 1;i < 7;i++){
      {
        if(kubFilter(chance,i) == 2){// если комбинация совпадает 
          alert(`Ура + ${i*10}`)

         result  += i*10; // добавляем очки в результат
         
      };
      };
    };
  }
  return result;
}
