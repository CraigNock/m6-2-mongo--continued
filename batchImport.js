const { MongoClient } = require('mongodb');
const fs = require('file-system');
const assert = require('assert');


const batchImport = async () => {
  const seats = [];
  const row = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  for (let r = 0; r < row.length; r++) {
    for (let s = 1; s < 13; s++) {
      seats.push( {
        _id: `${row[r]}-${s}`,
        price: 225,
        isBooked: false,
      });
    }
  }

  console.log('seats', seats);

  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });

  try {
    client.connect();
    console.log('connecto');

    const db = client.db('ticketwidget')
    const r = await db.collection('seats').insertMany(seats);
    assert.equal(seats.length, r.insertedCount);
    console.log('donezos');

  } catch (err) { 
    console.log('err', err);
  }

  client.close();
  console.log('disconnecto');
};


