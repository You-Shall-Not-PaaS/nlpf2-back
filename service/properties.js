const _ = require('lodash')

const Response = require('../utils/response')
const logger = require("../utils/logger");
const { db, page_size, dbName } = require('../config')
const { deviation, median } = require("../utils/math")
const { format_property, query_to_array } = require("../utils/formatter")
const { get_town_prices, sort_properties, get_property_by_id } = require('./utils')
const { garden, noisAndAccessibility, roomAndSize } = require("./grade/intern_grading");
const { split } = require('lodash');

async function get_paginated_properties(req, res) {
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
    response.forEach(format_property);

    logger.info('Properties successfully retrieved');
    return Response.handle200Success(res, 'Properties successfully retrieved', response);

  } catch (error) {
    logger.error("[PaginateProperties](500): " + error.message);
    return Response.handle500InternalServerError(
      res,
      error.message,
      error.stack
    );
  }
}

async function filter_properties(req, res) {
  if (Object.keys(req.query).length === 0) {
    logger.error("[FilterProperties] Request query is undefined");
    return Response.handle400BadRequest(res, "Request query is undefined");
  }

  try {
    console.log("here")
    const page = parseInt(req.params.page);
    const filter = req.query;
    var query = db.collection(dbName);
    var minmax = [];
    for (key in filter) {
      if (key === "code_postal") {
        query = query.where("Code postal", "==", filter[key]);
      } else if (key === "type_local") {
        if (filter[key] != "Autre") {
          query = query.where("Type local", "==", filter[key]);
        } else {
          minmax[key] = filter[key];
        }
      } else if (key === "cities") {
        communes = query_to_array(filter[key]);
        query = query.where("Commune", "in", communes);
      } else {
        minmax[key] = filter[key];
      }
    }

    const properties = await query.limit(10000).get();
    const dict_properties = properties.docs.map((doc) =>
      Object.assign(doc.data(), { id: doc.id })
    );
    var filter_properties = [];
    var count = 0;

    for (i = 0; i < Object.keys(dict_properties).length; i++) {
      property = dict_properties[i];
      respect_filter = true;
      for (const key in minmax) {
        if (
          key === "maxPrice" &&
          parseInt(minmax[key]) <= property["Valeur fonciere"]
        ) {
          respect_filter = false;
          break;
        }
        if (
          key === "minPrice" &&
          parseInt(minmax[key]) >= property["Valeur fonciere"]
        ) {
          respect_filter = false;
          break;
        }
        if (
          key === "maxSize" &&
          parseInt(minmax[key]) <= property["Surface reelle bati"]
        ) {
          respect_filter = false;
          break;
        }
        if (
          key === "minSize" &&
          parseInt(minmax[key]) >= property["Surface reelle bati"]
        ) {
          respect_filter = false;
          break;
        }
        if (
          key === "maxRooms" &&
          parseInt(minmax[key]) <= property["Nombre pieces principales"]
        ) {
          respect_filter = false;
          break;
        }
        if (
          key === "minRooms" &&
          parseInt(minmax[key]) >= property["Nombre pieces principales"]
        ) {
          respect_filter = false;
          break;
        }
        if (
          key === "type_local" &&
          (property["Type local"] === "Maison" ||
            property["Type local"] === "Appartement")
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

    filter_properties.forEach(format_property);

    logger.info('Properties successfully retrieved')
    return Response.handle200Success(res, 'Properties successfully filtered', filter_properties)
  } catch (error) {
    logger.error("[FilterProperties](500): " + error.message);
    return Response.handle500InternalServerError(
      res,
      error.message,
      error.stack
    );
  }
}

async function get_average_price(req, res) {
  try {
    const id = parseInt(req.params.id);
    const property = await get_property_by_id(id)
    const propertyType = property["Type local"]
    const propertyPostalCode = property["Code postal"]
    const prices_array = await get_town_prices(propertyType, propertyPostalCode)
    const mean = _.mean(prices_array)
    const average_price = _.round(mean, 0)
    const standard_deviation = _.round(deviation(prices_array), 0)
    const median_price = median(prices_array)
    const body = {
      average_price: average_price,
      standard_deviation: standard_deviation,
      median_price: median_price,
      sample_size: prices_array.length
    }

    logger.info('Town average properties price successfully retrieved')
    return Response.handle200Success(res, 'Town average properties price successfully retrieved', body)
  } catch (error) {
    logger.error("[GetAveragePrice](500): " + error.message);
    return Response.handle500InternalServerError(
      res,
      error.message,
      error.stack
    );
  }
}

async function get_similar_properties(req, res) {
  try {
    const id = parseInt(req.params.id);
    const property = await get_property_by_id(id)
    const propertyType = property["Type local"]
    const propertyCountyCode = property["Code departement"]
    const propertyValue = parseFloat(property["Valeur fonciere"])
    const propertyBuiltSurface = parseFloat(property["Surface reelle bati"])
    const propertyTotalSurface = parseFloat(property["Surface terrain"])
    const propertyRoomsNumber = parseFloat(property["Nombre pieces principales"])
    const query = db.collection(dbName);
    const properties = await query
      .where('Code departement', '==', propertyCountyCode)
      .where('Type local', '==', propertyType)
      .get();
    const property_doc = properties.docs.map((doc) =>
      Object.assign(doc.data(), { id: doc.id }))
    const filter_body = {
      builtSurface: propertyBuiltSurface,
      totalSurface: propertyTotalSurface,
      roomsNumber: propertyRoomsNumber,
      value: propertyValue
    }
    const filtered_properties = sort_properties(property_doc, filter_body)
    logger.info('Similar properties successfully retrieved')
    return Response.handle200Success(res, 'Similar properties successfully retrieved', filtered_properties)
  } catch (error) {
    logger.error('[GetSimilarProperties](500): ' + error.message);
    return Response.handle500InternalServerError(res, error.message, error.stack)
  }
}

async function get_grade(req, res) {
  try {
    var grade_dic = { grade: 5, tag: "" };
    const id = parseInt(req.params["id"]);

    const query = await db.collection(dbName).where("id", "==", id).get();

    try {
      property = query.docs.map((doc) =>
        Object.assign(doc.data(), { id: doc.id })
      )[0];
    } catch (error) {
      Logger.error("Property not found");
      return Response.handle400BadRequest(res, "Property not found");
    }

    grade_dic = garden(property, grade_dic);
    grade_dic = noisAndAccessibility(property, grade_dic);
    grade_dic = roomAndSize(property, grade_dic);

    if (grade_dic.tag != "") {
        grade_dic.tag = grade_dic.tag.slice(0,-1);
    }

    if (grade_dic["grade"] > 10) {
      grade_dic["grade"] = 10;
    }

    grade_dic.grade = grade_dic.grade.toFixed(1);

    logger.info("Property succefully grade");
    return Response.handle200Success(
      res,
      "Property succefully graded",
      grade_dic
    );
  } catch (error) {
    logger.error("[get_grade](500): " + error.message);
    return Response.handle500InternalServerError(
      res,
      error.message,
      error.stack
    );
  }
}

module.exports = {
  get_paginated_properties: get_paginated_properties,
  filter_properties: filter_properties,
  get_average_price: get_average_price,
  get_similar_properties: get_similar_properties,
  get_grade: get_grade
};
