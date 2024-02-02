var {nodes, bars, forces} = require('./commonSchema');
var forceMax = 20;
var maxPercentTranslations = 20;

module.exports.getSchemes = function(iterations) {
	var data = Array(iterations);
	for (var i = 0; i < iterations; i++) {
		nodes = nodes.map(node => [
			Number((node[0]+node[0]*rand(maxPercentTranslations)).toFixed(3)),
			Number((node[1]+node[1]*rand(maxPercentTranslations)).toFixed(3)),
			randSwitch(0, undefined),
			randSwitch(0, undefined),
		]);
		forces = forces.map(force => [
			randSwitch(Math.round(forceMax*rand(100)),0),
			randSwitch(Math.round(forceMax*rand(100)),0),
		]);
		data[i] = {nodes, bars, forces};
	}
	return data;
}

function rand(maxPercent) {
	var res = (Math.random()*2-1)*(maxPercent/100);
	return res;
}

function randSwitch(first, second) {
	var res = Math.random() > 0.5 ? first : second;
	return res;
}