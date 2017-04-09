/**
数字签名的帮助工具
*/

var crypto = require('crypto');

function sha(type, content) {
	var sha = crypto.createHash(type);
	sha.update(content);
	return sha.digest('hex');
}

module.exports = sha;