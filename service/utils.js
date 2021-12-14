const _ = require('lodash')

const { db } = require('../config')
const { Op } = require('sequelize')

async function get_property_by_id(id) {
  const property = await db.findAll({
    where: {
      id : id
    }
  });
  return property[0];
}

async function get_town_prices(propertyType, propertyPostalCode) {

  const properties = await db.findAll({
    where: {
      [Op.and]: [
        { code_postal: propertyPostalCode },
        { type_local: propertyType}
      ]
    }
  });

  let prices = [];

  for (let i = 0; i < properties.length; i++) {
    prices.push(_.round(properties[i].valeur_fonciere / properties[i].surface_reelle_bati, 0));
  }
  

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
    if (doc[k].surface_reelle_bati <= max_built_surface
      && doc[k].surface_reelle_bati >= min_built_surface) {
      if (doc[k].valeur_fonciere <= max_price
        && doc[k].valeur_fonciere >= min_price) {
        if (doc[k].nombre_pieces_principales >= min_rooms
          && doc[k].nombre_pieces_principales <= max_rooms) {
          result.push(doc[k])
        }
      }
    }
    if (result.length === 20) {
      return result;
    }
  }
  return result
}

module.exports = {
  get_property_by_id: get_property_by_id,
  get_town_prices: get_town_prices,
  sort_properties: sort_properties
}