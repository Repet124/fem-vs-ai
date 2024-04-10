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
	var delta = 0;
	var canvPos = schema.canvas.htmlNode.getBoundingClientRect();
	return (e) => {
		if (e.clientX < canvPos.x || e.clientY < canvPos.y || e.clientX > canvPos.right || e.clientY > canvPos.bottom) {return}
		delta++;
		// числа подобраны имперически
		if (delta < 5) {return}
		delta = 0;
		if(e.deltaY > 0) {
			schema.scale *= 1.2;
		} else {
			schema.scale /= 1.2;
		}
		schema.draw();
	}
}

window.addEventListener('wheel', zoomHandler());