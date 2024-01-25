import { getScale, drawBar } from './common.js'
import {nodes, bars} from './schema.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const offset = 100;

let scale = getScale(canvas.width, canvas.height, nodes, offset);

ctx.translate(offset, (canvas.height-offset));
ctx.scale(scale, -scale);
ctx.save();

bars.forEach(bar => {
	drawBar(ctx, nodes[bar[0]], nodes[bar[1]]);
});

