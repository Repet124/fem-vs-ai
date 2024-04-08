export default class SchemaElement {
	#listeners = [];

	constructor(htmlElem) {
		this.htmlNode = htmlElem;
	}

	addListener(event, handler) {
		this.#listeners.push({
			event,
			handler,
		});
		this.htmlNode.addEventListener(event, handler);
	}

	clearListeners() {
		this.#listeners.forEach(listener => {
			this.htmlNode.removeEventListener(listener.event, listener.handler)
		});
		this.#listeners = [];
	}
}