/* eslint-disable react/prop-types */
const TableauDepense = ({ listDepense, formatDate, onEdit }) => {
  return (
    <div className="h-80 overflow-x-auto ">
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
                    <input type="checkbox" className="checkbox" />
                  </label>
                </td>
                <td>{depense.montant}</td>
                <td>{depense.categorie}</td>
                <td>{formatDate(depense.date)}</td>
                <td>{depense.description}</td>
                <td>
                  <button
                    onClick={() => onEdit(depense)}
                    className="btn btn-ghost btn-xs">
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
        <tfoot>
          <tr>
            <th></th>
            <th>Montant</th>
            <th>Catégorie</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TableauDepense;
