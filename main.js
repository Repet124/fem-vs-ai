const path = require('node:path');
const fs = require('fs');
const dotenv = require('dotenv');
const { fork } = require('node:child_process');
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const Project = require('./services/project');

dotenv.config()

var project = new Project();

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1920,
		height: 1080,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		}
	})

	win.loadFile('./public/index.html')
	return win;
}

function createProject() {
	var filePath = dialog.showSaveDialogSync({
		title: 'Создание проекта',
	});

	(/.*\.json/.test(filePath)) || (filePath += '.json')

	project.buildEmpty();
	project.filePath = filePath;
	project.save();

	return project.toFrontend();
}

function loadProject() {
	var filePath = dialog.showOpenDialogSync({
		title: 'Загрузить проект',
		properties: ['openFile']
	})[0];
	if (filePath && /.*\.json/.test(filePath)) {
		project.load(filePath);
		return project.toFrontend();
	}
	return false;
}

function syncProject(schema, settings) {
	project.schema = schema;
	project.settings = settings;
	return true;
}

function saveProject() {
	return project.save();
}

function train() {
	const child = fork(
		path.join(__dirname, 'training/index.js'),
		[project.schema.stringify(), project.settings.stringify()]
	);

	child.on('message', trainedModel => {
		project.trained = trained;
		saveProject();
	})

	return 'train run!'; // this is a promise
}

function buildDataset() {
	const child = fork(
		path.join(__dirname, 'dataset/index.js'),
		[project.schema.stringify(), project.settings.stringify()]
	);

	child.on('message', dataset => {
		project.dataset = dataset;
		saveProject();
	});

	return 'dataset building was run!'; // this is a promise
}

function calc(type) {
	const child = fork(
		path.join(__dirname, 'resolvers/index.js'),
		[type, project.schema.stringify()]
	);

	child.on('message', schema => {
		// schema to frontend
	});

	return 'calculating with ' + type + ' method was run!'; // this is a promise
}

app.whenReady().then(() => {
	createWindow();
	ipcMain.handle('create', createProject);
	ipcMain.handle('load', loadProject);
	ipcMain.handle('sync', syncProject);
	ipcMain.handle('save', saveProject);
	ipcMain.handle('dataset', buildDataset);
	ipcMain.handle('train', train);
	ipcMain.handle('calc', calc);
});

