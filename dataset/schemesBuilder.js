var {nodes, bars, forces} = require('./template');

module.exports = class SchemesBuilder {

	constructor(forceMax=20, maxPercentTranslations=20) {
		this.forceMax = 20;
		this.maxDistanceChange = .5;
	}

	getSchemes(count) {
		var data = Array(count);

		for (var i = 0; i < count; i++) {
			data[i] = {
				nodes: nodes.map(node => [
					// TODO: нужно добавить изменения в Y, они занулены умножением на значения в шаблоне
					(node[0]+Number(node[0]*rand(this.maxDistanceChange).toFixed(3))),
					(node[1]+Number(node[1]*rand(this.maxDistanceChange).toFixed(3))),
					randSwitch(0, undefined),
					randSwitch(0, undefined),
				]),
				forces: forces.map(force => [
					randSwitch(Math.round(this.forceMax*rand(100)),0),
					randSwitch(Math.round(this.forceMax*rand(100)),0),
				]),
				bars: bars
			}
		}
		console.log(data[0])
		return data;
	}
}

function rand(maxPercent) {
	var res = (Math.random()*2-1)*(maxPercent/100);
	return res;
}

function randSwitch(first, second) {
	var res = (Math.random() > 0.5) ? first : second;
	return res;
}