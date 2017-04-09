var express = require('express');
var router = express.Router();
var App = require('alidayu-node');
var app = new App('23569814', 'a7e5d8dff27ec676dc3eb22f37efc271');

var mySQLClient = require('./mysql_util.js');
var mysqlClient = new mySQLClient();
mysqlClient.connect(function (err) {
	if (err) {
		console.log(err.stack);
	} else {
		// console.log('mysql connect success');
	}
});

var sha = require('./degist_util.js');//加密
var Map = require('./data_structure/Map.js');
var common = require('./common.js');

/*forgetPassword page*/
router.get('/', function(req, res, next) {
	res.render('forget_password', {})
});
/*changPassword page*/
router.get("/change_password", function(req, res, next) {
	res.render("change_password",{});
});

var verifyCodeMap = new Map();

router.post('/message', function(req, res, next) {
	console.log(req.body.tel_number);
	var phoneNumber = req.body.tel_number;
	if (!phoneNumber) {
		var result = {
			code: 400,
			message: "缺少phoneNumber参数"
		};
		res.send(result);
		return;
	} else {
		var result = {
				code: 200,
				message: "success"
			};
			res.send(result);
	}
	var verifyCode = "";  
    var codeLength = 6;//验证码的长度    
    var random = new Array(0,1,2,3,4,5,6,7,8,9);//随机数  
    for(var i = 0; i < codeLength; i++) {//循环操作  
        var index = Math.floor(Math.random()*10);//取得随机数的索引（0~35）  
        verifyCode += random[index];//根据索引取得随机数加到code上  
    }  
	console.log(verifyCode);
	verifyCodeMap.put(phoneNumber, verifyCode);
	// var params = {number: verifyCode, product: "壹物流"};
	// app.smsSend({
	// 	sms_free_sign_name: '俞添雄',
	//     sms_param: params,
	//     rec_num: phoneNumber,
	//     sms_template_code: 'SMS_60145497'
	// }, function(response) {
	// 		console.log(response);
	// 		var result = {
	// 			code: 200,
	// 			message: "成功"
	// 		};
	// 		res.send(result);
	// 		return;
	// });
});

router.post("/nextStep", function(req, res, next) {
	console.log("接收的手机号:" + req.body.tel_number,"验证码:" +req.body.verifyCode);
	var phoneNumber = req.body.tel_number;
	var verifyCode = req.body.verifyCode;
	if (verifyCode == verifyCodeMap.get(phoneNumber)) {
		console.log("手机号跟验证码匹配");
		var result = {
			code: 200,
			message: "手机号跟验证码匹配",
			
		}
		res.send(result);
		return;
	} else {
		console.log("手机号跟验证码不匹配");
		var result = {
			code: 400,
			message: "手机号跟验证码不匹配"
		}
		res.send(result);
		return;
	}

});


router.post("/confirm", function(req, res, next) {
	var tel_number = req.body.tel_number;
	var new_password = req.body.newPassword;
	var md5_password = sha('md5',new_password);
	console.log(tel_number,new_password,md5_password);
	if (tel_number && new_password) {
		mysqlClient.exec("UPDATE delivery_user_address SET re_password = ?, store_pwd = ? WHERE tel = ?", [new_password, md5_password, tel_number], function(err, row, field) {
			if (err) {
				console.log(err.stack);
				var result = {
					code: 400,
					message: "失败"
				}

				res.send(result);
				return;
			} else {
				console.log('update password success');

                var result = {
                    code: 200,
                    message: '重置密码成功'
                };
                res.send(result);

			}
		});

	} else {

	}


});


module.exports = router;