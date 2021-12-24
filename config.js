const fireBase = require("firebase-admin");
const { Sequelize, DataTypes, Model } = require('sequelize');
// const configFileName = "./key.json"
// const serviceAccount = require(configFileName);

/*
fireBase.initializeApp({
  credential: fireBase.credential.cert(serviceAccount),
});
*/

const db = ""; // fireBase.firestore();
const dbName = "valeurs-foncieres"
const page_size = 30

//deploiment soar
/*var sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});
*/

//deploiment test local

var sequelize = new Sequelize("postgresql://postgres:nlpf@localhost:5432/postgres")

const Properties = sequelize.define('property', {
  id :{
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  no_disposition :{
    type: DataTypes.STRING
  },
  date_mutation :{
    type: DataTypes.STRING
  },
  nature_mutation :{
    type: DataTypes.STRING
  },
  valeur_fonciere :{
    type: DataTypes.INTEGER
  },
  type_de_voie :{
    type: DataTypes.STRING
  },
  code_voie :{
    type: DataTypes.STRING
  },
  voie :{
    type: DataTypes.STRING
  },
  code_postal :{
    type: DataTypes.STRING
  },
  commune :{
    type: DataTypes.STRING
  },
  code_departement :{
    type: DataTypes.STRING
  },
  code_commune :{
    type: DataTypes.STRING
  },
  section :{
    type: DataTypes.STRING
  },
  no_plan :{
    type: DataTypes.STRING
  },
  premier_lot:{
    type: DataTypes.STRING
  },
  nombre_de_lots :{
    type: DataTypes.STRING
  },
  code_type_local :{
    type: DataTypes.STRING
  },
  type_local :{
    type: DataTypes.STRING
  },
  surface_reelle_bati :{
    type: DataTypes.FLOAT
  },
  nombre_pieces_principales :{
    type: DataTypes.INTEGER
  },
  nature_culture :{
    type: DataTypes.STRING
  },
  surface_terrain :{
    type: DataTypes.FLOAT
  }
},
  {
    tableName: 'properties',
    timestamps: false
  },
);



module.exports = {
  db: Properties,
  page_size: page_size,
}
