export default class Info {
	constructor(container) {
		this.container = container;
		this.messageContainer = container.querySelector('.info-messageJS');
		this.commandContainer = container.querySelector('.info-commandJS');
	}

	#message(text) {
		this.messageContainer.innerText = text;
		setTimeout(() => {
			this.messageContainer.className = '';
			this.messageContainer.innerText = '';
		}, 2000);
	}

	setCommand(commandName) {
		this.commandContainer.innerText = 'Активная команда: ' + commandName;
	}

	err(message) {
		this.messageContainer.classList.add('err');
		this.#message(message);
	}

	info(message) {
		this.messageContainer.classList.add('info');
		this.#message(message);
	}
}