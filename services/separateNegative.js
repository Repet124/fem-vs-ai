Array.prototype.separateNegative = function() {
	return this.map(item => ([
		item > 0 ? item : 0,
		item < 0 ? (-item) : 0,
	])).flat();
}