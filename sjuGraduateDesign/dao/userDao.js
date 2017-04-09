//用户数据操作

var myLogin = require("./login");
var myRegist = require("./regist");


//调用登录方法
var loginDo = function(username,password,callback) {
	myLogin.login(username,password,function(res) {
		callback(res);
	});
}

//调用注册方法
var registDo = function(username,password,callback) {
	myRegist.regist(username,password,function(res) {
		callback(res);
	});
}

exports.login = loginDo;
exports.regist = registDo;