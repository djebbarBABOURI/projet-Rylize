import { useState, useEffect } from "react";
import DepenseForm from "../depense/DepenseForm.jsx";
import TableauDepense from "../../components/TableauDepense.jsx";
import toast from "react-hot-toast";

const Home = () => {
    const [isAjoutDepense, setIsAjoutDepense] = useState(null);
    const [listDepense, setListDepense] = useState([]);
    const [loadingDepenses, setLoadingDepenses] = useState(false);
    const [depenseSelected, setDepenseSelected] = useState(null);

    const loadData = async () => {
        setLoadingDepenses(true);
        try {
            const res = await fetch(`/api/depenses/getDepenses/`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                throw new Error(`Erreur: ${res.status} - ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.error) {
                setListDepense(data.depenses);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        } finally {
            setLoadingDepenses(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const closeModal = () => {
        const modal = document.getElementById("my_modal_4");
        setDepenseSelected({});
        if (modal) {
            modal.close();
        }
    };

    const handleEdit = (depense) => {
        setDepenseSelected(depense);
        setIsAjoutDepense(false);
        document.getElementById('my_modal_4').showModal();
    };

    const handleDelete = async (ids) => {
        try {
            const res = await fetch(`/api/depenses/deleteDepenses/`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
            });

            if (!res.ok) {
                throw new Error(`Erreur: ${res.status} - ${res.statusText}`);
            }

            toast.success("Dépenses supprimées avec succès !");
            loadData(); // Recharger la liste des dépenses
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        }
    };

    // Méthode pour gérer l'ajout d'une nouvelle dépense
    const handleAdd = () => {
        setIsAjoutDepense(true);  // On est en mode ajout
        setDepenseSelected(null); // Réinitialiser la dépense sélectionnée
        document.getElementById('my_modal_4').showModal(); // Ouvrir le modal
    };

    return (
        <div className='w-full md:flex-row p-4 bg-white shadow-lg rounded-lg max-w-4xl mx-auto'>
            <div className="w-full mb-4">
                <h2 className="font-bold text-xl w-full">Liste des dépenses</h2>
                <hr className="border-t-2 border-gray-300 mt-2" />
            </div>

            {loadingDepenses ? (
                <p>Chargement des dépenses...</p>
            ) : (
                <TableauDepense
                    listDepense={listDepense}
                    formatDate={formatDate}
                    onEdit={handleEdit}
                    onDelete={handleDelete} // Passer la méthode de suppression
                    onAdd={handleAdd}
                />
            )}

            <dialog id="my_modal_4" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
                    <DepenseForm
                        isAjoutDepense={isAjoutDepense}
                        depense={depenseSelected}
                        reloadData={loadData}
                    />
                </div>
            </dialog>
        </div>
    );
};

export default Home;
