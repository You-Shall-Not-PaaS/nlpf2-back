function format_property(property) {
    property["1er lot"] =  parseInt(property["1er lot"]);
    property["Code commune"] = parseInt(property["Code commune"]);
    property["No plan"] = parseInt(property["No plan"]);
    property["No voie"] = parseInt(property["No voie"]);
    property["Nombre de lots"] = parseInt(property["Nombre de lots"]);
    property["Nombre de pieces principales"] = parseInt(property["Nombre de pieces principales"]);
    property["Surface reelle bati"] = parseInt(property["Surface reelle bati"]);
    property["Surface terrain"] = parseInt(property["Surface terrain"]);
    property["Valeur fonciere"] = parseInt(property["Valeur fonciere"]);
}

module.exports = {
    format_property: format_property,

  };