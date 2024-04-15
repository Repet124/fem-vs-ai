import { schema } from '../init.js';

class ForcePallet {
	constructor(container) {
		this.container = container;
		this.force = null;
		this.isActive = false;
	}

	#buildPallet() {
		var fields = {
			x: document.createElement('input'),
			y: document.createElement('input'),
		}

		for (let axis in fields) {
			fields[axis].className = 'pallete-field';
			fields[axis].value = this.force['component'+axis.toUpperCase()];
			fields[axis].addEventListener('input', () => {
				this.force.change(+fields.x.value, +fields.y.value);
				schema.draw();
			});
			schema.document.addListener('keydown', e => {
				if (e.code === 'Enter') {
					this.commitAction();
					this.off();
				}
			});
			const label = document.createElement('label');
			label.prepend();
			label.append(axis.toUpperCase()+':', fields[axis], 'mm');
			this.container.append(label);
		}

		var header = document.createElement('h2');
		header.innerText = 'Компоненты силы';
		this.container.prepend(header);
	}

	active(force, commitAction) {
		this.isActive = true;
		this.force = force;
		this.commitAction = commitAction;
		this.container.style.display = 'flex';
		this.#buildPallet();
	}

	off() {
		if (!this.isActive) {return;}
		this.force = null;
		this.container.innerHTML = '';
		this.container.style.display = 'none';
	}
}

export default new ForcePallet(document.getElementById('pallete-force'));