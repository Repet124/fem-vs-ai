module.exports.normalize = function(arr) {
	let min = Math.min(...arr);
	arr = arr.map(item => item - min)
	let max = Math.max(...arr);
	arr = arr.map(item => item / max);
	return arr;
}