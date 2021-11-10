const fireBase = require("firebase-admin");

const configFileName = "./key.json"
const serviceAccount = require(configFileName);

fireBase.initializeApp({
  credential: fireBase.credential.cert(serviceAccount),
});

const db = fireBase.firestore();
const dbName = "valeurs-foncieres"
const page_size = 30

async function get_paginated_property(page) {
  const query = db.collection(dbName);
  properties = await query
    .orderBy("id")
    .startAt(page * page_size)
    .endAt((page + 1) * page_size)
    .get();

  return properties.docs.map((doc) =>
    Object.assign(doc.data(), { id: doc.id })
  );
}

async function property_filter(page, filter) {
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
  var filtered_properties = [];
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
          filtered_properties.push(property);
        } else {
          break;
        }
      }
      count++;
    }
  }

  return filtered_properties;
}

module.exports = {
  get_paginated_property: get_paginated_property,
  property_filter: property_filter,
};
