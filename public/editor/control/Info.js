export default class Info {
	#timeout = 0;

	constructor(container) {
		this.container = container;
		this.commandContainer = container.querySelector('.info-commandJS');
		this.messageContainer = container.querySelector('.info-messageJS');
		this.defaultMessageClassName = this.messageContainer.className;
	}

	#message(text, className) {
		if (this.#timeout) {
			clearTimeout(this.#timeout)
			this.clear();
			this.#timeout = 0;
		}
		this.messageContainer.classList.add(className);
		this.messageContainer.innerText = text;
		this.#timeout = setTimeout(() => {this.clear()}, 2000);
	}

	clear() {
		this.messageContainer.className = this.defaultMessageClassName;
		this.messageContainer.innerText = '';
	}

	setCommand(commandName) {
		this.commandContainer.innerText = 'Активная команда: ' + commandName;
	}

	err(message) {
		this.#message(message, 'err');
	}

	info(message) {
		this.#message(message, 'info');
	}

	success(message) {
		this.#message(message, 'success');
	}
}