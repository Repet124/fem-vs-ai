import actions from './actions.js';

var controls = document.querySelectorAll('[data-command]');

controls.forEach(btn => {
	btn.addEventListener('click', e => {
		if (actions[btn.dataset.command]) {
			actions[btn.dataset.command]();
		}
	})
})