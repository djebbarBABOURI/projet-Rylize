import { useState, useEffect, useCallback, useMemo } from "react";
import DepenseForm from "../depense/DepenseForm.jsx";
import TableauDepense from "../../components/TableauDepense.jsx";
import toast from "react-hot-toast";
import BarChart from "../../components/BarChart.jsx";
import LineChart from "../../components/LineChart.jsx";
import PieChart from "../../components/PieChart.jsx";
import CartesStats from "../../components/CartesStats.jsx";
import FiltrePeriode from "../../components/FiltrePeriode.jsx";
import { useCategories } from "../../hooks/useCategories.js";
import { api, construireQuery } from "../../services/api.js";
import { calculerPeriode, capitaliser, formaterDate } from "../../utils.js";

const PALETTE = ["#3b82f6", "#f97316", "#a855f7", "#14b8a6", "#ef4444", "#6b7280"];

const Home = () => {
    const [isAjoutDepense, setIsAjoutDepense] = useState(null);
    const [listDepense, setListDepense] = useState([]);
    const [loadingDepenses, setLoadingDepenses] = useState(false);
    const [depenseSelected, setDepenseSelected] = useState(null);
    const [periode, setPeriode] = useState("mois");
    const [stats, setStats] = useState(null);
    const [recherche, setRecherche] = useState("");
    const [rechercheDiff, setRechercheDiff] = useState(""); // valeur utilisée pour l'API (anti-rebond)
    const [categorieFiltre, setCategorieFiltre] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [resume, setResume] = useState(null);
    const { categories } = useCategories();

    const bornes = useMemo(() => calculerPeriode(periode), [periode]);

    // Anti-rebond : on n'interroge l'API que 300 ms après la dernière frappe
    useEffect(() => {
        const timer = setTimeout(() => {
            setRechercheDiff(recherche.trim());
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [recherche]);

    // Filtres communs à la liste, à la pagination et à l'export CSV
    const filtres = useMemo(
        () => ({ ...bornes, q: rechercheDiff, categorie: categorieFiltre }),
        [bornes, rechercheDiff, categorieFiltre]
    );

    const loadData = useCallback(async () => {
        setLoadingDepenses(true);
        try {
            const data = await api.get(`/api/depenses/getDepenses/${construireQuery({ ...filtres, page, limite: 10 })}`);
            // Si la dernière dépense de la page a été supprimée, on recule d'une page
            if (data.depenses.length === 0 && page > 1) {
                setPage(page - 1);
                return;
            }
            setListDepense(data.depenses);
            setPagination(data.pagination);
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        } finally {
            setLoadingDepenses(false);
        }
    }, [filtres, page]);

    // Statistiques calculées par MongoDB (agrégations) : période choisie + résumé du mois en cours
    const loadStats = useCallback(async () => {
        try {
            const [s, r] = await Promise.all([
                api.get(`/api/statistiques${construireQuery(bornes)}`),
                api.get("/api/statistiques/resume"),
            ]);
            setStats(s.statistiques);
            setResume(r.resume);
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        }
    }, [bornes]);

    const rafraichir = useCallback(() => {
        loadData();
        loadStats();
    }, [loadData, loadStats]);

    // La liste se recharge quand les filtres ou la page changent, les statistiques seulement avec la période
    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    const changerPeriode = (valeur) => {
        setPeriode(valeur);
        setPage(1);
    };

    const changerCategorie = (valeur) => {
        setCategorieFiltre(valeur);
        setPage(1);
    };

    // Données des graphiques, avec la couleur choisie pour chaque catégorie
    const couleurs = useMemo(() => Object.fromEntries(categories.map((c) => [c.nom, c.couleur])), [categories]);

    const dataParCategorie = useMemo(() => {
        const lignes = stats?.parCategorie ?? [];
        return {
            labels: lignes.map((l) => capitaliser(l.categorie)),
            datasets: [{
                label: "Dépenses par catégorie (€)",
                data: lignes.map((l) => l.total),
                backgroundColor: lignes.map((l, i) => couleurs[l.categorie] || PALETTE[i % PALETTE.length]),
            }],
        };
    }, [stats, couleurs]);

    const dataParMois = useMemo(() => {
        const lignes = stats?.parMois ?? [];
        return {
            labels: lignes.map((l) => l.mois),
            datasets: [{
                label: "Dépenses par mois (€)",
                data: lignes.map((l) => l.total),
                borderColor: "#3b82f6",
                backgroundColor: "#93c5fd",
            }],
        };
    }, [stats]);

    const formatDate = formaterDate;

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
            await api.delete("/api/depenses/deleteDepenses/", { ids });
            toast.success("Dépenses supprimées avec succès !");
            rafraichir();
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
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-xl">Liste des dépenses</h2>
                    <FiltrePeriode periode={periode} onChange={changerPeriode} />
                </div>
                <hr className="border-t-2 border-gray-300 mt-2" />
            </div>

            <CartesStats resume={resume} />

            <dialog id="my_modal_4" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
                    <DepenseForm
                        isAjoutDepense={isAjoutDepense}
                        depense={depenseSelected}
                        reloadData={rafraichir}
                    />
                </div>
            </dialog>

            <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full md:w-2/3 mb-4"> {/* Occupation 2/3 de la largeur pour le tableau */}
                    <TableauDepense
                        listDepense={listDepense}
                        formatDate={formatDate}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAdd={handleAdd}
                        recherche={recherche}
                        onRecherche={setRecherche}
                        categories={categories}
                        categorieFiltre={categorieFiltre}
                        onCategorieFiltre={changerCategorie}
                        pagination={pagination}
                        onPage={setPage}
                        urlExport={`/api/depenses/export${construireQuery(filtres)}`}
                    />
                    {loadingDepenses && <p className="text-sm text-gray-500 mt-2">Chargement des dépenses...</p>}
                </div>
                <div className="w-full md:w-1/3 mb-4 flex flex-col space-y-4"> {/* Occupation 1/3 de la largeur pour les graphiques */}
                    <BarChart chartData={dataParCategorie} />
                    <LineChart chartData={dataParMois} />
                    <PieChart chartData={dataParCategorie} />
                </div>
            </div>
        </div>



    );
};

export default Home;
