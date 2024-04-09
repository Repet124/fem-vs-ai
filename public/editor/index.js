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

document.addEventListener('keydown', function(event) {
	if (event.code === 'Escape') {
		schema.decline();
		actions.off();
		controls.forEach(btn => {btn.classList.remove('activeCommand')})
	}
});