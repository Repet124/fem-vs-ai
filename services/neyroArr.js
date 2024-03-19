Array.prototype.separateNegative = function() {
	return this.map(item => ([
		item > 0 ? item : 0,
		item < 0 ? (-item) : 0,
	])).flat();
}

Array.prototype.shiftWithSign = function() {
	let positive = this.shift();
	let negative = this.shift();
	return positive > negative ? positive : (-negative);
}

Array.prototype.normalize = function() {
	let arr = this;
	let min = Math.min(...arr);
	arr = arr.map(item => item - min)
	let max = Math.max(...arr);
	arr = arr.map(item => item / max);
	return arr;
}