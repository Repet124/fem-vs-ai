import { schema } from '../init.js';

class CordsPallet {
	constructor(container) {
		this.container = container;
		this.point = null;
	}

	#buildPallet() {
		var fields = {
			x: document.createElement('input'),
			y: document.createElement('input'),
		}

		for (let axis in fields) {
			
		}

		this.container
	}

	active(point) {
		this.point = point;
		this.container.style.display = 'flex';
		this.#buildPallet();
	}

	off() {
		this.point = null;
		this.container.style.display = 'none';
	}
}

export default new CordsPallet(document.getElementById('pallet-cords'));