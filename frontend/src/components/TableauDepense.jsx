/* eslint-disable react/prop-types */
import { useState } from "react";
import { capitaliser, formaterMontant } from "../utils.js";

const TableauDepense = ({
  listDepense,
  formatDate,
  onEdit,
  onDelete,
  onAdd,
  recherche,
  onRecherche,
  categories = [],
  categorieFiltre,
  onCategorieFiltre,
  pagination,
  onPage,
  urlExport,
}) => {
  const [selectedDepenses, setSelectedDepenses] = useState(new Set());

  // Gestion du changement de la checkbox
  const handleCheckboxChange = (id) => {
    const updatedSelected = new Set(selectedDepenses);
    if (updatedSelected.has(id)) {
      updatedSelected.delete(id);
    } else {
      updatedSelected.add(id);
    }
    setSelectedDepenses(updatedSelected);
  };

  // Gestion de la suppression
  const handleDelete = () => {
    if (selectedDepenses.size > 0) {
      onDelete(Array.from(selectedDepenses));
      setSelectedDepenses(new Set());
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Conteneur flex pour les actions */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Bouton Ajouter */}
        <button
          className="btn btn-primary h-10 w-32 flex border border-transparent bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200"
          onClick={onAdd}
        >
          Ajouter
        </button>

        {/* Bouton Supprimer Sélectionnés */}
        <button
          disabled={selectedDepenses.size === 0}
          className="btn btn-danger h-10 w-40 flex items-center justify-center"
          onClick={() => document.getElementById('my_modal_1').showModal()}
        >
          Supprimer Sélectionnés
        </button>

        {/* Export CSV : reprend les filtres actifs */}
        <a className="btn btn-outline h-10" href={urlExport} download>
          Exporter en CSV
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Barre de recherche (côté serveur) */}
        <input
          type="text"
          placeholder="Rechercher une dépense..."
          className="input input-bordered flex-grow min-w-[150px] w-1/3"
          value={recherche}
          onChange={(e) => onRecherche(e.target.value)}
        />
        <select
          className="select select-bordered"
          value={categorieFiltre}
          onChange={(e) => onCategorieFiltre(e.target.value)}
          aria-label="Filtrer par catégorie"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.nom}>{capitaliser(c.nom)}</option>
          ))}
        </select>
      </div>

      {/* Modal pour confirmation de suppression */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box rounded-lg shadow-lg bg-white p-6 max-w-md mx-auto transition-transform transform scale-100">
          <h3 className="font-bold text-xl text-center text-gray-800 mb-4">Confirmation</h3>
          <p className="text-gray-600 text-center py-2">
            Êtes-vous sûr de vouloir supprimer {selectedDepenses.size > 1 ? `ces ${selectedDepenses.size} éléments` : "cet élément"} ? Cette action est irréversible.
          </p>
          <div className="modal-action flex justify-center space-x-4 mt-6">
            <form method="dialog">
              <button className="btn btn-outline transition duration-200 bg-blue-600 text-white">Annuler</button>
              <button
                onClick={handleDelete}
                disabled={selectedDepenses.size === 0}
                className={`btn btn-danger ml-5 transition duration-200  hover:bg-gray-200  ${selectedDepenses.size === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}`}
              >
                Supprimer
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Tableau des dépenses */}
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Montant</th>
            <th>Catégorie</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listDepense.length > 0 ? (
            listDepense.map((depense) => (
              <tr key={depense._id}>
                <td>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedDepenses.has(depense._id)}
                      onChange={() => handleCheckboxChange(depense._id)}
                    />
                  </label>
                </td>
                <td>{formaterMontant(depense.montant)}</td>
                <td>{capitaliser(depense.categorie)}</td>
                <td>{formatDate(depense.date)}</td>
                <td>{depense.description}</td>
                <td>
                  <button
                    onClick={() => onEdit(depense)}
                    className="btn btn-ghost btn-xs"
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">Aucune dépense trouvée.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-600">{pagination.total} dépenses</span>
          <div className="join">
            <button className="join-item btn btn-sm" disabled={pagination.page <= 1} onClick={() => onPage(pagination.page - 1)}>«</button>
            <button className="join-item btn btn-sm no-animation">Page {pagination.page} / {pagination.pages}</button>
            <button className="join-item btn btn-sm" disabled={pagination.page >= pagination.pages} onClick={() => onPage(pagination.page + 1)}>»</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableauDepense;
