const connection = require('./dbconfig_mysql');


function findStationDataSocketWName(name,io) {
    let query = `SELECT * FROM stationdata WHERE connect = 1 ORDER BY credit DESC LIMIT 10`;
    connection.query(query, function (err, result, fields) {
        if (err) {
            console.log(err);
            // Handle any error if needed
        } else {
            // Emit the result back to the client using the 'stationData' event
            // console.log(result.length);
            console.log('*find station data*')
            io.emit(name, result);
        }
    });
}

function deleteStationDataSocketWName(name, io, ip) {
    let query = `DELETE FROM stationdata WHERE ip = ?`;
    connection.query(query, [ip], function (err, result, fields) {
      if (err) {
        console.log(err);
        // Handle any error if needed
      } else {
        console.log(result);
        // Emit the result back to the client using the specified event name
        io.emit(name, result);
      }
    });
  }




function addStationDataSocketWName(name, io, machine, member, bet, credit, connect, status, aft, lastupdate) {
    const query = `INSERT INTO stationdata (machine, member, bet, credit, connect, status, aft, lastupdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [machine, member, bet, credit, connect, status, aft, lastupdate];
    connection.query(query, values, function (err, result, fields) {
      if (err) {
        console.log(err);
        // Handle any error if needed
      } else {

        console.log(result);
        // Emit the result back to the client using the specified event name
        io.emit(name, result);
      }
    });
  }

module.exports = {
    findStationDataSocketWName:findStationDataSocketWName,
    deleteStationDataSocketWName:deleteStationDataSocketWName,
    addStationDataSocketWName:addStationDataSocketWName
}