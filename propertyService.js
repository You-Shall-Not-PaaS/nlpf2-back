const fireBase = require("firebase-admin");
const _ = require('lodash')

const Response = require('./utils/response')
const logger = require("./utils/logger");
const configFileName = "./key.json"
const serviceAccount = require(configFileName);

fireBase.initializeApp({
  credential: fireBase.credential.cert(serviceAccount),
});

const db = fireBase.firestore();
const dbName = "valeurs-foncieres"
const page_size = 30

async function get_paginated_property(req, res) {
  try {
    const page = parseInt(req.params.page);
    const query = db.collection(dbName);
    const properties = await query
      .orderBy("id")
      .startAt(page * page_size)
      .endAt((page + 1) * page_size)
      .get();

    const response = properties.docs.map((doc) =>
      Object.assign(doc.data(), { id: doc.id })
    );
    logger.info('Properties succesfully retrieved')
    return Response.handle200Success(res, 'Properties succesfully retrieved', response)

  } catch (error) {
    logger.error('[PaginateProperties](500): ' + error.message);
    return Response.handle500InternalServerError(res, error.message, error.stack)
  }
}

async function filter_properties(req, res) {
  if (Object.keys(req.query).length === 0) {
    logger.error('[FilterProperties] Request query is undefined')
    return Response.handle400BadRequest(res, 'Request query is undefined')
  }

  try {
    const page = parseInt(req.params.page);
    const filter = req.query;

    var query = 'db.collection(dbName)';
    var minmax = [];
    for (key in filter) {
      if (key === "code_postal") {
        query =
          query +
          ".where(" +
          '"Code postal"' +
          ',"==",' +
          '"' +
          filter[key] +
          '"' +
          ")";
      } else if (key === "type_local") {
        if (filter[key] === "Autre") {
          query =
            query +
            ".where(" +
            '"Type local"' +
            ',"not-in",' +
            '["Maison", "Appartement"]' +
            ")";
        } else {
          query =
            query +
            ".where(" +
            '"Type local"' +
            ',"==",' +
            '"' +
            filter[key] +
            '"' +
            ")";
        }
      } else if (key === "commune") {
        query =
          query +
          ".where(" +
          '"Commune"' +
          ',"==",' +
          '"' +
          filter[key] +
          '"' +
          ")";
      } else {
        minmax[key] = filter[key]
      }
    }

    query = query + ".get();";

    const properties = await eval(query);
    const dict_properties = properties.docs.map((doc) =>
      Object.assign(doc.data(), { id: doc.id })
    );
    var filter_properties = [];
    var count = 0;

    for (i = 0; i < Object.keys(dict_properties).length; i++) {
      property = dict_properties[i];
      respect_filter = true;

      for (const key in minmax) {
        if (key === "maxprice" && minmax[key] <= property["Valeur fonciere"]) {
          respect_filter = false;
          break;
        }
        if (key === "minprice" && minmax[key] >= property["Valeur fonciere"]) {
          respect_filter = false;
          break;
        }
        if (
          key === "maxsize" &&
          minmax[key] <= property["Surface reelle bati"]
        ) {
          respect_filter = false;
          break;
        }
        if (
          key === "minsize" &&
          minmax[key] >= property["Surface reelle bati"]
        ) {
          respect_filter = false;
          break;
        }
        if (
          key === "maxpiece" &&
          minmax[key] <= property["Nombre pieces principales"]
        ) {
          respect_filter = false;
          break;
        }
        if (
          key === "minpiece" &&
          minmax[key] >= property["Nombre pieces principales"]
        ) {
          respect_filter = false;
          break;
        }
      }

      if (respect_filter) {
        if (page * page_size <= count) {
          if ((page + 1) * page_size >= count) {
            filter_properties.push(property);
          } else {
            break;
          }
        }
        count++;
      }
    }
    logger.info('Properties succesfully retrieved')
    return Response.handle200Success(res, 'Properties succesfully filtered', filter_properties)
  } catch (error) {
    logger.error('[FilterProperties](500): ' + error.message);
    return Response.handle500InternalServerError(res, error.message, error.stack)
  }
}

async function get_average_price(req, res) {
  try {
    const id = parseInt(req.params.id);
    const query = db.collection(dbName);
    const property = await query
      .where('id', '==', id)
      .get();
    const property_doc = property.docs.map((doc) =>
      Object.assign(doc.data(), { id: doc.id }))

    const propertyType = property_doc[0]["Type local"]
    const propertyPostalCode = property_doc[0]["Code postal"]
    const prices_array = await get_prices(propertyType, propertyPostalCode)
    const mean = _.mean(prices_array)
    const average_price = _.round(mean, 0)

    return Response.handle200Success(res, 'Town average properties price succesfully retrieved', average_price)
  } catch (error) {
    logger.error('[GetAveragePrice](500): ' + error.message);
    return Response.handle500InternalServerError(res, error.message, error.stack)
  }
}

async function get_prices(propertyType, propertyPostalCode) {
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
  get_paginated_property: get_paginated_property,
  filter_properties: filter_properties,
  get_average_price: get_average_price
};
