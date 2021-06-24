const score = document.querySelector('.score'),
	start = document.querySelector('.start'),
	gameArea = document.querySelector('.gameArea'),
	car = document.createElement('div');

car.classList.add('car');

start.addEventListener('click', startGame); //при нажатии мышкой скрывает элемент
document.addEventListener('keydown', startRun); //при нажатии кнопки
document.addEventListener('keyup', stopRun); //при отпускании клаваиши

const keys = { //название клавиш для управления
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false
};
Object.preventExtensions(keys);

const setting = { //первоначальные данные, запущена игра или нет
	start: false, 
	score: 0,
	speed: 3,
	traffic: 3 //плотность трафика, сложность игры
};

function getQuantityElements(heightElement) {//принимает параметр количество элементов
	return document.documentElement.clientHeight / heightElement + 1; //высота стр / высота эл 

} 

function startGame() {
	start.classList.add('hide');
	gameArea.innerHTML = ''; //перед запуском игры очищаем арену
	
	for (let i = 0; i < getQuantityElements(100); i++) { //линии в середине дороги, c высотой 100px
		const line = document.createElement('div');
		line.classList.add('line');
		line.style.top = (i * 100) + 'px'; //100 раcстояние между линиями 
		line.y = i * 100; //движение линии
		gameArea.appendChild(line); //расположение линии
	}

	for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {  //добавление друг машин, растояние машин зависит от трафика
		const enemy = document.createElement('div');
		enemy.classList.add('enemy');
		enemy.y = -100 * setting.traffic * (i + 1); // 100высота машины, i расстояние между машинами
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'; //располож лругих машина по горизонтали, 50чтобы от краев не уходило
		enemy.style.top = enemy.y + 'px'; //расст от верха игрового простр
		enemy.style.background = 'transparent url("./image/enemy3.png") center / cover no-repeat'; //цвета других машин
		gameArea.appendChild(enemy); //распологаем в игровом простр
	}
	setting.score = 0; 
	setting.start = true;
	gameArea.appendChild(car);
	car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2; 
	car.style.top = 'auto';
	car.style.bottom = '10px'; //при перезапуске игры машина спускается вниз
	setting.x = car.offsetLeft; //offsetLeft=125px, берется от края блока родителя до самого элемента(машины) 
	setting.y = car.offsetTop; //offsetTop берется от верхней части блока до машины
	requestAnimationFrame(playGame); 
	//requestAnimationFrame просить браузера запланировать перерисовку на следующем кадре анимации
}

function playGame(){
	if (setting.start === true){
		setting.score += setting.speed; //при запуске игр счет увеличив в зависим от скорости
		score.innerHTML = 'Ваш счет:<br>' + setting.score; //выводим текст со счетом
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
	}
}

function startRun(event) {
	event.preventDefault(); //отменяет все стандартные поведения в браузере
	keys[event.key] = true;
}

function stopRun() {
	event.preventDefault();
	keys[event.key] = false;
}

function moveRoad() {
	let lines = document.querySelectorAll('.line');
	lines.forEach(function(line){ //forEach метод перебора, line-элемент 
		line.y += setting.speed; //3px
		line.style.top = line.y + 'px';

		if (line.y >= document.documentElement.clientHeight) { //clientHeight высота стр
			line.y = -100; //поднимам линию верх когда она будет скрыватся вниз
		}
	}); 
}

function moveEnemy() { //получит все машины в дороге
	let enemy = document.querySelectorAll('.enemy');
	
	enemy.forEach(function(item){
		let carRect = car.getBoundingClientRect(); //получает прам машины
		let enemyRect = item.getBoundingClientRect(); //получает прам других машин
		
		if (carRect.top <= enemyRect.bottom && //когда наша машина приближается к бамперу другой машины
			carRect.right >= enemyRect.left && //если наехали с правой стороны другой машины
			carRect.left <= enemyRect.right && //если наехали с левой стороны другой машины
			carRect.bottom >= enemyRect.top) { //если наехали спереди другой машины
			setting.start = false; //останавливается при столкновении
			console.warn('ДТП'); 
			start.classList.remove('hide'); //скрыли кнопку во время клика
			score.style.top = score.offsetHeight; //
		}

		item.y += setting.speed / 2;
		item.style.top = item.y + 'px';
	
		if (item.y >= document.documentElement.clientHeight) { //чтобы машины не закаончивались на экране
		item.y = -100 * setting.traffic;
		item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'; //др машины выходили рандомна сверху
		}
	});
}

