const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;
let telemetryWindow;

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			enableRemoteModule: false,
		},
	});

	mainWindow.loadURL("http://localhost:3000");

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

function createTelemetryWindow() {
	telemetryWindow = new BrowserWindow({
		width: 600,
		height: 400,
		autoSize: true, // Automatische Größenanpassung basierend auf dem Inhalt
		alwaysOnTop: true,
		transparent: true,
		frame: false,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			enableRemoteModule: false,
		},
	});

	telemetryWindow.loadURL("http://localhost:3000/telemetry");

	telemetryWindow.on("closed", () => {
		telemetryWindow = null;
	});
}

app.on("ready", () => {
	createMainWindow();
});

ipcMain.on("open-telemetry-window", () => {
	if (!telemetryWindow) {
		createTelemetryWindow();
	} else {
		telemetryWindow.focus();
	}
});

ipcMain.on("lock-telemetry-window", () => {
	if (telemetryWindow) {
		telemetryWindow.setIgnoreMouseEvents(true);
	}
});

ipcMain.on("unlock-telemetry-window", () => {
	if (telemetryWindow) {
		telemetryWindow.setIgnoreMouseEvents(false);
	}
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createMainWindow();
	}
});
