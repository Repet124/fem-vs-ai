function log(name, val) {
	console.log(name+':', Number((val*100).toFixed(2)), '%')
}

function getDelta(a, b) {
	return Math.abs(a - b)/Math.max(Math.abs(a), Math.abs(b));
}

// СНАЧАЛА НУЖНО СОЗДАТЬ fem И ai С НАБОРОМ ДАННЫХ, САМО НЕ ЗАРАБОТАЕТ!!! (ДА, СДЕЛАНО ЧЕРЕЗ ЗАДНИЦУ -_-)
fem = JSON.parse(fem).bars.map(bar => bar[3]);
ai = JSON.parse(ai).bars.map(bar => bar[3]);

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

console.log('Размер схемы:',fem.length,'элементов');

log('Минимальное отклонение', Math.min(...delta));
log('Максимальное отклоненеие', Math.max(...delta));
log('Среднее отклоненеие', average);
log('Среднеквадратичное отклоненеие', quadro);
log('Отклонения максимального растягивающего', getDelta(fem[maxIndex], ai[maxIndex]));
log('Отклонения максимального сжимающего', getDelta(fem[minIndex], ai[minIndex]));