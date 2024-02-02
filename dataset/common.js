module.exports. log = function(module, txt) {
	console.log('\x1b[33m%s\x1b[0m', '[' + module + ' Module]' + txt);
}