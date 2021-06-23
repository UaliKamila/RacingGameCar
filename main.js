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

const setting = { //первоначальные данные, запущена игра или нет
	start: false, 
	score: 0,
	speed: 3
};

function startGame() {
	start.classList.add('hide');
	setting.start = true;
	gameArea.appendChild(car);
	requestAnimationFrame(playGame); 
	//requestAnimationFrame просить браузера запланировать перерисовку на следующем кадре анимации
}

function playGame() {
	console.log('Play Game!');
	if (setting.start === true){
		requestAnimationFrame(playGame); //сама себя перезапускает, чтобы игра не останавливалась и было плавно 
	}
}

function startRun(event) {
	event.preventDefault(); //отменяет все тснадартные поведения в браузере
	keys[event.key] = true;
}

function stopRun() {
	event.preventDefault();
	keys[event.key] = false;

}