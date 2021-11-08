const fireBase = require("firebase-admin");

const serviceAccount = require("./key.json");

fireBase.initializeApp({
  credential: fireBase.credential.cert(serviceAccount),
});

const db = fireBase.firestore();

async function get_paginated_property(page_size, page) {
  const query = db.collection("test");
  const begin = page_size * page;
  const end = page_size * (page + 1);
  console.log(begin);
  console.log(end);
  const properties = await query
    .orderBy("id")
    .startAt(1)
    .endAt(3)
    .get();

  console.log(properties.docs.map(doc => Object.assign(doc.data(), {id: doc.id})));
  return properties.docs.map(doc => Object.assign(doc.data(), {id: doc.id}));
}

async function property_filter(page_size, page, filter) {
    properties = debug.collection("valeurs-foncieres");

    for (const key in filter) {
      if (key === "code_postal" || key === "type_local" || key === "commune") {
        properties = properties.where(key, "==", filter[key]);
      } else if (key === "maxprice") {
        properties = properties.where("valeur_fonciere", "<=", filter[key]);
      } else if (key === "maxsize") {
        properties = properties.where("surface_reelle_bati", "<=", filter[key]);
      } else if (key === "minprice") {
        properties = properties.where("valeur_fonciere", ">=", filter[key]);
      } else if (key === "minsize") {
        properties = properties.where("surface_reelle_bati", ">=", filter[key]);
      }
      else if (key === "maxpiece") {
        properties = properties.where("nombre_pieces_principales", ">=", filter[key]);
      }
      else if (key === "minpiece") {
        properties = properties.where("nombre_pieces_principales", "<=", filter[key]);
      }
    }

    return await properties
      .startAt(this.page_size * this.page)
      .endAt(this.page_size * (this.page + 1))
      .get();
  }

module.exports = {
  get_paginated_property: get_paginated_property,
  property_filter: property_filter,
};
