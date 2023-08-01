var express = require('express')
var body_parser = require('body-parser')
var cors = require('cors')
var app = express();
var router = express.Router();
var fs = require('fs');
var cmd = require('node-cmd');
var app = express();
var router = express.Router();
var path = require('path');


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(body_parser.urlencoded({ extended: true }))
app.use(body_parser.json())
app.use(cors())
app.use('/api', router)

router.use((request, response, next) => {
    console.log('middleware!');
    next();
});

router.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});


var port = process.env.PORT || 8090;
app.listen(port);
console.log('app running port ' + port);


// Customer date frame 
router.route('/').get(async (req, res, next) => {
    try {
    res.json('home page');
  } catch (error) {
    next(error);
  }
})


