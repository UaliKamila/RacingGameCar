const MAX_ENEMY = 7;
const HEIGHT_ELEM = 100; //100px 

const score = document.querySelector('.score'),
	start = document.querySelector('.start'),
	gameArea = document.querySelector('.gameArea'),
	car = document.createElement('div'), //элемент получаем не со стр html, а создадим сами
	btns = document.querySelectorAll('.btn');
	
const music = new Audio('audio.mp3');


car.classList.add('car');

const keys = { //название клавиш для управления
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false
};

const setting = { //первоначальные данные, запущена игра или нет
	start: false, 
	score: 0,
	speed: 3,
	traffic: 3 //плотность между машинами
};

let startSpeed = 0;

const changeLevel = (lvl) => {
	switch(lvl) {
		case '1':
			setting.traffic = 4;
			setting.speed = 3;
			break;
		case '2':
			setting.traffic = 3;
			setting.speed = 6;
			break;
		case '3':
			setting.traffic = 3;
			setting.speed = 8;
			break;
	}
	startSpeed = setting.speed;
}

function getQuantityElements(heightElement) {//принимает параметр количество элементов
	return (gameArea.offsetHeight / heightElement) + 1; //высота игрового блока / высота эл 
} 

const getRandomEnemy = (max) => Math.floor((Math.random() * max) + 1); //случайные машины

function startGame(event) {
	const target = event.target; //по клике работает
	if (!target.classList.contains('btn')) return; //есликликаем по кнопкам игра начинается, если мимо кнопок то return(остановлив функ и выходит)
	music.play();
	const levelGame = target.dataset.levelGame;
	changeLevel(levelGame)
	btns.forEach(btn => btn.disabled = true)  //блокируются кнопки при запуске игры
	gameArea.style.minHeight = Math.floor((document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM) * HEIGHT_ELEM; //Н: 999/100=99,9. окр 9*100=900
	start.classList.add('hide');
	gameArea.innerHTML = ''; //перед запуском игры очищаем арену
	
	for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) { //линии в середине дороги, c высотой 100px
		const line = document.createElement('div'); //создаем div line
		line.classList.add('line'); //добавим стили с css
		line.style.top = (i * HEIGHT_ELEM) + 'px'; //100 раcстояние между линиями 
		line.style.height = (HEIGHT_ELEM / 2) + 'px'; //высота линий берется от высоты которую указали
		line.y = i * HEIGHT_ELEM; //движение линии
		gameArea.append(line); //расположение линии в gameArea
	}

	for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {  //добавление друг машин, растояние машин зависит от трафика
		const enemy = document.createElement('div');
		enemy.classList.add('enemy');
		enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1); //движение машин, 100высота машины, i расстояние между машинами
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'; //располож лругих машина по горизонтали, 50чтобы от краев не уходило
		enemy.style.top = enemy.y + 'px'; //расст от верха игрового простран 
		enemy.style.background = `
		transparent url(image/enemy${getRandomEnemy(MAX_ENEMY)}.png) center / contain no-repeat`; //другие машины с папки
		gameArea.append(enemy); //распологаем в игровом простр
	}
	setting.score = 0; 
	setting.start = true;
	gameArea.append(car); //в gameArea создается div car
	car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2; 
	car.style.top = 'auto';
	car.style.bottom = '10px'; //при перезапуске игры машина спускается вниз
	setting.x = car.offsetLeft; //offsetLeft=125px, берется от края блока родителя до самого элемента(машины) 
	setting.y = car.offsetTop; //offsetTop берется от верхней части блока до машины
	requestAnimationFrame(playGame); 
	//requestAnimationFrame просить браузера запланировать перерисовку на следующем кадре анимации
}

function playGame(){
	if (setting.start){
		setting.score += setting.speed; //при запуске игры счет увеличив в зависим от скорости
		score.innerHTML = 'Your Score: ' + setting.score; //выводим текст со счетом
		setting.speed = startSpeed + Math.floor(setting.score / 5000); 
		
		moveRoad(); //движение дороги
		moveEnemy(); //движение других машин
		if (keys.ArrowLeft && setting.x > 0) { 
			//ArrowLeft если левая кнопка зажата будем двигать по оси x на лево, x > 0 чтобы не выходил за границы поля
			setting.x -= setting.speed;
		}	 
		
		if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) { //(ширина дороги - ширина машины), упирается в правый край
			setting.x += setting.speed;
		}

		if (keys.ArrowUp && setting.y > 0) { //по оси -y вверх, y > 0 когда упирается верх края
			setting.y -= setting.speed;
		}

		if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) { //упирается в нижний край
			setting.y += setting.speed;
		}

		car.style.left = setting.x + 'px'; 
		car.style.top = setting.y + 'px'; 

		requestAnimationFrame(playGame); //сама себя перезапускает, чтобы игра не останавливалась и было плавно 
	} else {
		music.pause()
		btns.forEach(btn => btn.disabled = false) //при отключении игры кнопки появляются 
	}
}

function startRun(event) {
	if (keys.hasOwnProperty(event.key)) {
		event.preventDefault(); //отменяет все стандартные поведения в браузере
		keys[event.key] = true; // []получили строку(та кнопка котрая была нажата) из объекта keys
	}
}

function stopRun() {
	if (keys.hasOwnProperty(event.key)) {
		event.preventDefault();
		keys[event.key] = false;
	}
}

function moveRoad() {
	let lines = document.querySelectorAll('.line'); //получием все линии с класом line
	lines.forEach(function(line){ //forEach метод перебора, принимает функцию которая будет запускатся столько раз, сколько у нас элементов
		line.y += setting.speed; //3px
		line.style.top = line.y + 'px';

		if (line.y >= gameArea.offsetHeight) { //высота дороги берется от игрового блока
			line.y = -HEIGHT_ELEM; //поднимам линию верх когда она будет скрыватся вниз
		}
	}); 
}

function moveEnemy() { //получит все машины в дороге
	let enemy = document.querySelectorAll('.enemy');
	
	enemy.forEach(function(item){
		let carRect = car.getBoundingClientRect(); //возвращает размеры и позиции элмента в виде объекта, получ парм машины
		let enemyRect = item.getBoundingClientRect(); //получает парам других машин
		
		if (carRect.top <= enemyRect.bottom && //когда наша машина приближается к бамперу другой машины
			carRect.right >= enemyRect.left && //если наехали с правой стороны другой машины
			carRect.left <= enemyRect.right && //если наехали с левой стороны другой машины
			carRect.bottom >= enemyRect.top) { //если наехали спереди другой машины
			setting.start = false; //останавливается при столкновении
			console.warn('ДТП'); 
			start.classList.remove('hide'); //появляется кнопка кликни
		}

		item.y += setting.speed / 2;
		item.style.top = item.y + 'px';	
		if (item.y >= gameArea.offsetHeight) { //чтобы машины не закаончивались на экране
			item.y = -HEIGHT_ELEM * setting.traffic; //поднимам машины вверх когда они будут скрыватся вниз
			item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'; //др машины выходили рандомна сверху
		}
	});
} 

start.addEventListener('click', startGame); //при нажатии мышкой скрывает элемент, обработчик событии
document.addEventListener('keydown', startRun); //при нажатии кнопки
document.addEventListener('keyup', stopRun); //при отпускании клаваиши
