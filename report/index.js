var fem = '{"nodes":[[0,0,-19.99999999999999,0],[2,2,-15.656854249492376,-32.62741699796951],[4,0,0,0],[2,0,-9.999999999999995,-48.62741699796951]],"bars":[[0,1,1,-7.071],[1,2,1,-4.243],[0,3,1,5],[3,2,1,5],[1,3,1,8]],"forces":[[0,0],[-2,0],[0,0],[0,-8]]}';

var ai = '{"nodes":[[0,0,0,0],[2,2,0,0],[4,0,0,0],[2,0,0,0]],"bars":[[0,1,1,-6.58489657214181],[1,2,1,-5.238037067090827],[0,3,1,4.281818643935213],[3,2,1,4.858221266850937],[1,3,1,8.49979591098367]],"forces":[[0,0],[-2,0],[0,0],[0,-8]]}';

function log(name, val) {
	console.log(name+':', Number((val*100).toFixed(2)), '%')
}

function getDelta(a, b) {
	return Math.abs(a - b)/Math.max(Math.abs(a), Math.abs(b));
}

fem = JSON.parse(fem).bars.map(bar => bar[3]);
ai = JSON.parse(ai).bars.map(bar => bar[3]);

var delta = fem.map((f,i) => {
	// console.log('fem:',f,', ai:',ai[i],', delta:', getDelta(f, ai[i]).toFixed(2));
	return getDelta(f, ai[i]);
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