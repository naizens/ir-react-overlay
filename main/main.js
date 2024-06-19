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
		width: 220,
		height: 100,
		autoSize: true, // Automatische Größenanpassung basierend auf dem Inhalt
		alwaysOnTop: true,
		transparent: true,
		frame: false,
		titleBarOverlay: "hidden",
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
	telemetryWindow.setAlwaysOnTop(true, "screen-saver");
	telemetryWindow.setVisibleOnAllWorkspaces(true);
	telemetryWindow.setFullScreenable(false);
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
		telemetryWindow.show(); // Sicherstellen, dass das Fenster angezeigt wird
		telemetryWindow.focus(); // Fokus auf das Fenster setzen
	}
});

ipcMain.on("unlock-telemetry-window", () => {
	if (telemetryWindow) {
		telemetryWindow.setIgnoreMouseEvents(false);
		telemetryWindow.show();
		telemetryWindow.focus();
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
