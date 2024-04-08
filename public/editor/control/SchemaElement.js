export default class SchemaElement {
	#listeners = [];

	constructor(htmlElem) {
		this.htmlNode = htmlElem;
	}

	setListener(event, handler) {
		this.#listeners.push({
			event,
			handler,
		});
		this.htmlNode.addEventListener(event, handler);
	}

	clearHanders() {
		this.#listeners.forEach(listener => {
			this.htmlNode.removeEventListener(listener.event, listener.handler)
		});
		this.#listeners = [];
	}
}