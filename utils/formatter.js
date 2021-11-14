function format_property(property) {
    property["1er lot"] = parseInt(property["1er lot"]);
    property["Code commune"] = parseInt(property["Code commune"]);
    property["No plan"] = parseInt(property["No plan"]);
    property["No voie"] = parseInt(property["No voie"]);
    property["Nombre de lots"] = parseInt(property["Nombre de lots"]);
    property["Nombre pieces principales"] = parseInt(property["Nombre pieces principales"]);
    property["Surface reelle bati"] = parseInt(property["Surface reelle bati"]);
    property["Surface terrain"] = parseInt(property["Surface terrain"]);
    property["Valeur fonciere"] = parseInt(property["Valeur fonciere"]);
}

function query_to_array(query) {
    const ans = query.split(',');
    return ans;
}

module.exports = {
    format_property: format_property,
    query_to_array: query_to_array,
};