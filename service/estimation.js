const _ = require('lodash');

const Response = require('../utils/response');
const logger = require("../utils/logger");
const { db, dbName } = require('../config');
const { Op } = require('sequelize')

async function get_estimation(req, res) {
    try {

        var property = {};
        property.commune = req.params.commune;
        property.type = req.params.type;
        property.surface = parseInt(req.params.surface);
        property.room = parseInt(req.params.rooms);
        property.jardin = parseInt(req.params.garden);
        

        const properties = await db.findAll({
                where: {
                    [Op.and]: [
                        {commune : property.commune},
                        {type_local: property.type}
                    ]
                }
              });

        
        
              console.log("\n tets\n")
        console.log(properties)


        var average_dic = {};
        average_dic.town = [0, 0, 1];
        average_dic.jardin = [0, 0, 2];
        average_dic.jardin_similaire = [0, 0, 4];
        average_dic.piece = [0, 0, 4];
        average_dic.surface = [0, 0, 4];
        average_dic.similaire = [0, 0, 10];

        for (var k in properties) {
            flag = 0;
            average_dic.town[1]++;
            average_dic.town[0] += properties[k]['valeur_fonciere'] / properties[k]["surface_reelle_bati"];
            jardin = properties["surface_terrain"] - properties[k]["surface_reelle_bati"];

            if (property.jardin > 0) {
                ;

                if (jardin >= (property.jardin * 0.7) && jardin <= (property.jardin * 1.3)) {
                    average_dic.jardin_similaire[0] += properties[k]['valeur_fonciere'] / properties[k]["surface_reelle_bati"];
                    average_dic.jardin_similaire[1]++;
                    average_dic.jardin[0] += properties[k]['valeur_fonciere'] / properties[k]["surface_reelle_bati"];
                    average_dic.jardin[1]++;
                    flag++;
                }
                else if (jardin > 0) {
                    average_dic.jardin[0] += properties[k]['valeur_fonciere'] / properties[k]["surface_reelle_bati"];
                    average_dic.jardin[1]++;
                }
            }
            else {
                flag++;
            }

            if ((properties[k]['nombre_pieces_principales'] >= property.room - 1) && (properties[k]['nombre_pieces_principales'] <= property.room + 1)) {
                average_dic.piece[0] += properties[k]['valeur_fonciere'] / properties[k]["surface_reelle_bati"];
                average_dic.piece[1]++;
                flag++;
            }

            if ((properties[k]["surface_reelle_bati"] >= property.surface * 0.8) && (properties[k]["surface_reelle_bati"] <= property.surface * 1.2)) {
                average_dic.surface[0] += properties[k]['valeur_fonciere'] / properties[k]["surface_reelle_bati"];
                average_dic.surface[1]++;
                flag++;
            }

            if (flag === 3) {
                average_dic.similaire[0] += properties[k]['valeur_fonciere'] / properties[k]["surface_reelle_bati"];
                average_dic.similaire[1]++;
            }
        }

        if (average_dic.town[0] === 0) {
            logger.info("Not enougth data");
            const ans = { "price": "0", "price/m2": "0", "sample_size": -1 };
            return Response.handle200Success(res, "Not enougth properties to compare", ans);
        }

        var total_weigth = 0;
        var price = 0;
        for (var k in average_dic) {
            if (average_dic[k][1] != 0) {
                price += (average_dic[k][0] / average_dic[k][1] * average_dic[k][2]);
                total_weigth += average_dic[k][2]
            }
        }
        //ponderation and inflation
        const inflation_rate = 1.001
        price = (price / total_weigth) * inflation_rate;

        const ans = { "price": (price * property.surface).toFixed(0), "price/m2": price.toFixed(0), "sample_size": average_dic.town[1] };
        logger.info("property successfully estimate");
        return Response.handle200Success(res, "Estimation complete", ans);

    } catch (error) {
        logger.error("[get_stimation](500): " + error.message);
        return Response.handle500InternalServerError(
            res,
            error.message,
            error.stack
        );
    }
}

module.exports = {
    get_estimation: get_estimation,
}