import Schema from './control/Schema.js';
import Info from './control/Info.js';
import Visualizator from '../visuzlization.js';

const editorCanvas = document.getElementById('editor-canvas');
const visualizationCanvas = document.getElementById('visuzlization-canvas');

[editorCanvas, visualizationCanvas].forEach(canvas => {
	canvas.width = canvas.clientWidth;
	canvas.height = document.documentElement.clientHeight - 200;
});

var schema = new Schema(canvas);
var visualizator = new Visualizator(visualizationCanvas);
var info = new Info(document.getElementById('info'));

schema.commit();
schema.draw();

export {
	schema,
	info,
	visualizator,
}