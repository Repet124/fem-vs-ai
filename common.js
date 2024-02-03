module.exports.getArgs = function() {
	var args = {};
	process.argv.slice(2).forEach(arg => {
		var match = arg.match(/--(.*)=(.*)/);
		if (match) {
			args[match[1]] = +match[2] || match[2];
			return;
		}
		match = arg.match(/--?([a-z]*)/);
		if (match) {
			args[match[1]] = true;
		}
	});
	return args;
}

module.exports. log = function(module, txt) {
	console.log('\x1b[33m%s\x1b[0m', '[' + module + ' Module]' + txt);
}