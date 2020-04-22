'use strict';
const { MongoClient } = require('mongodb');
const assert = require('assert');

const arrayToObject = (array) => {
  let object = {};
  array.forEach(item => {
    object[item._id] = {price: item.price, isBooked: item.isBooked};
  });
  // console.log('object', object);
  return object;
}

const getSeats = async (req, res) => {
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try{
    await client.connect();
    console.log('connecto');

    const db = client.db('ticketwidget');
    db.collection('seats')
      .find()
      .toArray((err, result) => {
      // console.log('result', result);
      const seats = arrayToObject(result);
      res.status(200).json({
        seats: seats,
        numOfRows: 8,
        seatsPerRow: 12,
      });
      client.close();
      console.log('disconnecto');
    })
  } catch (err) {
    console.log('error', err);
  };
};

const bookSeat = async (req, res) => {
  console.log('req.body', req.body);
  const { seatId, creditCard, expiration, fullName, email } = req.body;
  console.log('seatId', seatId);
  if (!creditCard || !expiration) {
    return res.status(400).json({
      status: 400,
      message: 'Please provide credit card information!',
    });
  };

  const query = { _id: seatId };
  const newValues = { $set: { isBooked: true } };
  const client = new MongoClient('mongodb://localhost:27017', 
    {
      useUnifiedTopology: true,
  });
  try {
    await client.connect();
    console.log('connecto');
    const db = client.db('ticketwidget');
    //update seat info
    const r = await db.collection('seats').updateOne(query, newValues);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);
    // add user to db
    const rr = await db.collection('users').insertOne({ _id: seatId, fullName, email });
    assert.equal(1, rr.insertedCount);

    res.status(200).json({
      status: 200,
      success: true,
    });
  } catch (err) {
    console.log('err', err);
    res.status(400).json({
      status: 400,
      error: err.message,
    })
  };

};

const removeBooking = async (req, res) => {
  // delete users entry
  // update seat to isBooked: false
};

const updateUser = async (req, res) => {
  // determine if send in new name or new email, filter out neither
  // update users entry accordingly
};



module.exports = { getSeats, bookSeat };
