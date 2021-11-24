const { db, dbName } = require('../config')

async function get_town_prices(propertyType, propertyPostalCode) {
  const query = db.collection(dbName);
  const properties = await query
    .where('Code postal', '==', propertyPostalCode)
    .where('Type local', '==', propertyType)
    .get();
  const properties_doc = properties.docs.map((doc) =>
    Object.assign(doc.data(), { id: doc.id }))
  const prices = properties_doc.map(prop => {
    return prop["Valeur fonciere"]/prop["Surface reelle bati"];
  })
  return prices
}

function sort_properties(doc, filter) {
  // 20% price gap
  const min_price = filter.value * 0.8
  const max_price = filter.value * 1.2

  // 20% price gap
  const min_built_surface = filter.builtSurface * 0.8
  const max_built_surface = filter.builtSurface * 1.2

  const min_rooms = filter.roomsNumber > 0 ? filter.roomsNumber - 1 : 0
  const max_rooms = filter.roomsNumber + 2

  var result = []
  for (var k in doc) {
    if (doc[k]['Surface reelle bati'] <= max_built_surface
      && doc[k]['Surface reelle bati'] >= min_built_surface) {
      if (doc[k]['Valeur fonciere'] <= max_price
        && doc[k]['Valeur fonciere'] >= min_price) {
        if (doc[k]['Nombre pieces principales'] >= min_rooms
          && doc[k]['Nombre pieces principales'] <= max_rooms) {
          result.push(doc[k])
        }
      }
    }
  }
  return result
}
module.exports = {
  get_town_prices: get_town_prices,
  sort_properties: sort_properties
}