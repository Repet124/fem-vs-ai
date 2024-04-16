const fs = require('fs');
const path = require('path');
const { parseSchema } = require('../common');

module.exports = class SchemesBuilder {

	constructor(schemaNum, forceMax=20, maxPercentTranslations=20) {
		let schemaJson = fs.readFileSync(path.join(__dirname,`../schemes/${schemaNum}/schema.json`));
		this.template = parseSchema(schemaJson);
		this.forceMax = 10;
		this.maxDistanceChange = 1;
	}

	getSchemes(count) {
		var data = Array(count);

		for (var i = 0; i < count; i++) {
			data[i] = {
				// nodes: nodes.map(node => [
				// 	Number((node[0]+this.maxDistanceChange*rand(100)).toFixed(3)),
				// 	Number((node[1]+this.maxDistanceChange*rand(100)).toFixed(3)),
				// 	node[2], // сохраняется положение опор
				// 	node[3]
				// ]),
				nodes: this.template.nodes.map(node => [...node]),
				forces: this.template.forces.map((force,i) => {
					if (Math.random() > .5) { // усилия назначаются (в среднем) половине случайных узлов
						return [
							Number((this.forceMax*rand(100)).toFixed(1)),
							Number((this.forceMax*rand(100)).toFixed(1)),
						]
					}
					return force;
				}),
				bars: this.template.bars
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
	var res = (Math.random() > 0.5) ? first : second;
	return res;
}