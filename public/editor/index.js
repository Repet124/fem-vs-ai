import actions from './actions.js';
import { schema } from './init.js';

var controls = document.querySelectorAll('[data-command]');

controls.forEach(btn => {
	btn.addEventListener('click', e => {
		if (actions[btn.dataset.command]) {
			e.target.classList.add('activeCommand')
			actions[btn.dataset.command]();
		}
	})
})

document.addEventListener('keydown', function(e) {
	if (e.code === 'Escape') {
		schema.decline();
		actions.off();
		controls.forEach(btn => {btn.classList.remove('activeCommand')})
	}
});

function zoomHandler(argument) {
	var canvPos = schema.canvas.htmlNode.getBoundingClientRect();
	return (e) => {
		if (e.clientX < canvPos.x || e.clientY < canvPos.y || e.clientX > canvPos.right || e.clientY > canvPos.bottom) {return}

		const scaleOld = schema.scale;
		const scaleNew = schema.scale * (e.deltaY > 0 ? 1.2 : 0.8);

		if(!schema.setScale(scaleNew)){return};

		const cursor = {
			x: e.clientX - canvPos.x,
			y: canvPos.height - (e.clientY - canvPos.y),
		}

		const coff = (scaleNew - scaleOld) / (scaleNew * scaleOld);

		schema.translateX -= cursor.x * coff;
		schema.translateY -= cursor.y * coff;
		schema.draw();
	}
}

window.addEventListener('wheel', zoomHandler());