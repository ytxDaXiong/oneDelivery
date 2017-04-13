var express = require('express');
var router = express.Router();
var App = require('alidayu-node');
var app = new App('23569814', 'a7e5d8dff27ec676dc3eb22f37efc271');

var MySQLClient = require('./mysql_util.js');
var mysqlClient = new MySQLClient();
mysqlClient.connect(function (err) {
	if (err) {
		console.log(err.stack);
	} else {
		// console.log('mysql connect success');
	}
});
var Map = require('./data_structure/Map.js');
var sha = require('./degist_util.js');//加密
/*regist page*/
router.get('/', function(req, res, next) {
  	res.render('regist', {});
});

var verifyCodeMap = new Map();

//阿里大鱼手机短信验证码获取
router.post("/registData", function(req, res, next) {
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
	var params = {number: verifyCode, product: "壹物流"};
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


router.post("/", function(req, res, next) {
	var requestEntity = req.body;
	if (requestEntity) {
		var phoneNumber = requestEntity.phoneNumber;
		var verifyCode = requestEntity.verifyCode;
		var password = requestEntity.password;

		console.log('phoneNumber = ' + phoneNumber);
		console.log('verifyCode = ' + verifyCode);
		console.log('password = ' + password);
		//检查手机号和验证码是否匹配
		if (verifyCodeMap.get(phoneNumber) == verifyCode) {
			console.log("手机号和验证码匹配")
			
		} else {
			var result = {
						code: 400,
						message: '手机号和验证码不匹配'
					};
			res.send(result);

		}

		//检查手机号码是否已经注册
		if (phoneNumber) {
			mysqlClient.exec("SELECT id FROM delivery_user_address WHERE tel = ?",[phoneNumber], function(err, rows, fields) {
				if (err) {
					console.log(err.stack);
					var result = {
						code: 400,
						message: 'sql执行错误'
					}
					res.send(result);
					return;

				} else {
					console.log(rows.length);
					if (rows.length != 0) {
						var result = {
							code: 400,
							message: '该号码已注册'
						}
						res.send(result);
						return;
					} else {
						var timestamp = Date.parse(new Date());
						timestamp = timestamp / 1000;//时间戳
						md5_password = sha('md5',password);
						if (phoneNumber && verifyCode && verifyCodeMap.get(phoneNumber) == verifyCode) {
							mysqlClient.exec("INSERT INTO delivery_user_address (user_code, contact, tel, last_update_time, re_password, store_pwd, store_user_name) VALUES (?, ?, ?, ?, ?, ?, ?)",[phoneNumber,phoneNumber,phoneNumber,timestamp,password,md5_password,phoneNumber], function(err, rows, fields) {
								if (err) {
									console.log(err.stack);
									var result = {
										code: 400,
										message: '注册sql执行错误'
									};
									res.send(result);
									return;
								} else {
									console.log("insert成功");
									var result = {
										code: 200,
										message: '注册成功'
									};
									res.send(result);
								}
								return;
							});

						} else {
							console.log("参数错误");

						}

					}

				}
			});
		} else {
			console.log("phoneNumber参数丢失");
		}
		
	}
});

/*完善信息*/
router.get('/updateUserInfo', function(req, res, next) {
	res.render('update_userInfo',{})
});

router.post('/updateUserInfo', function(req, res, next) {
	console.log(req.body);
	var phoneNumber = req.body.phoneNumber;
	var info = req.body;
	if (phoneNumber) {
		mysqlClient.exec("UPDATE delivery_user_address SET user_code = ?, contact = ?, address = ?, store_name = ?, notice = ? WHERE tel = ?", [info.userCode, info.contact, info.address, info.storeName, info.notice, info.phoneNumber], function(err, rows, fields){
			if (err) {
				console.log(err.stack);
				var result = {
					code: 400,
					message: "UPDATE ERROR"
				}
				res.send(result);
				return;

			} else {
				console.log("update info success");
				var result = {
					code: 200,
					message: "更新用户信息成功"
				}
				res.send(result);
				return;
			}
		});
		return;
	} else {
		console.log("参数错误");
		var result = {
			code: 400,
			message: "参数错误"
		}

		res.send(result);
	}
});


module.exports = router;