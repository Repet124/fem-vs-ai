import statusEnum from './control/StatusEnum.js';
import { schema } from './init.js';

function offActions() {
	schema.unselect();
	schema.decline();
	schema.clearListeners();
	schema.draw();
}

function addPoints() {
	offActions();
	var point = null;

	schema.canvas.addListener('mousemove', e => {
		if (!point) {
			point = schema.createPoint(e.clientX, e.clientY)
		}
		var cords = schema.toSchemaCords(e.clientX, e.clientY);

		point.move(cords.x, cords.y);
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
	select,
	off: offActions
}