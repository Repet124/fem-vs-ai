import { schema } from '../init.js';

class CordsPallet {
	constructor(container) {
		this.container = container;
		this.point = null;
		this.isActive = false;
	}

	#buildPallet() {
		var fields = {
			x: document.createElement('input'),
			y: document.createElement('input'),
		}

		for (let axis in fields) {
			fields[axis].className = 'pallete-field';
			fields[axis].value = this.point[axis];
			fields[axis].addEventListener('input', () => {
				this.point.move(+fields.x.value, +fields.y.value);
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
		header.innerText = 'Cords';
		this.container.prepend(header);
	}

	active(point, commitAction) {
		this.isActive = true;
		this.point = point;
		this.commitAction = commitAction;
		this.container.style.display = 'flex';
		this.#buildPallet();
	}

	off() {
		if (!this.isActive) {return;}
		this.point = null;
		this.container.innerHTML = '';
		this.container.style.display = 'none';
	}
}

export default new CordsPallet(document.getElementById('pallete-cords'));