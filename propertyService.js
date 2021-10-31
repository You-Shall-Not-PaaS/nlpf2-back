module.exports = class PagedList {

    page_size = 30;

    constructor(page) {
      this.page = page;
    }

    get_paginated_property() {
        //mock
        if (this.page == 0)
        {
            return  {
                "id": 1,
                "voie": "COMTE DE LA TEYSSONNIERE",
                "premier_lot": null,
                "no_disposition": "1",
                "code_postal": "1000.0",
                "nombre_de_lots": "0",
                "date_mutation": "06/01/2020",
                "commune": "BOURG-EN-BRESSE",
                "code_type_local": "1.0",
                "nature_mutation": "Vente",
                "code_departement": "1",
                "type_local": "Maison",
                "valeur_fonciere": "180300,00",
                "code_commune": "53",
                "surface_reelle_bati": "75.0",
                "no_voie": "31.0",
                "section": "AI",
                "nombre_pieces_principales": "4.0",
                "type_de_voie": "RUE",
                "no_plan": "138",
                "nature_culture": "S",
                "code_voie": "0970",
                "surface_terrain": "525.0"
              }
        }
        else {
            return (
                {
                    "id": 2,
                    "voie": "COMTE DE LA TEYSSONNIERE 5",
                    "premier_lot": null,
                    "no_disposition": "1",
                    "code_postal": "10010.0",
                    "nombre_de_lots": "0",
                    "date_mutation": "06/01/2020",
                    "commune": "BOURG-EN-BRESSE",
                    "code_type_local": "1.0",
                    "nature_mutation": "Vente",
                    "code_departement": "1",
                    "type_local": "Maison",
                    "valeur_fonciere": "180300,00",
                    "code_commune": "53",
                    "surface_reelle_bati": "75.0",
                    "no_voie": "31.0",
                    "section": "AI",
                    "nombre_pieces_principales": "4.0",
                    "type_de_voie": "RUE",
                    "no_plan": "138",
                    "nature_culture": "S",
                    "code_voie": "0970",
                    "surface_terrain": "525.0"
                  }
            )
        }
        
    }

  }

