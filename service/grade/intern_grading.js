// Bon > Ok > Mauvais  Neutre

function garden(property, grade_dic) {
  terrain = parseInt(property["Surface terrain"]);
  property_surface = parseInt(property["Surface reelle bati"]);
  garden = terrain - property_surface;

  if (garden > 0) {
    if (garden >= 800) {
      grade_dic.grade += 0.5;
      grade_dic.tag += "Terrain,Bon;";
    } else if (garden >= 100) {
      grade_dic.grade += 1;
      grade_dic.tag += "Grand jardin,Bon;";
    } else if (garden >= 30) {
      grade_dic.grade += 0.5;
      grade_dic.tag += "Jardin,Bon;";
    } else {
      grade_dic.grade += 0.25;
      grade_dic.tag += "Terasse,Ok;";
    }
  }

  return grade_dic;
}

function noiseAndAccessibility(property, grade_dic) {
  //https://www.sirene.fr/sirene/public/variable/typvoie

  if (
    property["Type de voie"] in
    ["CHE", "DOM", "COR", "ESP", "HAM", "LD", "PRO", "SEN", "VLA", "PLN"]
  ) {
    grade_dic.grade += 1;
    grade_dic.tag += "Vert,Bon;";
  }
  if (property["Type de voie"] in ["DOM", "PLN", "PLT", "VLA"]) {
    grade_dic.grade += 0.75;
    grade_dic.tag += "Très Calme,Bon;";
  }
  if (property["Type de voie"] in ["CHE", "ECA", "RES", "SEN", "VLGE"]) {
    grade_dic.grade += 0.6;
    grade_dic.tag += "Calme,Bon;";
  }
  if (property["Type de voie"] in ["ROC", "CAR"]) {
    grade_dic.grade += -1;
    grade_dic.tag += "Très Bruyant,Mauvais";
  }
  if (property["Type de voie"] in ["AV", "BD", "RPT", "RTE"]) {
    grade_dic.grade += -0.5;
    grade_dic.tag += "Bruyant,Mauvais";
  }
  if (property["Type de voie"] in ["COR", "VLA", "LD"]) {
    grade_dic.grade += 1;
    grade_dic.tag += "Belle Vue,Bon";
  }
  if (property["Type de voie"] in ["CITE"]) {
    grade_dic.grade += -0.3;
  }
  if (property["Type de voie"] in ["HLE", "PL", "PRV", "MAR"]) {
    grade_dic.grade += 0.2;
    grade_dic.tag += "Centre-ville,Neutre";
  }

  return grade_dic;
}

function roomAndSize(property, grade_dic) {
  const size = parseInt(property["Surface reelle bati"]);
  const pieces = parseInt(property["Nombre pieces principales"]);
  const ratio = size / (pieces + 2);

  //const bedroom = 13;
  //const living = 20; => minimum
  //const living = 40; => good one;
  if (size > 30) {
    if (ratio < 10) {
      grade_dic.grade += -(0.5 + ratio / 20);
      grade_dic.tag += "Petites pieces,Mauvais;";
    } else if (ratio < 30) {
      grade_dic.grade += 0.2 + ratio / 50;
    } else {
      grade_dic.grade += 0.5 + ratio / 50;
      grade_dic.tag += "Grandes pieces,Bon;";
    }
  }
  return grade_dic;
}

module.exports = {
  garden: garden,
  noisAndAccessibility: noiseAndAccessibility,
  roomAndSize: roomAndSize,
};
