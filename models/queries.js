const MongoClient = require('mongodb').MongoClient;

async function updateCollection() {
  const uri = 'mongodb+srv://acses:acses@evotingdb.dtgqsqi.mongodb.net/?retryWrites=true&w=majority&appName=eVotingDB';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('test');
    const collection = database.collection('users');

    await collection.updateMany(
      {},
      [
        { $set: { isAdmin: false, isAuditor: false } }
      ]
    );

    console.log('Fields added successfully');
  } catch (error) {
    console.error('Error updating collection:', error);
  } finally {
    await client.close();
  }
}


async function insertSiteMode() {
  const uri = 'mongodb+srv://acses:acses@evotingdb.dtgqsqi.mongodb.net/?retryWrites=true&w=majority&appName=eVotingDB';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('test');
    const collection = database.collection('admins');

    await collection.insertOne(
      {
        siteMode: "Default",
      }
    );

    console.log('Site Mode added successfully');
  } catch (error) {
    console.error('Error inserting site mode:', error);
  } finally {
    await client.close();
  }
}

insertSiteMode();
// updateCollection();