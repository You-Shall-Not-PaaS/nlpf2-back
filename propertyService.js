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
      if (key === "code postal" || key === "type local" || key === "commune") {
        query = query + ".where(" + "\"" + key + "\"" +  ",\"==\"," + "\"" + filter[key] + "\"" + ")";
      }
      else if (key === "maxprice") {
        query = query + ".where(" + "\"Valeur fonciere\"" +  ", \"<=\"," + filter[key].toString() + ")";
      }
      else if (key === "maxsize") {
        query = query + ".where(" + "\"Surface reelle bati\"" +  ", \"<=\"," + filter[key].toString() + ")";
      }
      else if (key === "minprice") {
        query = query + ".where(" + "\"Valeur fonciere\"" +  ", \">=\"," + filter[key].toString() + ")";
      }
      else if (key === "minsize") {
        query = query + ".where(" + "\"Surface reelle bati\"" +  ", \">=\"," + filter[key].toString() + ")";
      }
      else if (key === "maxpiece") {
        query = query + ".where(" + "\"Nombre pieces principales\"" +  ", \">=\"," + filter[key].toString() + ")";
      }
      else if (key === "minpiece") {
        query = query + ".where(" + "\"Nombre pieces principales\"" +  ", \"<=\"," + filter[key].toString() + ")";
      }
    }

    //query = query + ".orderBy(\"id\").startAt(" + (page_size * page).toString() + ").endAt(" + (page_size * (page + 1)).toString() + ").get();";
    query = query + ".get();";
    console.log(query);

    const properties = await eval(query);
    return properties.docs.map(doc => Object.assign(doc.data(), {id: doc.id}));
  }

module.exports = {
  get_paginated_property: get_paginated_property,
  property_filter: property_filter,
};
