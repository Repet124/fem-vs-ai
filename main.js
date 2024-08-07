const path = require('node:path');
const fs = require('fs');
const dotenv = require('dotenv');
const { Worker } = require('worker_threads');
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

function createProject(e, isEmpty=true) {
	var filePath = dialog.showSaveDialogSync({
		title: 'Создание проекта',
	});

	(/.*\.json/.test(filePath)) || (filePath += '.json')

	isEmpty && project.buildEmpty();
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
	if (!project.filePath) {
		return createProject(null, false);
	}
	return project.save();
}

function buildDataset() {
	const datasetWorker = new Worker(
		path.join(app.getAppPath(), 'dataset/index.js'),
		{
			workerData: {
				schema: stringifySchema(project.schema),
				settings: JSON.stringify(project.settings)
			}
		}
	);

	return new Promise((resolve) => {
		datasetWorker.on('message', dataset => {
			project.dataset = dataset;
			logger.success('Датасет записан');
			saveProject();
			logger.success('Проект сохранён');
			resolve(true);
		});
	})
}

function train() {
	if (!project.dataset) {
		return 'Dataset is not exisit';
	}
	const trainWorker = new Worker(
		path.join(app.getAppPath(), 'training/index.js'),
		{
			workerData: {
				schema: stringifySchema(project.schema),
				settings: JSON.stringify(project.settings),
				dataset: project.dataset,
			}
		}
	);

	return new Promise(resolve => {
		trainWorker.on('message', trainedModel => {
			project.trained = trainedModel;
			logger.success('Модель записана');
			saveProject();
			logger.success('Проект сохранён');
			resolve(true);
		});
	});
}

function calc(e, type) {
	if (type === 'neyro' && !project.trained) {
		return false;
	}
	const neyroWorker = new Worker(
		path.join(app.getAppPath(), 'resolvers/index.js'),{
			workerData: {
				type,
				schema: stringifySchema(project.schema),
				trained: project.trained,
			}
		}
	);

	return new Promise(resolve => {
		neyroWorker.on('message', schema => {
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

