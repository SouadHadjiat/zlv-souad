CREATE OR REPLACE PROCEDURE load_data (CSV_PATH TEXT)
LANGUAGE plpgsql
AS $$

    BEGIN

        CREATE TABLE _extract_zlv_
        (
            ccodep             TEXT,
            annee              INTEGER,
            dir                INTEGER,
            sip                INTEGER,
            commune            TEXT,
            intercommunalite   TEXT,
            gestre_ppre        TEXT,
            proprietaire       TEXT,
            adresse1           TEXT,
            adresse2           TEXT,
            adresse3           TEXT,
            adresse4           TEXT,
            groupe             TEXT,
            nature             TEXT,
            loc_voie           TEXT,
            loc_num            TEXT,
            invariant          TEXT,
            refcad             TEXT,
            batloc             TEXT,
            vlcad              TEXT,
            vl_revpro          TEXT,
            aff                TEXT,
            anmutation         TEXT,
            libvoie            TEXT,
            libcom             TEXT,
            debutvacance       INTEGER,
            anrefthlv          INTEGER,
            txtlv              TEXT,
            potentiel_tlv_thlv TEXT,
            ff_idlocal         TEXT,
            ff_millesime       INTEGER,
            ff_idsec           TEXT,
            ff_idbat           TEXT,
            ff_ctpdl           TEXT,
            ff_stoth           TEXT,
            ff_slocal          TEXT,
            ff_npiece_p2       INTEGER,
            ff_jannath         INTEGER,
            ff_jdatat          INTEGER,
            ff_ndroit          INTEGER,
            ff_dnbbai          INTEGER,
            ff_dnbdou          INTEGER,
            ff_dnbwc           INTEGER,
            ff_dcapec2         INTEGER,
            ff_ccthp           TEXT,
            ff_jdatnss_1       TEXT,
            ff_ddenom_1        TEXT,
            ff_dlign3_1        TEXT,
            ff_dlign4_1        TEXT,
            ff_dlign5_1        TEXT,
            ff_dlign6_1        TEXT,
            ff_jdatnss_2       TEXT,
            ff_ddenom_2        TEXT,
            ff_dlign3_2        TEXT,
            ff_dlign4_2        TEXT,
            ff_dlign5_2        TEXT,
            ff_dlign6_2        TEXT,
            ff_jdatnss_3       TEXT,
            ff_ddenom_3        TEXT,
            ff_dlign3_3        TEXT,
            ff_dlign4_3        TEXT,
            ff_dlign5_3        TEXT,
            ff_dlign6_3        TEXT,
            ff_jdatnss_4       TEXT,
            ff_ddenom_4        TEXT,
            ff_dlign3_4        TEXT,
            ff_dlign4_4        TEXT,
            ff_dlign5_4        TEXT,
            ff_dlign6_4        TEXT,
            ff_jdatnss_5       TEXT,
            ff_ddenom_5        TEXT,
            ff_dlign3_5        TEXT,
            ff_dlign4_5        TEXT,
            ff_dlign5_5        TEXT,
            ff_dlign6_5        TEXT,
            ff_jdatnss_6       TEXT,
            ff_ddenom_6        TEXT,
            ff_dlign3_6        TEXT,
            ff_dlign4_6        TEXT,
            ff_dlign5_6        TEXT,
            ff_dlign6_6        TEXT,
            ff_catpro2txt      TEXT,
            ff_catpro3         TEXT,
            ff_locprop         INTEGER,
            ff_x               TEXT,
            ff_y               TEXT,
            ff_x_4326          TEXT,
            ff_y_4326          TEXT
        );

        EXECUTE 'COPY _extract_zlv_ FROM ''' || CSV_PATH || '''DELIMITER '';'' CSV HEADER';

        CALL load_housing();

        CALL load_owners();

        DROP TABLE _extract_zlv_;

    END;
$$



