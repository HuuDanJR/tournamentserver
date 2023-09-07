const connection = require('./dbconfig_mysql');


function findStationDataSocketWName(name, io) {
  let query = `SELECT * FROM stationdata WHERE connect = 1 ORDER BY credit DESC LIMIT 10`;
  connection.query(query, function (err, result, fields) {
    if (err) {
      console.log(err);
      // Handle any error if needed
    } else {
      // Emit the result back to the client using the 'stationData' event
      // console.log(result.length);
      // console.log('*find station data*',result)
      io.emit(name, result);
    }
  });
}
// function findDataSocket(name,io) {
//     let query = `SELECT credit FROM stationdata WHERE connect = 1 ORDER BY credit DESC LIMIT 10`;
//     connection.query(query, function (err, result, fields) {
//         if (err) {
//             console.log(err);
//             // Handle any error if needed
//         } else {
//             // Emit the result back to the client using the 'stationData' event
//             // console.log(result.length);
//             // console.log('*find station data*',result)
//             const credits = result.map(item => item.credit);
//             const credits_default = [0.0, 10.0, 20.0, 30.0, 40.0, 50.0, 60.0, 70.0, 80.0, 90.0];


//             // Create the desired result format
//             const desiredResult = [credits_default,credits];
//             // console.log(desiredResult)
//             io.emit(name, desiredResult);
//         }
//     });
// }
let oldCredits = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
let example1=[41.234577922020044, 64.38432290590475, 47.75018798285104,
  11.937303150292324, 41.427926533058525, 68.06658632196081, 101.61874831295057, 32.43647135955468, 83.94904467049842,
  107.46842634250395];
function findDataSocket(name, io) {
  let query = `SELECT credit FROM stationdata WHERE connect = 1 ORDER BY credit DESC LIMIT 10`;
  connection.query(query, function (err, result, fields) {
    if (err) {
      console.log(err);
      // Handle any error if needed
    } 
    else {
      // Extract new credits from the result
      const newCredits = result.map(item => item.credit);

      // Check if the new credits are different from the old credits
      if (!areArraysEqual(oldCredits, newCredits)) {
        // Emit the result back to the client using the 'stationData' event
        io.emit(name, [oldCredits,example1, newCredits]);
        // Update oldCredits for the next run
        oldCredits = newCredits;
      }
      // io.emit(name, [oldCredits,example1, newCredits]);

    }
  });
}
function findDataSocketFull(name, io, isInit) {
  // let query = `SELECT credit, member FROM stationdata WHERE connect = 1 ORDER BY credit`;
  let query = `SELECT credit, member FROM stationdata WHERE connect = 1 ORDER BY credit DESC  LIMIT 10`;
  connection.query(query, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      const newCredits = result.map(item => parseFloat(item.credit) / 100);
      const members = result.map(item => parseInt(item.member, 10));
      let randomdata= generateGoodRandomData(5,10);
      console.log(randomdata)
      if (isInit == true) {
        io.emit(name, [members,randomdata, oldCredits, newCredits]);
      }
      if (!areArraysEqual(oldCredits, newCredits)) {
        console.log('data change')
        io.emit(name, [members, oldCredits, newCredits]);
        oldCredits = newCredits;
      }
      else {
        oldCredits = newCredits;
      }
              //  io.emit(name, [members, randomdata, newCredits]);

    }
  });
}
function generateGoodRandomData(nbRows, nbColumns) {
  const data = [];
  
  for (let i = 0; i < nbRows; i++) {
    data[i] = new Array(nbColumns).fill(0);
  }

  for (let j = 0; j < nbColumns; j++) {
    data[0][j] = j * 10.0;
  }

  for (let i = 1; i < nbRows; i++) {
    for (let j = 0; j < nbColumns; j++) {
      const calculatedValue =
        data[i - 1][j] +
        (nbColumns - j) +
        Math.random() * 20 +
        (j === 2 ? 10 : 0);
      data[i][j] = calculatedValue;
      // console.log('calculate value: ' + calculatedValue);
    }
  }
  // console.log(data);
  return data;
}





function areArraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}



//SELECT CREDIT AND NUMBER 






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

      // console.log(result);
      // Emit the result back to the client using the specified event name
      io.emit(name, result);
    }
  });
}

module.exports = {
  findStationDataSocketWName: findStationDataSocketWName,
  deleteStationDataSocketWName: deleteStationDataSocketWName,
  addStationDataSocketWName: addStationDataSocketWName,
  findDataSocket: findDataSocket,
  findDataSocketFull: findDataSocketFull,
}