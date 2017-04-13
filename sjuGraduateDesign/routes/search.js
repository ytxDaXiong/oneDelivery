var express = require('express');
var router = express.Router();
var mySQLClient = require('./mysql_util.js');
var mysqlClient = new mySQLClient();
mysqlClient.connect(function (err) {
	if (err) {
		console.log(err.stack);
	} else {
		// console.log('mysql connect success');
	}
});
var Map = require('./data_structure/Map.js');

/*search page*/
router.get('/', function(req, res, next) {
	res.render('search', {})
});

router.post('/searchCommand', function(req, res, next) {
	console.log(req.body);
	var pageNo = req.body.pageNo;
	var pageSize = req.body.pageSize;
	var storeName = req.body.storeName;
	var condition = req.body.condition;
	var cond2string = JSON.parse(condition);
	var deliveryNumber = cond2string.deliveryNumber;
	var orderId = cond2string.orderId;
	var status = cond2string.status;
	

	var data = {currentPage:pageNo,totalPages:0};
	console.log(pageNo,pageSize,storeName,deliveryNumber,orderId,status);
	mysqlClient.exec('SELECT * FROM express_record WHERE store_name = ? AND (express_number = ? OR order_id = ? OR status = ?) LIMIT '+(pageNo-1)*pageSize+','+pageSize,[storeName,deliveryNumber,orderId,status], function(err, rows, field){
		if (err) {
			console.log(err.stack);
			var error = {
				code: 500,
				message: '服务端异常'
			};
			res.send(error);
		} else {
			console.log('select success');
			console.log(rows);
			if (rows.length == 0 && pageNo == 1) {
				var result = {
					code: 200,
					message: '无此记录,请检查输入内容',
					items: rows
				}
				res.send(result);
			} else {
				data.totalPages = Math.ceil(rows.length/pageSize);
				console.log("totalPages:"+data.totalPages);
				for (var i = 0; i < rows.length; i++) {
					if (rows[i].express_code == "ex_100" || rows[i].express_code == "ex_101" || rows[i].express_code == "ex_102" || rows[i].express_code == "ex_103" || rows[i].express_code == "ex_104" || rows[i].express_code == "ex_105") {
						rows[i].delivery_type = "express";
					} else {
						if (rows[i].logistic_code == "lc_100" || rows[i].logistic_code == "lc_104" || rows[i].logistic_code == "lc_105") {
							rows.delivery_type = "delivery";
						}
					}
					
				}

				var result = {
					code: 200,
					currentPage: data.currentPage,
					totalPages: data.totalPages,
					items: rows
				}

				res.send(result);


			}
		}
	});

})
module.exports = router;