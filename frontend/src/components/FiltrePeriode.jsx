/* eslint-disable react/prop-types */
import { PERIODES } from "../utils.js";

const FiltrePeriode = ({ periode, onChange }) => (
    <select
        className="select select-bordered select-sm"
        value={periode}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Période"
    >
        {PERIODES.map((p) => (
            <option key={p.valeur} value={p.valeur}>{p.libelle}</option>
        ))}
    </select>
);

export default FiltrePeriode;
