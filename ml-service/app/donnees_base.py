"""Jeu de départ : descriptions de dépenses courantes en français, par catégorie.

Il permet de suggérer une catégorie dès la première dépense (démarrage à froid).
Dès que l'utilisateur a saisi ses propres dépenses, elles sont ajoutées à l'entraînement
avec un poids plus fort : le modèle s'adapte à ses habitudes et à ses catégories.
"""

EXEMPLES_PAR_CATEGORIE = {
    "nourriture": [
        "courses carrefour", "courses lidl", "courses leclerc", "courses auchan", "courses intermarché",
        "supermarché", "marché du samedi", "boulangerie", "pain et croissants", "baguette",
        "restaurant", "restaurant italien", "pizzeria", "sushi", "kebab", "burger king", "mcdonald's",
        "déjeuner au travail", "dîner avec des amis", "café", "starbucks", "boissons", "boucherie",
        "primeur fruits et légumes", "poissonnerie", "uber eats", "deliveroo", "livraison repas",
        "sandwich", "snack", "glaces", "fromage", "courses de la semaine", "traiteur", "petit déjeuner",
    ],
    "transport": [
        "pass navigo", "abonnement transport", "ticket de métro", "ticket de bus", "billet de train sncf",
        "train", "tgv paris lyon", "essence", "plein d'essence", "carburant total", "gasoil",
        "péage autoroute", "parking", "stationnement", "uber", "taxi", "bolt course", "covoiturage blablacar",
        "vélo en libre service", "trottinette", "réparation voiture", "garage entretien", "contrôle technique",
        "assurance auto", "vidange", "billet d'avion", "ryanair vol", "tram", "ter région", "recharge voiture électrique",
        "lavage voiture",
    ],
    "loisirs": [
        "cinéma", "place de cinéma", "netflix", "abonnement netflix", "spotify", "disney plus", "prime video",
        "concert", "billets de concert", "théâtre", "musée", "exposition", "parc d'attractions", "bowling",
        "laser game", "escape game", "jeu vidéo", "steam", "playstation", "xbox game pass", "abonnement salle de sport",
        "salle de sport", "piscine", "cours de yoga", "randonnée", "weekend entre amis", "sortie en boîte",
        "bar avec des amis", "soirée", "livre", "librairie", "bd manga", "festival",
    ],
    "logement": [
        "loyer", "loyer du mois", "charges locatives", "électricité edf", "facture d'électricité", "gaz engie",
        "facture de gaz", "eau", "facture d'eau", "internet box", "abonnement internet", "forfait wifi fibre",
        "assurance habitation", "taxe d'habitation", "taxe foncière", "meubles ikea", "canapé", "matelas",
        "électroménager", "machine à laver", "réparation plomberie", "plombier", "électricien", "peinture travaux",
        "leroy merlin bricolage", "castorama", "chauffage", "syndic de copropriété", "ménage femme de ménage",
        "ampoules", "serrurier",
    ],
    "santé": [
        "pharmacie", "médicaments", "ordonnance", "médecin généraliste", "consultation médecin", "dentiste",
        "soins dentaires", "ophtalmologue", "lunettes", "opticien", "lentilles de contact", "kiné séances",
        "kinésithérapeute", "mutuelle santé", "mutuelle", "analyses de sang laboratoire", "radio", "hôpital",
        "urgences", "dermatologue", "psychologue", "ostéopathe", "vaccin", "doliprane", "sirop toux",
        "vitamines", "pansements", "gynécologue", "pédiatre", "orthodontiste", "prothèse auditive",
    ],
    "autres": [
        "cadeau d'anniversaire", "cadeau de noël", "vêtements", "t-shirt zara", "jean h&m", "chaussures",
        "baskets nike", "veste", "coiffeur", "barbier", "coiffure", "papeterie", "fournitures scolaires",
        "forfait mobile", "abonnement téléphone", "amazon commande", "colis la poste", "timbres", "don association",
        "frais bancaires", "cotisation", "impression photos", "cadeau mariage", "fleurs", "pressing",
        "cordonnerie", "bijoux", "parfum", "cosmétiques sephora", "produits de beauté", "animalerie croquettes",
    ],
}

