const fireBase = require("firebase-admin");

const serviceAccount = require("./key.json");

fireBase.initializeApp({
  credential: fireBase.credential.cert(serviceAccount),
});

const db = fireBase.firestore();

async function get_paginated_property(page_size, page) {
  const query = db.collection("valeurs-foncieres");
  properties = await query
    .orderBy("id")
    .startAt(page * page_size)
    .endAt(page * (page_size + 1))
    .get();

  //console.log(properties.docs.map(doc => Object.assign(doc.data(), {id: doc.id})));
  return properties.docs.map(doc => Object.assign(doc.data(), {id: doc.id}));
}

async function property_filter(page_size, page, filter) {

    query = "db.collection(\"valeurs-foncieres\")";

    for (const key in filter) {
      if (key === "code_postal" || key === "type_local" || key === "commune") {
        query = query + ".where(" + "\"" + key + "\"" +  ",\"==\"," + "\"" + filter[key] + "\"" + ")";
      } else if (key === "maxprice") {
        query = query + ".where(" + "\"valeur_fonciere\"" +  ", \"<=\"," + "\"" + filter[key] + "\"" + ")";
      } else if (key === "maxsize") {
        query = query + ".where(" + "surface_reelle_bati" +  ", \"<=\"," + "\"" + filter[key] + "\"" + ")";
      } else if (key === "minprice") {
        query = query + ".where(" + "valeur_fonciere" +  ", \">=\"," + "\"" + filter[key] + "\"" + ")";
      } else if (key === "minsize") {
        query = query + ".where(" + "surface_reelle_bati" +  ", \">=\"," + "\"" + filter[key] + "\"" + ")";
      }
      else if (key === "maxpiece") {
        query = query + ".where(" + "nombre_pieces_principales" +  ", \">=\"," + "\"" + filter[key] + "\"" + ")";
      }
      else if (key === "minpiece") {
        query = query + ".where(" + "nombre_pieces_principales" +  ", \"<=\"," + "\"" + filter[key] + "\"" + ")";
      }
    }

    console.log("new")

    query = query + ".orderBy(\"id\").startAt(" + (page_size * page).toString() + ").endAt(" + (page_size * (page + 1)).toString() + ").get();";
    console.log(query);

    const properties = await eval(query);
    return properties.docs.map(doc => Object.assign(doc.data(), {id: doc.id}));
  }

module.exports = {
  get_paginated_property: get_paginated_property,
  property_filter: property_filter,
};
