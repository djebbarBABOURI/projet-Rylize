import { useState, useEffect } from "react";
import DepenseForm from "../depense/DepenseForm.jsx";
import TableauDepense from "../../components/TableauDepense.jsx";
import toast from "react-hot-toast";
import BarChart from "../../components/BarChart.jsx";
import LineChart from "../../components/LineChart.jsx";
import PieChart from "../../components/PieChart.jsx";

const Home = () => {
    const [isAjoutDepense, setIsAjoutDepense] = useState(null);
    const [listDepense, setListDepense] = useState([]);
    const [loadingDepenses, setLoadingDepenses] = useState(false);
    const [depenseSelected, setDepenseSelected] = useState(null);


    const [dataChart, setDataChart] = useState({
        labels: [], // Initial structure
        datasets: [
            {
                label: "Depense catégorie",
                data: [],
            },
        ],
    });


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

    useEffect(() => {
        if (listDepense.length > 0) {
            // Utiliser un objet pour agréger les montants par catégorie
            const depenseParCategorie = listDepense.reduce((acc, depense) => {
                if (!acc[depense.categorie]) {
                    acc[depense.categorie] = 0;  // Initialiser la catégorie si elle n'existe pas encore
                }
                acc[depense.categorie] += depense.montant;  // Additionner le montant de la dépense dans la catégorie
                return acc;
            }, {});

            // Extraire les catégories et les montants agrégés
            const categories = Object.keys(depenseParCategorie);
            const montants = Object.values(depenseParCategorie);

            setDataChart({
                labels: categories,
                datasets: [
                    {
                        label: "Depense par catégorie",
                        data: montants,

                    },
                ],
            });
        } else {
            setDataChart({
                labels: [],
                datasets: [
                    {
                        label: "Depense par catégorie",
                        data: [],
                    },
                ],
            });
        }
    }, [listDepense]);



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
        <div className='w-full p-12 bg-white shadow-lg rounded-lg max-w-7xl mx-auto'>
            <div className="w-full mb-4">
                <h2 className="font-bold text-xl">Liste des dépenses</h2>
                <hr className="border-t-2 border-gray-300 mt-2" />
            </div>

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

            <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full md:w-2/3 mb-4"> {/* Occupation 2/3 de la largeur pour le tableau */}
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
                </div>
                <div className="w-full md:w-1/3 mb-4 flex flex-col space-y-4"> {/* Occupation 1/3 de la largeur pour les graphiques */}
                    <BarChart chartData={dataChart} />
                    <LineChart chartData={dataChart} />
                    <PieChart chartData={dataChart} />
                </div>
            </div>
        </div>



    );
};

export default Home;
