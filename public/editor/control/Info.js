export default class Info {
	constructor(container) {
		this.container = container;
	}

	#message(text) {
		this.container.innerText = text;
		setTimeout(() => {
			this.container.className = '';
			this.container.innerText = '';
		}, 2000);
	}

	err(message) {
		this.container.classList.add('err');
		this.#message(message);
	}

	info(message) {
		this.container.classList.add('info');
		this.#message(message);
	}
}