# Deuxième lot : formulations plus naturelles et enseignes courantes (vocabulaire différent du premier lot)
EXEMPLES_PAR_CATEGORIE_2 = {
    "nourriture": [
        "achat de pain chez le boulanger", "carrefour express", "monoprix", "franprix", "picard surgelés", "casino shop",
        "grand frais", "biocoop produits bio", "repas à la cantine", "ticket resto", "kfc poulet", "subway sandwich",
        "pizza domino's", "tacos", "bubble tea", "brasserie le midi", "restau avec collègues", "thé et gâteaux salon de thé",
        "pâtisserie gâteau", "chocolat", "bière et chips apéro", "vin cave à vin", "eau et jus de fruits", "lait oeufs beurre",
        "légumes du marché", "viande hachée", "riz pâtes huile", "plats préparés", "burger au food truck",
        "livraison pizza", "just eat", "café à emporter", "déjeuner rapide", "crêpes", "boissons soirée",
    ],
    "transport": [
        "recharge navigo mois", "carte de transport mensuelle", "navigo annuel", "billet rer", "ticket t+", "trajet en tramway",
        "billet sncf aller retour", "oui sncf réservation", "flixbus", "blablacar trajet", "course uber centre ville",
        "taxi aéroport", "essence station total", "carburant shell", "plein diesel", "gazole station leclerc",
        "télépéage vinci", "parking centre ville", "horodateur", "amende stationnement", "pneus", "changement de pneus hiver",
        "révision auto", "pièces détachées voiture", "batterie voiture", "location de voiture", "vélib abonnement", "lime trottinette",
        "billet avion air france", "easyjet", "bagage supplémentaire vol", "assurance moto", "essence scooter", "navette aéroport",
        "borne de recharge électrique",
    ],
    "loisirs": [
        "ciné avec des amis", "ugc cinéma", "pathé gaumont", "abonnement spotify premium", "youtube premium", "canal plus",
        "ocs abonnement", "billet match de foot", "stade de rugby", "billets spectacle", "opéra", "concert de rap",
        "festival de musique", "visite du château", "entrée parc zoo", "disneyland", "parc astérix", "karting",
        "paintball", "billard", "cours de danse", "cours de guitare", "club de tennis", "inscription club de sport",
        "décathlon équipement", "matériel de randonnée", "ski forfait", "location de vélo", "week-end à la mer",
        "nintendo switch jeu", "jeu de société", "achat de livres", "kindle", "sortie bar à cocktails", "boîte de nuit",
    ],
    "logement": [
        "loyer appartement", "loyer novembre", "paiement du loyer", "provision pour charges", "facture edf", "électricité du mois",
        "gaz de ville", "totalenergies gaz", "facture eau veolia", "box sfr", "freebox", "orange fibre internet", "bouygues box",
        "assurance logement maaf", "assurance habitation macif", "ikea table", "canapé conforama", "lit et matelas",
        "frigo", "lave-vaisselle", "aspirateur", "réparation chaudière", "dépannage plombier", "électricien tableau",
        "achat peinture", "brico dépôt", "outils bricolage", "remplacement fenêtres", "frais d'agence immobilière",
        "dépôt de garantie", "déménagement camion", "rideaux et tapis", "produits ménagers", "wc robinet", "taxe ordures ménagères",
    ],
    "santé": [
        "pharmacie ordonnance", "achat médicaments", "paracétamol", "antibiotiques", "crème dermatologique", "rdv chez le généraliste",
        "visite médecin", "consultation spécialiste", "cabinet dentaire", "détartrage", "couronne dentaire", "appareil dentaire",
        "paire de lunettes", "examen de la vue", "séance de kiné", "séance ostéo", "complémentaire santé", "cotisation mutuelle",
        "laboratoire prise de sang", "irm", "échographie", "scanner", "clinique", "forfait hospitalier", "psy séance",
        "thérapie", "orthophoniste", "vaccination grippe", "test covid", "compléments alimentaires", "soins infirmiers",
        "préservatifs", "contraception", "massage thérapeutique", "sage-femme",
    ],
    "autres": [
        "cadeau pour un ami", "cadeau naissance", "anniversaire de maman", "achat vêtements zara", "pull uniqlo", "robe", "manteau",
        "chaussures de ville", "sneakers", "sac à main", "rendez-vous coiffeur", "coupe de cheveux", "manucure", "esthéticienne",
        "salon de beauté", "papeterie cahiers", "livres scolaires", "frais de scolarité", "forfait free mobile", "forfait orange mobile",
        "abonnement bouygues téléphone", "commande amazon", "colissimo envoi", "chronopost", "frais bancaires du mois",
        "cotisation association", "adhésion", "don croix rouge", "tirage photo", "cadeau saint valentin", "bouquet de fleurs",
        "teinturerie", "retouches couturière", "croquettes chien", "vétérinaire", "accessoires smartphone", "coque téléphone",
    ],
}


def exemples_base():
    """Retourne la liste (description, catégorie) du jeu de départ."""
    lots = (EXEMPLES_PAR_CATEGORIE, EXEMPLES_PAR_CATEGORIE_2)
    return [(texte, categorie) for lot in lots for categorie, textes in lot.items() for texte in textes]
