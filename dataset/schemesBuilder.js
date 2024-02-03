var {nodes, bars, forces} = require('./template');

module.exports = class SchemesBuilder {

	constructor(forceMax=20, maxPercentTranslations=20) {
		this.forceMax = 20;
		this.maxPercentTranslations = 20;
	}

	getSchemes(count) {
		var data = Array(count);

		for (var i = 0; i < count; i++) {
			data[i] = {
				nodes: nodes.map(node => [
					Number((node[0]+node[0]*rand(this.maxPercentTranslations)).toFixed(3)),
					Number((node[1]+node[1]*rand(this.maxPercentTranslations)).toFixed(3)),
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
		return data;
	}
}

function rand(maxPercent) {
	var res = (Math.random()*2-1)*(maxPercent/100);
	return res;
}

function randSwitch(first, second) {
	var res = Math.random() > 0.5 ? first : second;
	return res;
}