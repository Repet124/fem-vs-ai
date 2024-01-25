import { getScale } from './common.js'
import { schema } from './schema.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const offset = 100;

let scale = getScale(canvas.width, canvas.height, schema.nodes, offset);

ctx.scale(scale, scale);
ctx.translate(offset, offset);