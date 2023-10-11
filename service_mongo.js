const express = require('express');
const router = express.Router();
const rankingModel = require('./model/ranking');


router.route('/list_ranking').get(async (req, res) => {
  try {
    const data = await rankingModel.find().exec();

    if (data == null || data.length === 0) {
      res.status(404).json({
        status: false,
        message: 'No rankings found',
        totalResult: null,
        data: data,
      });
    } else {
      res.status(200).json({
        status: true,
        message: 'List rankings retrieved successfully',
        totalResult: data.length,
        data: data,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: 'An error occurred while retrieving rankings',
      error: err.message,
    });
  }
});




router.route('/add_ranking').post(async (req, res) => {
    try {
      // Get the data from the request body
      const { customer_name, customer_number, point,id } = req.body;
  
      // Create a new ranking record
      const newRanking = new rankingModel({
        customer_name: customer_name,
        customer_number: customer_number,
        point: point,
        id:id
      });
  
      // Save the new ranking record to the database
      const savedRanking = await newRanking.save();
  
      res.status(201).json({
        status: true,
        message: 'Ranking record added successfully',
        data: savedRanking,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: 'An error occurred while adding the ranking record',
        error: error.message,
      });
    }
  });
  
  
  
  
  
  




module.exports = router;