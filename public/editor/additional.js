var settingsContainer = document.querySelector('#settings');
var settingsBtn = document.querySelector('.settings-toggleJS')
settingsBtn.addEventListener('click', () => {
	settingsContainer.style.maxHeight = settingsContainer.style.maxHeight
		? ''
		: '1000px';
	settingsBtn.innerText = settingsBtn.innerText === 'Развернуть'
		? 'Свернуть'
		: 'Развернуть'
});