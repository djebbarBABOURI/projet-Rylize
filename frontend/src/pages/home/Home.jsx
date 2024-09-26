import { useState, useEffect } from "react";
import DepenseForm from "../depense/DepenseForm.jsx";
import TableauDepense from "../../components/TableauDepense.jsx"; // Assurez-vous d'importer le composant ici
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

    return (
        <div className='w-full md:flex-row p-4 bg-white shadow-lg rounded-lg max-w-4xl mx-auto'>
            <div className="w-full mb-4">
                <h2 className="font-bold text-xl w-full">Liste des dépenses</h2>
                <hr className="border-t-2 border-gray-300 mt-2" />
            </div>
            <button
                onClick={() => { setIsAjoutDepense(true); document.getElementById('my_modal_4').showModal(); }}
                className='btn h-10 mt-4 border border-transparent bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200'>
                Ajouter
            </button>

            {loadingDepenses ? (
                <p>Chargement des dépenses...</p>
            ) : (
                <TableauDepense listDepense={listDepense} formatDate={formatDate} onEdit={handleEdit} />
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
