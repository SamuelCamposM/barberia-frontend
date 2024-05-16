const electron = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  // Carga un archivo HTML local en lugar de una URL de localhost
  // Asegúrate de tener un archivo 'index.html' en un directorio 'public' en la raíz de tu proyecto
  // mainWindow.loadURL(`${path.join(__dirname, "../dist/index.html")}`);
  mainWindow.loadURL("http://localhost:5173");

  mainWindow.on("closed", () => {
    mainWindow = undefined;
  });
}

electron.app.on("ready", createWindow);

electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});

electron.app.on("activate", () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});
