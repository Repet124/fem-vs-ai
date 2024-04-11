import Schema from './control/Schema.js';
import Info from './control/Info.js';

const canvas = document.getElementById('canvas');
canvas.width = canvas.clientWidth;
canvas.height = document.documentElement.clientHeight - 200;

var schema = new Schema(canvas);
var info = new Info(document.getElementById('info'))

var test1 = schema.createPoint(1000, 1000);
var test2 = schema.createPoint(3000, 3000);
// var test3 = schema.createPoint(600, 100);
schema.createBar(test1, test2);
// schema.createBar(test2, test3).selected = true;
// schema.createBar(test1, test3).selected = true;
schema.commit();
schema.draw();

export {
	schema,
	info
}