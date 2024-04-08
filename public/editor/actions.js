import statusEnum from './control/StatusEnum.js';
import { schema, info } from './init.js';

function offActions() {
	schema.unselect();
	schema.decline();
	schema.clearListeners();
	schema.draw();
}

function addBar() {
	var {points} = schema.getSelection();
	if (points.length === 2) {
		schema.createBar(points[0], points[1]);
		schema.commit();
		schema.draw();
	} else {
		info.err('Необходимо выделить 2 узла');
	}
	offActions();
}

function addPoints() {
	offActions();
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
			point.unlink();
			point = null;
			schema.draw();
		}
		
	});
}

function select() {
	offActions();
	schema.selectModeOn();
}

export default {
	addPoints,
	addBar,
	select,
	off: offActions
}