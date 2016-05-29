var path = require('path');
var express = require('express');

var router = express();

router.use(express.static(path.resolve(__dirname, 'timestamp')));

router.use(function(req,res) {
    res.end('Hello World! '+req.originalUrl.substr(1))
})

router.listen(process.env.PORT || 3000);
