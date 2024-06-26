export default class Settings {

	#params = [
		{ident: 'maxForce', name: 'Максимальное усилие', value: 40, elem: null,},
		{ident: 'scaleCoff', name: 'Коэффициент масштабности', value: 1.8, elem: null,},
		{ident: 'batch', name: 'Размер пакета', value: 100, elem: null,},
		{ident: 'ages', name: 'Количество эпох', value: 3, elem: null,},
		{ident: 'limit', name: 'Ограничение длины датасета при обучении', value: 0, elem: null,},
		{ident: 'datasetLength', name: 'Длина датастета для генерации', value: 1000, elem: null,},
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

			input.addEventListener('change', () => {
				param.value = input.value;
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
			if (!loadingParams[param.ident]) {
				throw new Error('Отсутствует параметр ' + param.name);
			}
			param.value = loadingParams[param.ident];
		});
	}

	upload() {
		return Object.fromEntries(this.#params.map(param => [param.ident, param.value]));
	}
}