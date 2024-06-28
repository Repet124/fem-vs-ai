import statusEnum from './control/StatusEnum.js';
import { schema, info, visualizator, settings } from './init.js';
import cordsPallet from './control/CordsPallet.js';
import forcePallet from './control/ForcePallet.js';
import reportPallet from './control/ReportPallet.js';

function show(canvasOwner) {
	if (canvasOwner === visualizator) {
		visualizator.getCanvas().style.zIndex = 200;
	} else {
		visualizator.getCanvas().style.zIndex = 0;
	}
}

// READACTOR ACTIONS

function offActions(afterSelect=true) {
	cordsPallet.off();
	schema.unselect();
	schema.clearListeners();
	schema.draw();
	if (afterSelect) {
		select();
		show(schema);
	}
}

function addBar() {
	var {points} = schema.getSelection();
	if (points.length === 2) {
		schema.createBar(points[0], points[1]);
		schema.commit();
		select();
		points[1].selected = true;
		schema.draw();
	} else {
		info.err('Необходимо выделить 2 узла');
	}
}

function addForce() {
	var {points} = schema.getSelection();
	if (points.length === 0) {
		info.err('Необходимо хотя бы 1 узел');
	}

	points.forEach(point => schema.createForce(point))
	schema.commit();
	select();
	schema.draw();
}

function addPoints() {
	offActions(false);
	info.setCommand('Добавление узлов');
	var point = null;

	schema.canvas.addListener('mousemove', e => {
		var {x,y} = schema.toSchemaCords(e.clientX, e.clientY);
		if (!point) {
			point = schema.createPoint(x, y);
		} else {
			point.move(x, y);
		}
		schema.draw();
	});

	schema.canvas.addListener('click', e => {
		point.status = statusEnum.new;
		point = null;
		schema.commit();
		schema.draw();
	});

	schema.canvas.addListener('mouseout', e => {
		if(point) {
			point.decline();
			point = null;
			schema.draw();
		}
		
	});
}

function select() {
	schema.selectModeOn();
	info.setCommand('Выделение');
}

function deleteSelected() {
	var selection = schema.getSelection();
	for (let entityKey in selection) {
		selection[entityKey].forEach(entity => entity.delete());
	}
	schema.commit();
	offActions();
}

function divideBar(bar, num) {
	info.setCommand('Разделение стержней');
	var points = Array(num+1)
		.fill()
		.map((_, i) => {
			if (i === 0) {return bar.start;}
			if (i === num) {return bar.end;}
			return schema.createPoint(
				bar.start.x + (bar.proectionX / num)*i,
				bar.start.y + (bar.proectionY / num)*i
			);
		});

	var bars = Array(num)
		.fill()
		.map((_, i) => schema.createBar(points[i], points[i+1]));
	bar.delete();
	return () => {
		bars.forEach(bar => bar.decline());
		points.forEach(point => point.decline());
	};
}

function divideSelectedBars() {
	var {bars} = schema.getSelection();
	offActions(false);

	if (bars.length === 0) {
		info.err('Необходимо выделить хотя бы один стержень');
		return;
	}

	var barsCount = 3; // default value
	var declineFuncs = bars.map(bar => divideBar(bar, barsCount));
	schema.draw();

	schema.document.addListener('keydown', e => {
		if (e.code.match(/^Digit[0-9]/)) {
			declineFuncs.forEach(func => func());
			barsCount = +e.key;
			declineFuncs = bars.map(bar => divideBar(bar, barsCount));
			schema.draw();
		}
	});

	schema.document.addListener('keydown', e => {
		if (e.code === 'Enter') {
			schema.commit();
			offActions();
		}
	});
}

function movePoint(points) {
	if (points.length !== 1) {
		info.err('Необходимо выделить один узел');
		return;
	}
	info.setCommand('Редактирование координат узла');
	points[0].selected = true;
	schema.draw();
	cordsPallet.active(points[0], () => {
		schema.commit();
		offActions();
	});
}

function changeForce(forces) {
	if (forces.length !== 1) {
		info.err('Необходимо выделить одну силу');
		return;
	}
	info.setCommand('Редактирование компонент силы');
	forces[0].selected = true;
	schema.draw();
	forcePallet.active(forces[0], () => {
		schema.commit();
		offActions();
	});
}

function edit() {
	var {points, forces} = schema.getSelection();
	offActions(false);
	movePoint(points);
	changeForce(forces);
}

function toggleSupport() {
	var {points} = schema.getSelection();

	points.forEach(point => {
		switch (point.support.x + point.support.y) {
			case 0:
				point.support.y = true;
				break;
			case 1:
				point.support.x = point.support.y = true;
				break;
			case 2:
				point.support.x = point.support.y = false;
				break;
		}
		point.selected = true;
	});
	schema.commit();
	select();
	schema.draw();
}

function clear() {
	schema.clear();
	schema.draw();
}

// BACKEND ACTIONS

function createProject() {
	window.api.create().then(uploadHandler);
}

function loadProject() {
	window.api.load().then(uploadHandler);
}

function saveProject() {
	syncProject()
		.then(() => window.api.save())
		.then(response => console.log(response
			? 'Проект успешно сохранен'
			: 'Ошибка при сохранении')
		);
}

function calcFem() {
	syncProject()
		.then(() => window.api.calc('fem'))
		.then(calcHandler);
}

function calcNeyro() {
	window.api.upload()
		.then(project => {
			settings.load(project.settings);
			return syncProject();
		})
		.then(() => window.api.calc('neyro'))
		.then(calcHandler);
}

function train() {
	console.log('Train start');
	window.api.train().then(console.log);
}

// ADDITIONAL FOR BACKAND ACTIONS

function uploadHandler(project) {
	schema.load(project.schema);
	select();
}

function calcHandler(schema) {
	reportPallet.fem = schema;
	show(visualizator);
	visualizator.show(schema);
}

function syncProject() {
	return window.api.sync(schema.upload(), settings.upload())
}

export default {
	addPoints,
	addBar,
	addForce,
	edit,
	deleteSelected,
	select,
	divide: divideSelectedBars,
	toggleSupport,
	clear,
	off: offActions,

	createProject,
	loadProject,
	saveProject,
	calcFem,
	calcNeyro,
	train,
}