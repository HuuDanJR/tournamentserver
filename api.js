var dboperation = require('./dboperation')
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
var soap = require('./soap')

//socket io
// const io = require('socket.io')();

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

var port = process.env.PORT || 8090;
app.listen(port);
console.log('app running at port: ' + port);



















router.route('/findbetnumber').get((req, res) => {
    try {
        dboperation.findBetNumber((err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching bet numbers.' });
            }
            return res.status(200).json(result);
        });
    } catch (error) {
        return res.status(500).json({ error: 'An unexpected error occurred.' });
    }
})


router.route('/findstationdata').get((req, res) => {
    try {
        dboperation.findStationData((err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching bet numbers.' });
            }
            return res.status(200).json(result);
            //   return res.status(200).json(result);
        });
    } catch (error) {
        return res.status(500).json({ error: 'An unexpected error occurred.' });
    }
})
router.route('/addstationdata').post((req, res) => {
    try {
        const { machine, member, bet, credit, connect, status, aft, lastupdate } = req.body;
        // Ensure all required fields are present in the request body
        if (!machine || !member || !bet || !credit || !connect || !status || !aft || !lastupdate) {
            return res.status(400).json({ error: 'Missing required fields in the request body.' });
        }
        // Call the function to insert the data into the 'stationdata' table
        dboperation.addStationData(machine, member, bet, credit, connect, status, aft, lastupdate, (err, result) => {
            if (err) {
                console.error('Error adding station data:', err);
                return res.status(500).json({ error: 'Error adding station data.' });
            }

            // Return success response
            return res.status(201).json({ message: 'Station data added successfully.',result });
        });
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return res.status(500).json({ error: 'An unexpected error occurred.' });
    }
})


router.route('/deletestationdata').delete((req, res) => {
    try {
       const {ip}= req.body; 
        dboperation.deleteStationData(ip, (err, result) => {
            if (err) {
                console.error('Error delete station data:', err);
                return res.status(500).json({ error: 'Error deleting station data.' });
            }
            return res.status(201).json({ message: 'Station data deleting successfully.',result });
        });
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return res.status(500).json({ error: 'An unexpected error occurred.' });
    }
})





