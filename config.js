const fireBase = require("firebase-admin");

const configFileName = "./key.json"
const serviceAccount = require(configFileName);

fireBase.initializeApp({
  credential: fireBase.credential.cert(serviceAccount),
});

const db = fireBase.firestore();
const dbName = "valeurs-foncieres"
const page_size = 30


module.exports = {
  db: db,
  page_size: page_size,
  dbName: dbName
}