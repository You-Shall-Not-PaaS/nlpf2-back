function garden(property, grade_dic) {
    terrain = property["Surface terrain"];
    property_surface = property["Surface reelle bati"];
    garden = terrain - property_surface;

    if (garden > 0) {
        if (garden >= 800) {
            grade_dic.grade += 0.5;
            grade_dic.tag.push["Terrain"];
        }
        else if (garden >= 100) {
            grade_dic.grade += 1;
            grade_dic.tag.push["Grand jardin"];
        }
        else if (garden >= 30) {
            grade_dic.grade += 0.5;
            grade_dic.tag.push["Jardin"];
        }
        else {
            grade_dic.grade += 0.25;
            grade_dic.tag.push["Terasse"]
        }
    }

    return grade_dic;
}

module.exports = {
    garden: garden
};