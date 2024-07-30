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

// function to insert associations
async function insertAssociations() {
  const uri = 'mongodb+srv://acses:acses@evotingdb.dtgqsqi.mongodb.net/?retryWrites=true&w=majority&appName=eVotingDB';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('test');
    const collection = database.collection('associations');

    await collection.insertOne(
      {
        name: "acses",
        votingStatus: false,
        portfolio: [
          "President",
          "Secretary",
          "Financial Secretary",
          "PRO",
          "Project Manager",
          "Sports Chairman",
        ],
      }
    );
    await collection.insertOne(
      {
        name: "mesa",
        votingStatus: false,
        portfolio: [
          "President",
          "Secretary",
          "Financial Secretary",
          "PRO",
          "Project Manager",
          "Sports Chairman",
          "Vice President",
        ],
      }
    );
    await collection.insertOne(
      {
        name: "adges",
        votingStatus: false,
        portfolio: [
          "President",
          "Secretary",
          "Financial Secretary",
          "PRO",
          "Project Manager",
          "Sports Chairman",
        ],
      }
    );
    await collection.insertOne(
      {
        name: "eleesa",
        votingStatus: false,
        portfolio: [
          "President",
          "Secretary",
          "Financial Secretary",
          "PRO",
          "Project Manager",
          "Sports Chairman",
        ],
      }
    );
    await collection.insertOne(
      {
        name: "gesa",
        votingStatus: false,
        portfolio: [
          "President",
          "Secretary",
          "Financial Secretary",
          "PRO",
          "Project Manager",
          "Sports Chairman",
        ],
      }
    );

    console.log('Associations added successfully');
  } catch (error) {
    console.error('Error inserting associations:', error);
  } finally {
    await client.close();
  }
}

insertAssociations();
//insertSiteMode();
// updateCollection();