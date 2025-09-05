import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { BASE_URL_API } from "@/lib/constants";
import styles from "@/app/style/RapportTelecharge.module.css";

const RapportTelecharge: React.FC = () => {
  const [method, setMethod] = useState("jour");
  const [dateUnique, setDateUnique] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [mois, setMois] = useState("");
  const [anneeMois, setAnneeMois] = useState(
    new Date().getFullYear().toString(),
  );
  const [trimestre, setTrimestre] = useState("1");
  const [anneeTrim, setAnneeTrim] = useState(
    new Date().getFullYear().toString(),
  );

  const handleDownload = () => {
    let url = "";
    switch (method) {
      case "jour":
        url = `${BASE_URL_API}/rapport/jour?date=${dateUnique}`;
        break;
      case "intervalle":
        url = `${BASE_URL_API}/rapport/intervalle?debut=${dateDebut}&fin=${dateFin}`;
        break;
      case "mois":
        url = `${BASE_URL_API}/rapport/mois?mois=${mois}&annee=${anneeMois}`;
        break;
      case "trimestre":
        url = `${BASE_URL_API}/rapport/trimestre?trimestre=${trimestre}&annee=${anneeTrim}`;
        break;
    }
    window.open(url, "_blank");
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}> Génération de Rapports</h3>

      <div className={styles.field}>
        <label className={styles.label}>Méthode de rapport</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={styles.select}
        >
          <option value="jour">Par jour</option>
          <option value="intervalle">Entre deux dates</option>
          <option value="mois">Par mois</option>
          <option value="trimestre">Trimestriel</option>
        </select>
      </div>

      <div className={styles.dynamicFields}>
        {method === "jour" && (
          <div className={styles.field}>
            <label className={styles.label}>Date</label>
            <input
              type="date"
              value={dateUnique}
              onChange={(e) => setDateUnique(e.target.value)}
              className={styles.input}
            />
          </div>
        )}

        {method === "intervalle" && (
          <div className={styles.flexRow}>
            <div className={styles.field}>
              <label className={styles.label}>Début</label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Fin</label>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        )}

        {method === "mois" && (
          <div className={styles.field}>
            <label className={styles.label}>Mois et année</label>
            <div className={styles.grid2}>
              <select
                value={mois}
                onChange={(e) => setMois(e.target.value)}
                className={styles.select}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("fr-FR", { month: "long" })}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={anneeMois}
                onChange={(e) => setAnneeMois(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        )}

        {method === "trimestre" && (
          <div className={styles.field}>
            <label className={styles.label}>Trimestre et année</label>
            <div className={styles.grid2}>
              <select
                value={trimestre}
                onChange={(e) => setTrimestre(e.target.value)}
                className={styles.select}
              >
                <option value="1">T1</option>
                <option value="2">T2</option>
                <option value="3">T3</option>
                <option value="4">T4</option>
              </select>
              <input
                type="number"
                value={anneeTrim}
                onChange={(e) => setAnneeTrim(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        )}
      </div>

      <button className={styles.button} onClick={handleDownload}>
        <FiDownload /> Télécharger
      </button>
    </div>
  );
};

export default RapportTelecharge;
