const fireBase = require("firebase-admin");
const { min } = require("moment");

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
  return properties.docs.map((doc) =>
    Object.assign(doc.data(), { id: doc.id })
  );
}

async function property_filter(page_size, page, filter) {
  query = 'db.collection("valeurs-foncieres")';
  minmax = {};
  for (const key in filter) {
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
      eval("minmax." + key + "=" + filter[key] + ";");
    }
  }

  query = query + ".get();";

  const properties = await eval(query);
  const dic_properties = properties.docs.map((doc) =>
    Object.assign(doc.data(), { id: doc.id })
  );
  filtered_properties = [];

  cmpt = 0;

  for (i = 0; i < Object.keys(dic_properties).length; i++) {
    propertie = dic_properties[i];
    respect_filter = true;

    for (const key in minmax) {
      if (key === "maxprice" && minmax[key] <= propertie["Valeur fonciere"]) {
        respect_filter = false;
        break;
      }
      if (key === "minprice" && minmax[key] >= propertie["Valeur fonciere"]) {
        respect_filter = false;
        console.log("test");
        break;
      }
      if (
        key === "maxsize" &&
        minmax[key] <= propertie["Surface reelle bati"]
      ) {
        respect_filter = false;
        break;
      }
      if (
        key === "minsize" &&
        minmax[key] >= propertie["Surface reelle bati"]
      ) {
        respect_filter = false;
        break;
      }
      if (
        key === "maxpiece" &&
        minmax[key] <= propertie["Nombre pieces principales"]
      ) {
        respect_filter = false;
        break;
      }
      if (
        key === "minpiece" &&
        minmax[key] >= propertie["Nombre pieces principales"]
      ) {
        respect_filter = false;
        break;
      }
    }

    if (respect_filter) {
      if (page * page_size <= cmpt) {
        if ((page + 1) * page_size >= cmpt) {
          filtered_properties.push(propertie);
        } else {
          break;
        }
      }

      cmpt++;
    }
  }

  return filtered_properties;
}

module.exports = {
  get_paginated_property: get_paginated_property,
  property_filter: property_filter,
};
