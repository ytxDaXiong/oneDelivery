var express = require('express');
var router = express.Router();

/*search page*/
router.get('/', function(req, res, next) {
	res.render('search', {})
});

router.post('/searchCommand', function(req, res, next) {
	console.log(req.body);
})
module.exports = router;