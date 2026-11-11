import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api.js";

const VIDE = { ancienMdp: "", nouveauMdp: "", confirmation: "" };

const ChangerMotDePasse = () => {
    const [champs, setChamps] = useState(VIDE);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setChamps({ ...champs, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.patch("/api/utilisateur/motdepasse", champs);
            toast.success("Mot de passe modifié avec succès");
            setChamps(VIDE);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-4 mt-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
            <h2 className="font-bold text-xl mb-2">Changer mon mot de passe</h2>
            <hr className="border-t-2 border-gray-300 mb-4" />
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <label className="form-control">
                    <span className="label-text text-gray-600 mb-1">Ancien mot de passe</span>
                    <input type="password" name="ancienMdp" autoComplete="current-password" className="input input-bordered" value={champs.ancienMdp} onChange={handleChange} required />
                </label>
                <label className="form-control">
                    <span className="label-text text-gray-600 mb-1">Nouveau (8 caractères min., lettre + chiffre)</span>
                    <input type="password" name="nouveauMdp" autoComplete="new-password" className="input input-bordered" value={champs.nouveauMdp} onChange={handleChange} required minLength={8} />
                </label>
                <label className="form-control">
                    <span className="label-text text-gray-600 mb-1">Confirmation</span>
                    <input type="password" name="confirmation" autoComplete="new-password" className="input input-bordered" value={champs.confirmation} onChange={handleChange} required />
                </label>
                <div className="md:col-span-3 flex justify-end">
                    <button className="btn bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
                        {loading ? <span className="loading loading-dots loading-md"></span> : "Changer le mot de passe"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangerMotDePasse;
