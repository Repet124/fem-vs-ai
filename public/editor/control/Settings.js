export default class Settings {

	#params = [
		{type:'num', ident: 'maxForce', name: 'Максимальное усилие', _value: 40, elem: null,},
		{type:'num', ident: 'scaleCoff', name: 'Коэффициент масштабности', _value: 1.8, elem: null,},
		{type:'num', ident: 'batch', name: 'Размер пакета', _value: 100, elem: null,},
		{type:'num', ident: 'ages', name: 'Количество эпох', _value: 3, elem: null,},
		{type:'num', ident: 'limit', name: 'Ограничение длины датасета при обучении', _value: 0, elem: null,},
		{type:'num', ident: 'datasetLength', name: 'Длина датастета для генерации', _value: 1000, elem: null,},
		{type:'radio', ident: 'processor', name: 'Процессор', _value: 'GPU', elems: null, _vals: ['CPU', 'GPU']},
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
				get() {return Number.parseInt(this._value, 10) || this._value;},
				set(val) {
					this._value = val;
					if (this.type === 'radio') {
						this.elems.some(elem => (elem.checked = (elem.value === val)));
					} else {
						this.elem.value = val;
					}
				}
			})

			input.addEventListener('change', () => {
				param._value = input.value;
			})

			label.classList.add('settings-label');
			input.classList.add('settings-input');

			input.value = param.value;
			param.elem = input;

			if (param.type === 'radio') {
				param.elems = Array(param._vals.length);
				var radios = param._vals.map(val => {
					var el = document.createElement('input');
					var lab = document.createElement('label');
					el.type = 'radio';
					el.name = param.ident;
					el.value = val;
					param.elems.push(el);
					if (val === param._value) {el.checked=true;}
					el.addEventListener('change', e => (e.target.checked && (param.value = e.target.value)));
					lab.append(el,val);
					return lab;
				}).flat();
				input.addEventListener('change', () => {
					radios.some(radio => {
						if (true) {}
					})
				});
				label.append(param.name, ':', ...radios);
			} else {
				label.append(param.name, ':', input);
			}
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