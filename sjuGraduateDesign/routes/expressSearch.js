var express = require('express');
var router = express.Router();
var xto = require('xto');
// var companies = require('xto/lib/companies');
// var map = require("xto/const/namemapper");
// var getCompanyInfo = companies.getCompanyInfo;

router.get('/', function(req, res, next) {
	res.render('express_search',{});
});

router.get('/express/query', function(req, res, next){
	var expressName = req.query.companyName;
	var expressNumber =req.query.expressNumber;
	xto.query(expressNumber,expressName,function(err, express){
		if (err) {
			console.log(err);
		} else {
			console.log(express)
			res.send(express);
		}
	})
	
});

module.exports = router;