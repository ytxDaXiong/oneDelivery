var md5 = require('../public/javascripts/md5.js');
var express = require('express');
var router = express.Router();

var getcookieValue = require('./cookies_util.js');
var common = require('./common.js');

var mySQLClient = require('./mysql_util.js');
var mysqlClient = new mySQLClient();
mysqlClient.connect(function (err) {
	if (err) {
		console.log(err.stack);
	} else {
		console.log('mysql connect success');
	}
});

var sha = require('./degist_util.js');

var ArrayList = require('./data_structure/ArrayList.js');
var m_Map = require('./data_structure/Map.js');
var loginMap = new m_Map();



router.use('/login',require('./login'));

/* GET home page. */
// router.get('/',homeHanlder);
router.get('/index', function(req, res, next) {
	console.log("用户信息",req.session.user);
	var UserData = req.session.user;
  	if (UserData) {
  		mysqlClient.exec('select * from delivery_user_address where id = ?', [UserData.id], function(err, rows, fields) {
			if (err) {
				console.log(err.stack);

				var error = {
					code: 500,
					message: '服务端异常'
				};
				res.send(error);
			} else {
				console.log('select success');

				if (rows.length == 0) {
					var error = {
						code: 400,
						message: '无此用户'
					};
					res.send(error);
				} else {

	                var success = {
	                    code: 200,
	                    message: '用户存在',
	                    userCode: rows[0].store_name,
	                    userName: rows[0].contact
	                };
	               
					//向主页传递用户信息参数
	                res.render('index', {store_name: rows[0].store_name,contact: rows[0].contact});
				}
			}
		});
  	}

 
});

router.post('/index', function(req, res, next) {
 	console.log(req.body);
 	var pageNo = req.body.pageNo;
 	var pageSize = req.body.pageSize;

 	var data = {currentPage:pageNo,totalPages:pageSize};
 	console.log(data.currentPage,data.totalPages);
 	mysqlClient.exec('select count(1) count from express_record where store_name = ?', [req.body.storeName],function(err,rows,fields) {
 		if (err) {
 			console.log(err.stack);
 		} else {
 			if (rows) {
 				data.totalPages = Math.ceil(rows[0].count/pageSize);
 				console.log("获取总页数:"+data.totalPages);
 			}
 		}
 	});
 	//获取已发货未签收的记录条数
 	mysqlClient.exec('select count(1) count from express_record where store_name = ? and status = "delivered"', [req.body.storeName], function(err, rows, fields) {
 		if (err) {
 			console.log(err.stack);
 		} else {
 			if (rows) {
 				data.deliNumber = rows[0].count;
 				console.log("已发货未签收的记录条数为:"+data.deliNumber);
 			}
 		}
 	});


  	if (req.body.storeName) {
  		mysqlClient.exec('select * from express_record where store_name = ? LIMIT '+(pageNo-1)*pageSize+','+pageSize, [req.body.storeName], function(err, rows, fields) {
	    	if (err) {
				console.log(err.stack);

				var error = {
					code: 500,
					message: '服务端异常'
				};
				res.send(error);
			} else {
				console.log('select success');

				if (rows.length == 0) {
					var result = {
						code: 200,
						message: 'no more data',
						items: rows
					};
					res.send(result);
				} else {
					for (var i = 0; i < rows.length; i++) {
						if (rows[i].express_code == "ex_100" || rows[i].express_code == "ex_101" || rows[i].express_code == "ex_102" || rows[i].express_code == "ex_103" || rows[i].express_code == "ex_104" || rows[i].express_code == "ex_105") {
							rows[i].delivery_type = "express";
						} else {
							if (rows[i].logistic_code == "lc_100" || rows[i].logistic_code == "lc_104" || rows[i].logistic_code == "lc_105") {
								rows.delivery_type = "delivery";
							}
						}
						
					}
					console.log(data.currentPage,data.totalPages);
					var result = {
						code: 200,
						currentPage: data.currentPage,
						totalPages: data.totalPages,
						deliNumber:data.deliNumber,
						items: rows
					}
					// data.items = rows;
					// console.log(data);
					res.send(result);
				}

				
			}

		});
  	}
 });	








/*me page*/
router.get('/me', function(req, res, next) {
	res.render('me', {})
});

/* 退货 */
router.get('/returnGoods', function(req, res, next) {
	res.render('return_goods', {})
});




module.exports = router;
