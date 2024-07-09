import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
	serve({ directory: "app" });
} else {
	app.setPath("userData", `${app.getPath("userData")} (development)`);
}

let port;

(async () => {
	await app.whenReady();

	var splashWindow = createWindow("splash", {
		width: 500,
		height: 300,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
		movable: false,
		focusable: false,
		resizable: false,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			webSecurity: true,
		},
	});

	const mainWindow = createWindow("main", {
		width: 800,
		height: 600,
		show: false,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			webSecurity: true,
			devTools: true,
		},
	});

	ipcMain.once("splash-done", async () => {
		splashWindow.close();
		mainWindow.show();
		mainWindow.setAlwaysOnTop(true);
		mainWindow.setAlwaysOnTop(false);
	});

	const pedalsWindow = createWindow("pedals", {
		width: 220,
		height: 100,
		alwaysOnTop: true,
		transparent: true,
		frame: false,
		show: false,
		titleBarOverlay: false,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
		},
	});

	ipcMain.on("open-pedals-window", () => {
		if (isProd) {
			pedalsWindow.loadURL("app://./pedals");
			if (!pedalsWindow.isVisible()) {
				pedalsWindow.show();
			} else {
				pedalsWindow.focus();
			}
		} else {
			pedalsWindow.loadURL(`http://localhost:${port}/pedals`);
			if (!pedalsWindow.isVisible()) {
				pedalsWindow.show();
			} else {
				pedalsWindow.focus();
			}
		}
	});

	ipcMain.on("lock-telemetry-window", () => {
		if (pedalsWindow) {
			pedalsWindow.setIgnoreMouseEvents(true);
			pedalsWindow.show(); // Sicherstellen, dass das Fenster angezeigt wird
			pedalsWindow.focus(); // Fokus auf das Fenster setzen
			pedalsWindow.setAlwaysOnTop(true); // Immer im Vordergrund
		}
	});

	ipcMain.on("unlock-telemetry-window", () => {
		if (pedalsWindow) {
			pedalsWindow.setIgnoreMouseEvents(false);
			pedalsWindow.show();
			pedalsWindow.focus();
		}
	});

	if (isProd) {
		await splashWindow.loadURL("app://./splash");
		await mainWindow.loadURL("app://./home");
	} else {
		port = process.env.PORT || 8888;
		await splashWindow.loadURL(`http://localhost:${port}/splash`);
		await mainWindow.loadURL(`http://localhost:${port}/home`);
	}

	mainWindow.on("close", () => {
		if (pedalsWindow) {
			pedalsWindow.destroy();
		}
		app.quit();
	});

	pedalsWindow.on("close", (event) => {
		event.preventDefault();
		pedalsWindow.hide();
	});
})();

app.on("window-all-closed", () => {
	app.quit();
});

ipcMain.on("message", async (event, arg) => {
	event.reply("message", `${arg} World!`);
});
