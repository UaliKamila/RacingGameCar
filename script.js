const url = require('url').format({	 //подключаем пакет url
	protocol: 'file',
	slashes: true,
	pathname: require('path').join(__dirname, 'index.html') //путь к нашей папке
});

const {app, BrowserWindow} = require('electron');

let win; //состояние проекта

function createWindow() { //окно приложения
	win = new BrowserWindow({ //берем из библиотеки электрон
		width: 500,
		height: 850
	});

	win.loadURL(url); //что мы должны показать, т.е наш index файл

	win.on('closed', function(){ //при закрытии данных не будет
		win = null;
	});
}

app.on('ready', createWindow); //при запуске открывается окно
app.on('window-all-closed', function(){
	app.quit(); //полностью закроется
});