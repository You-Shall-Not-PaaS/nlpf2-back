const _ = require('lodash')

const Response = require('../utils/response')
const logger = require("../utils/logger");
const { db, page_size } = require('../config')
const { deviation, median } = require("../utils/math")
const { format_property, query_to_array, query_to_array_string } = require("../utils/formatter")
const { get_town_prices, sort_properties, get_property_by_id } = require('./utils')
const { garden, noisAndAccessibility, roomAndSize } = require("./grade/intern_grading");
const { split } = require('lodash');
const { Op } = require('sequelize')

async function get_paginated_properties(req, res) {
  try {

    const page = parseInt(req.params.page);
    const properties = await db.findAll({offset:page_size * page ,limit: page_size * (page + 1)})

    logger.info('Properties successfully retrieved');
    return Response.handle200Success(res, 'Properties successfully retrieved',properties);

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
    console.log("test")
    const page = parseInt(req.params.page);
    const filter = req.query;
    var query =
      "db.findAll({offset:page_size * page ,limit: page_size * (page + 1), where: { [Op.and]: [ ";
    var minmax = [];
    for (key in filter) {
      if (key === "cities") {
        communes = query_to_array_string(filter[key]);
        query += "{ commune : " + communes + "}, ";
      } else if (key === "type_local") {
        if (filter[key] != "Autre") {
          query += "{ type_local: " + filter[key] + "}, ";
        } else {
          query += '{ type_local: { [Op.notIn]: [ "Maison", "Appartement"]}}, ';
        }
      } else if (key === "maxPrice") {
        query += "{ valeur_fonciere: { [Op.lte]: " + filter[key] + "}}, ";
      } else if (key === "minPrice") {
        query += "{ valeur_fonciere: { [Op.gte]: " + filter[key] + "}}, ";
      } else if (key === "maxSize") {
        query += "{ surface_reelle_bati: { [Op.lte]: " + filter[key] + "}}, ";
      } else if (key === "minSize") {
        query += "{ surface_reelle_bati: { [Op.gte]: " + filter[key] + "}}, ";
      } else if (key === "maxRooms") {
        query +=
          "{ nombre_pieces_principales: { [Op.lte]: " + filter[key] + "}}, ";
      } else if (key === "minRooms") {
        query +=
          "{ nombre_pieces_principales: { [Op.gte]: " + filter[key] + "}}, ";
      }
    }

    query += "]}})";

    console.log("\n\n\n\n\n\n\n");
    console.log(query);
    console.log("\n\n\n\n\n\n\n");
    filter_properties = await eval(query);

    logger.info("Properties successfully retrieved");
    return Response.handle200Success(
      res,
      "Properties successfully filtered",
      filter_properties
    );
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
    const propertyType = property.type_local
    const propertyPostalCode = property.code_postal
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
    };

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
    const propertyType = property.type_local
    const propertyCountyCode = property.code_departement
    const propertyValue = parseFloat(property.valeur_fonciere)
    const propertyBuiltSurface = parseFloat(property.surface_reelle_bati)
    const propertyTotalSurface = parseFloat(property.surface_terrain)
    const propertyRoomsNumber = parseFloat(property.nombre_pieces_principales)
    
    const min_rooms = propertyRoomsNumber > 0 ? propertyRoomsNumber - 1 : 0
    const max_rooms = propertyRoomsNumber + 2

    const min_price = _.round(propertyValue * 0.8, 0)
    const max_price = _.round(propertyValue * 1.2, 0)

    const min_built_surface = _.round(propertyBuiltSurface * 0.8, 0)
    const max_built_surface = _.round(propertyBuiltSurface * 1.2, 0)


    const properties = await db.findAll({
      limit: 20,
      where: {
        [Op.and]: [
          { code_departement: propertyCountyCode },
          { type_local: propertyType },
          { valeur_fonciere: {[Op.between]: [min_price, max_price]}},
          { surface_reelle_bati: {[Op.between]: [min_built_surface, max_built_surface]}},
          { nombre_pieces_principales: {[Op.between]: [min_rooms, max_rooms]}},
      ]
    }
  })
    logger.info('Similar properties successfully retrieved')
    return Response.handle200Success(res, 'Similar properties successfully retrieved', properties)
  } catch (error) {
    logger.error('[GetSimilarProperties](500): ' + error.message);
    return Response.handle500InternalServerError(res, error.message, error.stack)
  }
}

async function get_grade(req, res) {
  try {
    var grade_dic = { grade: 5, tag: "" };
    const id = parseInt(req.params["id"]);

    const property = await get_property_by_id(id)

    if (!property) {
      logger.error("Property not found");
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
