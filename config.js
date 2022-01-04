const { Sequelize, DataTypes, Model } = require('sequelize');
require('dotenv').config();

const page_size = 30

const database = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST || 'localhost';
const user = process.env.DB_USER;


//deploiment soar
var sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: 'postgres',
  dialectOptions: {
    // e.g. socketPath: '/cloudsql/my-awesome-project:us-central1:my-cloud-sql-instance'
    // same as host string above
    socketPath: host
  },
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});


//deploiment test local

//var sequelize = new Sequelize(process.env.DB_URL)

const Properties = sequelize.define('property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  no_disposition: {
    type: DataTypes.STRING
  },
  date_mutation: {
    type: DataTypes.STRING
  },
  nature_mutation: {
    type: DataTypes.STRING
  },
  valeur_fonciere: {
    type: DataTypes.INTEGER
  },
  type_de_voie: {
    type: DataTypes.STRING
  },
  code_voie: {
    type: DataTypes.STRING
  },
  voie: {
    type: DataTypes.STRING
  },
  code_postal: {
    type: DataTypes.STRING
  },
  commune: {
    type: DataTypes.STRING
  },
  code_departement: {
    type: DataTypes.STRING
  },
  code_commune: {
    type: DataTypes.STRING
  },
  section: {
    type: DataTypes.STRING
  },
  no_plan: {
    type: DataTypes.STRING
  },
  premier_lot: {
    type: DataTypes.STRING
  },
  nombre_de_lots: {
    type: DataTypes.STRING
  },
  code_type_local: {
    type: DataTypes.STRING
  },
  type_local: {
    type: DataTypes.STRING
  },
  surface_reelle_bati: {
    type: DataTypes.FLOAT
  },
  nombre_pieces_principales: {
    type: DataTypes.INTEGER
  },
  nature_culture: {
    type: DataTypes.STRING
  },
  surface_terrain: {
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
