import Schema from './control/Schema.js';
import Info from './control/Info.js';

const canvas = document.getElementById('canvas');
// canvas.width = document.documentElement.clientWidth  - 30;
// canvas.height = document.documentElement.clientHeight - 30;

var schema = new Schema(canvas);
var info = new Info(document.getElementById('info'));
schema.draw();

export {
	schema,
	info
}