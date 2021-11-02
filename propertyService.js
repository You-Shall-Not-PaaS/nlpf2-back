module.exports = class PagedList {

    page_size = 30;

    constructor(page) {
      this.page = page;
    }

    get_paginated_property() {
      properties = await debug.collection('placeholder');
      properties = properties.startAt(this.page_size * this.page)
      properties = properties.endAt(this.page_size * (this.page + 1));
      return properties.get();
  }
}

module.exports = class FilteredList {
  
  page_size = 30

  constructor(page, filter) {
    this.page = page;
    this.filter = filter;
  }

  property_filter () {
    properties = await debug.collection('placeholder');
    
    for(const key in filter) {
      if (key === "code_postal" || key === "type_local") {
        properties = properties.where(key , "==", filter[key]);
      }
      else if (key === "maxprice") {
        properties = properties.where("valeur_fonciere", "<=", filter[key]);
      }
      else if (key === "maxsize") {
        properties = properties.where("surface_reelle_bati" , "<=", filter[key]);
      }
      else if (key === 'minprice') {
        properties = properties.where("valeur_fonciere", ">=", filter[key]);
      }
      else if (key === 'minprice' || key === "minsize") {
        properties = properties.where("surface_reelle_bati" , ">=", filter[key]);
      }
    }

    properties.startAt(this.page_size * this.page).endAt(this.page_size * (this.page + 1)).get();
  }
}