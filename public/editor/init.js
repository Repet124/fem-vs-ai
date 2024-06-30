import Schema from './control/Schema.js';
import Settings from './control/Settings.js';
import Info from './control/Info.js';
import Visualizator from '../visualization.js';

const editorCanvas = document.getElementById('editor-canvas');
const visualizationCanvas = document.getElementById('visualization-canvas');

[editorCanvas, visualizationCanvas].forEach(canvas => {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
});

var schema = new Schema(editorCanvas);
var visualizator = new Visualizator(visualizationCanvas);
var info = new Info(document.getElementById('info'));
var settings = new Settings(document.getElementById('settings'));

schema.commit();
schema.draw();

export {
	schema,
	info,
	visualizator,
	settings
}