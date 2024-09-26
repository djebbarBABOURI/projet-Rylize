import Depense from '../model/depense.model.js';

export const ajoutDepense = async (req, res) => {
    const { montant, categorie, date, description } = req.body;
    try {
        const nvDepense = new Depense({
            userId: req.utilisateur._id,
            montant,
            categorie,
            date,
            description,
        });
        await nvDepense.save();
        res.status(201).json({ message: "Dépense ajoutée avec succès", depense: nvDepense });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const modifierDepense = async (req, res) => {
    const { id } = req.params;
    const { montant, categorie, date, description } = req.body;
    try {
        // Récupérer la dépense avant toute mise à jour
        const depense = await Depense.findById(id);
        if (!depense) {
            return res.status(404).json({ message: "Dépense non trouvée" });
            console.log("Dépense non trouvée");
        }

        // Si tout est validé, mise à jour de la dépense
        const depenseModifiee = await Depense.findByIdAndUpdate(
            id,
            {
                $set: {
                    montant: montant,
                    categorie: categorie,
                    date: date,
                    description: description
                }
            },
            { new: true, runValidators: true }  // Renvoie l'objet mis à jour et valide les champs
        );
        res.status(200).json({ message: "Dépense modifiée avec succès", depense: depenseModifiee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDepensesUtilisateur = async (req, res) => {
    try {
        // Récupérer toutes les dépenses de l'utilisateur connecté
        const depenses = await Depense.find({ userId: req.utilisateur._id });

        if (depenses.length === 0) {
            return res.status(404).json({ message: "Aucune dépense trouvée pour cet utilisateur" });
        }

        res.status(200).json({ depenses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





export const deleteDepenses = async (req, res) => {
    try {
        const { ids } = req.body; // Recevoir les IDs des dépenses à supprimer
        await Depense.deleteMany({ _id: { $in: ids } }); // Supprimer les dépenses avec les IDs correspondants
        res.status(200).json({ message: "Dépenses supprimées avec succès !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}



