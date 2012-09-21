var fs = require('fs');
var util = require('util');
var fd;
var lineCnt = 0;
var bytes = 0;
var fileEnd;
 
exports.open = function(fileName) {
	fd = fs.openSync(fileName, 'r');
	fileEnd = false;
}
 
exports.readLine = function() {
	var buffer
	, line = ''
	, bytesRead
	, data;
	if(fileEnd) return false;
	while(buffer != '\n') {
		buffer = fs.readSync(fd, 1, bytes++, 'utf-8')[0];
		line += buffer;
	}
	lineCnt++;
	if(line.trim().length == 0) {
		fileEnd = true;
		return false;
	}
	return line.trim();
}
 
exports.getLineCnt = function() {
	return lineCnt;
}