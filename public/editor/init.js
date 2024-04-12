import Schema from './control/Schema.js';
import Info from './control/Info.js';

const canvas = document.getElementById('canvas');
canvas.width = canvas.clientWidth;
canvas.height = document.documentElement.clientHeight - 200;

var schema = new Schema(canvas);
var info = new Info(document.getElementById('info'));
schema.commit();
schema.draw();

export {
	schema,
	info
}