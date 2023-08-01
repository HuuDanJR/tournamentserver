const connection = require('./dbconfig_mysql');
//table : betnumber,setting,stationdata

async function findBetNumber( callback) {
    let query = `SELECT * FROM betnumber`;
    try {
        await connection.getConnection(function (err, conn) {
            if(err){
                console.log(`getConnection error : ${err}`)
            }
            connection.query(query, function (err, result,fields) {
                if (err)(
                    console.log(err)
                );
                // console.log(result);
                callback(err, result)
            });
            conn.release();
        })
       
    } catch (error) {
        console.log(`An error orcur findFrameDateCustomer: ${error}`);
    }
}


async function findStationData( callback) {
    // let query = `SELECT * FROM stationdata`;
   let query = `SELECT * FROM stationdata ORDER BY bet DESC, credit DESC`;

    try {
        await connection.getConnection(function (err, conn) {
            if(err){
                console.log(`getConnection error : ${err}`)
            }
            connection.query(query, function (err, result,fields) {
                if (err)(
                    console.log(err)
                );
                // console.log(result);
                callback(err, result)
            });
            conn.release();
        })
       
    } catch (error) {
        console.log(`An error orcur findFrameDateCustomer: ${error}`);
    }
}


async function addStationData(machine, member, bet, credit, connect, status, aft, lastupdate,callback ) {
    const query = `INSERT INTO stationdata (machine, member, bet, credit, connect, status, aft, lastupdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [machine, member, bet, credit, connect, status, aft, lastupdate];
    try {
        await connection.getConnection(function (err, conn) {
            if(err){
                console.log(`getConnection error : ${err}`)
            }
            connection.query(query,values, function (err, result,fields) {
                if (err)(
                    console.log(err)
                );
                callback(err, result)
            });
            conn.release();
        })
       
    } catch (error) {
        console.log(`An error orcur findFrameDateCustomer: ${error}`);
    }
  }


async function deleteStationData(ip, callback){
    const query = `DELETE FROM stationdata WHERE ip = ?`;
    try {
        await connection.getConnection(function (err, conn) {
          if (err) {
            console.log(`getConnection error: ${err}`);
            callback(err, null);
            return;
          }
    
          connection.query(query, [ip], function (err, result) {
            conn.release();
    
            if (err) {
              console.log(err);
              callback(err, null);
              return;
            }
    
            callback(null, result);
          });
        });
      } catch (error) {
        console.log(`An error occurred in deleteStationData: ${error}`);
        callback(error, null);
      }
}

 



module.exports = {
    findBetNumber: findBetNumber,
    findStationData:findStationData,
    addStationData:addStationData,
    deleteStationData:deleteStationData,
}