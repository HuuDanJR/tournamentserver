var dboperation = require('./dboperation')
var express = require('express')
var body_parser = require('body-parser')
var cors = require('cors')
var app = express();
var router = express.Router();
var fs = require('fs');
var cmd = require('node-cmd');
var path = require('path');
var soap = require('./soap')
var http = require('http').createServer(app);  // Use the same http instance for express and socket.io
var io = require('socket.io')(http); 
const cron = require('node-cron');

var dboperation_socket =require('./dboperation_socketio');
const dboperation_socketio = require('./dboperation_socketio');

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

http.listen(port, () => { // Use 'http' instead of 'app' to listen to the port
    console.log('app running at port: ' + port);
});




//SOCKET IO USE
io.on('connection', (socket) => {
    console.log('A user connected');
    dboperation_socketio.findStationDataSocketWName('eventFromServer',io);

    //node_cron work as a lib to set schedule work every time as  i required
    const cronJob = cron.schedule('*/2 * * * * *', () => {
        dboperation_socketio.findStationDataSocketWName('eventFromServer',io);
    });

    // Handle events from the client
    socket.on('eventFromClient', (data) => {
        console.log('Received data from client:', data);
        dboperation_socketio.findStationDataSocketWName('eventFromServer',io);
    });
    socket.on('eventFromClientDelete', (data) => {
        const stationIdToDelete = data.stationId;
        dboperation_socketio.deleteStationDataSocketWName('eventFromServer',io,stationIdToDelete)
        dboperation_socketio.findStationDataSocketWName('eventFromServer',io);
    });



    socket.on('eventFromClientAdd', (data) => {
        const machine = data.machine;
        const member =data.member;const bet=data.bet;const credit=data.credit;
        const connect=data.connect;const status=data.status;const aft=data.aft
        const lastupdate = data.lastupdate;
        dboperation_socketio.addStationDataSocketWName('eventFromServer',io,machine, member, bet, credit, connect, status, aft, lastupdate)
        dboperation_socketio.findStationDataSocketWName('eventFromServer',io);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        cronJob.stop();
    });

    
});



// // Periodically emit station data to all connected clients every 5 seconds
// setInterval(() => {
//     console.log('this is interval');
//     emitStationData(io);
// }, 5000);





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





