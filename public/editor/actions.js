import statusEnum from './control/StatusEnum.js';
import { schema, info } from './init.js';
import cordsPallet from './control/CordsPallet.js';

function offActions(afterSelect=true) {
	cordsPallet.off();
	schema.unselect();
	schema.clearListeners();
	schema.draw();
	if (afterSelect) {
		select();
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

function movePoint() {
	var {points} = schema.getSelection();
	offActions(false);

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

export default {
	addPoints,
	addBar,
	movePoint,
	select,
	deleteSelected,
	divide: divideSelectedBars,
	toggleSupport,
	off: offActions,
}