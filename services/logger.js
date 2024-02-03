module.exports = class Logger {
	constructor(moduleName = 'Logger') {
		this.moduleName = moduleName;
		this.benches = new Map();
	}

	#log(color, mess) {
		if (!process.env.LOG) {
			return;
		}
		console.log(color + '%s\x1b[0m', '[' + this.moduleName + '] ' + mess);
	}

	info(mess) {
		this.#log('\x1b[33m', mess);
	}
	success(mess) {
		this.#log('\x1b[32m', mess);
	}
	err(mess) {
		this.#log('\x1b[31m', mess);
	}

	bench(tag) {
		if (this.benches.has(tag)) {
			this.info('Процесс занял ' + (Date.now() - this.benches.get(tag)) / 1000 + ' сек.');
			this.benches.delete(tag);
		} else {
			this.benches.set(tag, Date.now());
		}
	}
}