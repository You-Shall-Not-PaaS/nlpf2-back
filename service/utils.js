const { db, dbName} = require('../config')

async function get_town_prices(propertyType, propertyPostalCode) {
  const query = db.collection(dbName);
  const properties = await query
    .where('Code postal', '==', propertyPostalCode)
    .where('Type local', '==', propertyType)
    .get();
  const properties_doc = properties.docs.map((doc) =>
    Object.assign(doc.data(), { id: doc.id }))
  const prices = properties_doc.map(prop => {
    return prop["Valeur fonciere"]
  })
  return prices
}

module.exports = {
  get_town_prices: get_town_prices
}