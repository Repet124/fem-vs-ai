import actions from './actions.js';

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
		actions.off();
		controls.forEach(btn => {btn.classList.remove('activeCommand')})
	}
});