import actions from './actions.js';
import { schema } from './init.js';

function getZoomHandler() {
	var canvPos = schema.canvas.htmlNode.getBoundingClientRect();
	return (e) => {
		if (!isCrodsOverElem(e.clientX, e.clientY, canvPos)) {return}
		const scaleOld = schema.scale;
		const scaleNew = schema.scale * (e.deltaY > 0 ? 1.2 : 0.8);

		if(!schema.setScale(scaleNew)){return};

		const cursor = {
			x: e.clientX - canvPos.x,
			y: canvPos.height - (e.clientY - canvPos.y),
		}

		const coff = (scaleNew - scaleOld) / (scaleNew * scaleOld);

		schema.translateX -= cursor.x * coff;
		schema.translateY -= cursor.y * coff;
		schema.draw();
	}
};

function getTranslationHandler() {
	var canvPos = schema.canvas.htmlNode.getBoundingClientRect();
	var start = null;
	return (e) => {
		if (!isCrodsOverElem(e.clientX, e.clientY, canvPos)) {return}
		if (!start) {
			start = {
				x: e.clientX,
				y: e.clientY,
			}
			return;
		}
		schema.translateX += (e.clientX - start.x) / schema.scale;
		schema.translateY -= (e.clientY - start.y) / schema.scale;
		start.x = e.clientX;
		start.y = e.clientY;
		schema.draw();
	}
}

function isCrodsOverElem(clientX, clientY, boundingClientRect) {
	return !(clientX < boundingClientRect.x || clientY < boundingClientRect.y || clientX > boundingClientRect.right || clientY > boundingClientRect.bottom);
}

var controls = document.querySelectorAll('[data-command]');
var canvas = schema.canvas.htmlNode;

canvas.addEventListener('mousedown', e => {
	if (e.button !== 1) {return;} // только нажатие колёсика
	var translationHandler = getTranslationHandler();

	var removeTranslationHandler = e => {
		if (e.button !== 1) {return;} // только отжатие колёсика
		canvas.removeEventListener('mousemove', translationHandler);
		document.removeEventListener('mouseup', removeTranslationHandler);
	}

	canvas.addEventListener('mousemove', translationHandler);
	document.addEventListener('mouseup', removeTranslationHandler);
});

window.addEventListener('wheel', getZoomHandler());

document.addEventListener('keydown', function(e) {
	if (e.code === 'Escape') {
		schema.decline();
		actions.off();
		controls.forEach(btn => {btn.classList.remove('activeCommand')})
	}
});

controls.forEach(btn => {
	btn.addEventListener('click', e => {
		if (actions[btn.dataset.command]) {
			controls.forEach(btn => {btn.classList.remove('activeCommand')})
			e.target.classList.add('activeCommand')
			actions[btn.dataset.command]();
		}
	})
});