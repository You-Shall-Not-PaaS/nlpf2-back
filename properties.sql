CREATE TABLE IF NOT EXISTS properties(
  id INT,
  no_disposition VARCHAR,
  date_mutation VARCHAR,
  nature_mutation VARCHAR,
  valeur_fonciere INT,
  no_voie VARCHAR,
  type_de_voie VARCHAR,
  code_voie VARCHAR,
  voie VARCHAR,
  code_postal VARCHAR,
  commune VARCHAR,
  code_departement VARCHAR,
  code_commune VARCHAR,
  section VARCHAR,
  no_plan VARCHAR,
  premier_lot VARCHAR,
  nombre_de_lots VARCHAR,
  code_type_local VARCHAR,
  type_local VARCHAR,
  surface_reelle_bati FLOAT,
  nombre_pieces_principales INT,
  nature_culture VARCHAR,
  surface_terrain FLOAT
);
-- Create table: https://stackoverflow.com/a/21307842
-- Import csv in table: https://stackoverflow.com/a/42726226