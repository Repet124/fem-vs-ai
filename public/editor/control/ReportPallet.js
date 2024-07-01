class ReportPallet {
	#femSchema = null;
	#aiSchema = null;

	constructor(container) {
		this.container = container;
	}

	set fem(schema) {
		this.#femSchema = schema;
		this.#doIfBothSchemes();
	}

	set ai(schema) {
		this.#aiSchema = schema;
		this.#doIfBothSchemes();
	}

	#doIfBothSchemes() {
		if (this.#femSchema && this.#aiSchema) {
			this.#report();
			this.#femSchema = null;
			this.#aiSchema = null;
		} else {
			this.#clear();
		}
	}

	#report() {
		var fem = this.#femSchema.bars.map(bar => bar[3]);
		var ai = this.#aiSchema.bars.map(bar => bar[3]);

		var absDelta = fem.map((f,i) => Number(Math.abs(f-ai[i]).toFixed(2)));
		var absMaxIndex = absDelta.indexOf(Math.max(...absDelta))
		var absMinIndex = absDelta.indexOf(Math.min(...absDelta))

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
		// Максимальное абсолютное отклоненние
		this.#buildReportRow('absMax', `${absDelta[absMaxIndex]}`);
		// this.#buildReportRow('absMax', `${absDelta[absMaxIndex]}, FEM - ${fem[absMaxIndex]}, AI - ${ai[absMaxIndex]}`);
		// Минимальное абсолютное отклоненеие
		this.#buildReportRow('absMin', absDelta[absMinIndex]);
		// Сред абс откл
		this.#buildReportRow('absAverage', (absDelta.reduce((accum,f) => accum+f, 0)/absDelta.length).toFixed(2));
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