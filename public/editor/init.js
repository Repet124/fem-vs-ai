import Schema from './control/Schema.js';
import Info from './control/Info.js';

var schema = new Schema(document.getElementById('canvas'));
var info = new Info(document.getElementById('info'))

export {
	schema,
	info
}