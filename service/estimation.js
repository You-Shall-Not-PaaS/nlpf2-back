const _ = require('lodash');

const Response = require('../utils/response');
const logger = require("../utils/logger");
const { db, page_size, dbName } = require('../config');
const { get_town_prices, sort_properties, get_property_by_id } = require('./utils');

/*body:
{
    room: int,
    surface: int,
    jardin: int,
    commune: string,
    type: string,
}
*/

async function get_estimation(req, res) {

    try {
        
        var property = {};
        property.commune = req.params.commune;
        property.type = req.params.type;
        property.surface = parseInt(req.params.surface);
        property.room = parseInt(req.params.rooms);
        property.jardin = parseInt(req.params.garden);

        const query = db.collection(dbName);
        const properties = await query
          .where('Commune', '==', property.commune)
          .where('Type local', '==', property.type)
          .get();
        
        const property_doc = properties.docs.map((doc) =>
        Object.assign(doc.data(), { id: doc.id }))
        
        var average_dic = {};
        average_dic.town = [0, 0, 1];  
        average_dic.jardin = [0, 0, 2];
        average_dic.jardin_similaire = [0, 0 , 4];  
        average_dic.piece = [0, 0, 4];
        average_dic.surface = [0, 0 , 4];
        average_dic.similaire = [0, 0, 10];

        for (var k in property_doc) {
            flag = 0;
            average_dic.town[1]++;
            average_dic.town[0] += property_doc[k]['Valeur fonciere'] / property_doc[k]["Surface reelle bati"];
            jardin = property_doc[k]["Surface terrain"] - property_doc[k]["Surface reelle bati"];

            if (property.jardin > 0) {
;
            
                if (jardin >= (property.jardin * 0.7) && jardin <= (property.jardin * 1.3)) {
                    average_dic.jardin_similaire[0] += property_doc[k]['Valeur fonciere'] / property_doc[k]["Surface reelle bati"];
                    average_dic.jardin_similaire[1]++;
                    average_dic.jardin[0] += property_doc[k]['Valeur fonciere'] / property_doc[k]["Surface reelle bati"];
                    average_dic.jardin[1]++;
                    flag++;
                }
                else if  (jardin > 0) {
                    average_dic.jardin[0] += property_doc[k]['Valeur fonciere'] / property_doc[k]["Surface reelle bati"];
                    average_dic.jardin[1]++;
                }
            }
            else {
                flag++;
            }

            if ((property_doc[k]['Nombre pieces principales'] >= property.room - 1) && (property_doc[k]['Nombre pieces principales'] <= property.room + 1)) {
                average_dic.piece[0] += property_doc[k]['Valeur fonciere'] / property_doc[k]["Surface reelle bati"];
                average_dic.piece[1]++;
                flag++;
            }

            if ((property_doc[k]['Surface reelle bati'] >= property.surface * 0.8) && (property_doc[k]['Surface reelle bati'] <= property.surface * 1.2)) {
                average_dic.surface[0] += property_doc[k]['Valeur fonciere'] / property_doc[k]["Surface reelle bati"];
                average_dic.surface[1]++;
                flag++;
            }

            if (flag === 3) {
                average_dic.similaire[0] += property_doc[k]['Valeur fonciere'] / property_doc[k]["Surface reelle bati"];
                average_dic.similaire[1]++;
            }
        }

        if (average_dic.town[0] === 0) {
            logger.info("Not enougth data");
            return Response.handle200Success(res, "Not enougth property to compare")
        }

        var total_weigth = 0;
        var price = 0;
        for (var k in average_dic) {
            if (average_dic[k][1] != 0) {
                price += (average_dic[k][0]/average_dic[k][1] * average_dic[k][2]);
                total_weigth += average_dic[k][2]
            }
        }
        //ponderation and inflation
        price = (price / total_weigth) * 1.001;

        ans = {"price": price * property.surface, "price/m2": price, "sample_size": average_dic.town[1]};
        logger.info("property successfully estimate");
        return Response.handle200Success(res, "Estimation complete", ans);

    } catch(error) {
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