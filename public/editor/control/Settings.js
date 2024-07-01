export default class Settings {

	#params = [
		{ident: 'maxForce', name: 'Максимальное усилие', _value: 40, elem: null,},
		{ident: 'scaleCoff', name: 'Коэффициент масштабности', _value: 1.8, elem: null,},
		{ident: 'batch', name: 'Размер пакета', _value: 100, elem: null,},
		{ident: 'ages', name: 'Количество эпох', _value: 3, elem: null,},
		{ident: 'limit', name: 'Ограничение длины датасета при обучении', _value: 0, elem: null,},
		{ident: 'datasetLength', name: 'Длина датастета для генерации', _value: 1000, elem: null,},
	];

	constructor(container, defaultParams=null) {
		this.container = container;
		defaultParams && this.load(defaultParams);
		this.build();
	}

	build() {
		var list = this.#params.map(param => {
			var label = document.createElement('label');
			var input = document.createElement('input');

			Object.defineProperty(param, 'value', {
				get() {return +this._value;},
				set(val) {
					this._value = +val;
					input.value = val;
				}
			})

			input.addEventListener('change', () => {
				param._value = input.value;
			})

			label.classList.add('settings-label');
			input.classList.add('settings-input');

			input.value = param.value;
			param.elem = input;
			label.append(param.name, ':', input);
			return label;
		});

		this.container.append(...list);
	}

	load(loadingParams) {
		this.#params.forEach(param => {
			if (loadingParams[param.ident] === undefined) {
				throw new Error('Отсутствует параметр ' + param.name);
			}
			param.value = loadingParams[param.ident];
		});
	}

	upload() {
		return Object.fromEntries(this.#params.map(param => [param.ident, param.value]));
	}
}