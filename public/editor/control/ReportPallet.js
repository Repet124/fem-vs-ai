class ReportPallet {
	#femSchema = null;
	#aiSchema = null;

	constructor(container) {
		this.container = container;
	}

	set fem(schema) {
		this.#femSchema = schema;
		this.#aiSchema = null;
		this.#clear();
	}

	set ai(schema) {
		this.#aiSchema = schema;
		if (this.#femSchema) {
			this.#report();
		}
	}

	#report() {

		var fem = this.#femSchema.bars.map(bar => bar[3]);
		var ai = this.#aiSchema.bars.map(bar => bar[3]);

		var delta = fem.map((f,i) => {
			var val = getDelta(f, ai[i]);
			// if (val > 1) {
			// 	console.log('fem:',f,', ai:',ai[i],', delta:', getDelta(f, ai[i]).toFixed(2));
			// }
			return val;
		});

		var average = delta.reduce((accum,f) => accum+f, 0)/fem.length;
		var quadro = Math.sqrt(delta.reduce((acc,d,i) => acc+(d-average)**2 ,0)/fem.length);

		var minIndex = 0;
		var maxIndex = 0;

		fem.forEach((f, i, arr) => {
			if (f > arr[maxIndex]) {
				maxIndex = i;
			}
			if (f < arr[minIndex]) {
				minIndex = i;
			}
		});

		// Размер схемы
		this.#buildReportRow('schemaSize', fem.length);
		// Минимальное отклонение
		this.#buildPercentRow('min', Math.min(...delta));
		// Максимальное отклоненеие
		this.#buildPercentRow('max', Math.max(...delta));
		// Среднее отклоненеие
		this.#buildPercentRow('average', average);
		// Среднеквадратичное отклоненеие
		this.#buildPercentRow('quad', quadro);
		// Отклонения максимального растягивающего
		this.#buildPercentRow('strech', getDelta(fem[maxIndex], ai[maxIndex]));
		// Отклонения максимального сжимающего
		this.#buildPercentRow('compress', getDelta(fem[minIndex], ai[minIndex]));
	}

	#buildPercentRow(spanId, val){
		this.#buildReportRow(spanId, Number((val*100).toFixed(2)), '%');
	}

	#buildReportRow(spanId, val, postfix='') {
		document.getElementById(spanId+'JS-stat').innerText = val + ' ' + postfix;
	}

	#clear() {
		this.container.querySelectorAll('span').forEach(span => {
			span.innerText = '';
		})
	}

}

function getDelta(a, b) {
	return Math.abs(a - b)/Math.max(Math.abs(a), Math.abs(b));
}


export default new ReportPallet(document.getElementById('pallete-stats'));