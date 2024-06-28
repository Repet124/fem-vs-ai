const path = require('node:path');
const fs = require('fs');
const dotenv = require('dotenv');
const { fork } = require('node:child_process');
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { stringifySchema } = require('./services/func');
const Project = require('./services/project');
const Logger = require('./services/logger');

dotenv.config()

var project = new Project();
var logger = new Logger('Main');

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
	project.save(filePath);

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

function syncProject(e, schema, settings) {
	project.schema = schema;
	project.settings = settings;
	return true;
}

function uploadProject() {
	return project.toFrontend();
}

function saveProject() {
	return project.save();
}

function buildDataset() {
	const child = fork(
		path.join(__dirname, 'dataset/index.js'),
		[stringifySchema(project.schema), JSON.stringify(project.settings)]
	);

	return new Promise((resolve) => {
		child.on('message', dataset => {
			project.dataset = dataset;
			logger.success('Датасет записан');
			saveProject();
			logger.success('Проект сохранён');
			resolve();
		});
	})
}

function train() {
	if (!project.dataset) {
		return 'Dataset is not exisit';
	}
	const child = fork(
		path.join(__dirname, 'training/index.js'),
		[stringifySchema(project.schema), JSON.stringify(project.settings), project.dataset]
	);

	return new Promise(resolve => {
		child.on('message', trainedModel => {
			project.trained = trained;
			logger.success('Модель записана');
			saveProject();
			logger.success('Проект сохранён');
			resolve();
		});
	});
}

function calc(e, type) {
	const child = fork(
		path.join(__dirname, 'resolvers/index.js'),
		[type, stringifySchema(project.schema)]
	);

	return new Promise(resolve => {
		child.on('message', schema => {
			resolve(schema);
		});
	});
}

app.whenReady().then(() => {
	createWindow();
	ipcMain.handle('create', createProject);
	ipcMain.handle('load', loadProject);
	ipcMain.handle('sync', syncProject);
	ipcMain.handle('upload', uploadProject);
	ipcMain.handle('save', saveProject);
	ipcMain.handle('dataset', buildDataset);
	ipcMain.handle('train', train);
	ipcMain.handle('calc', calc);
});

