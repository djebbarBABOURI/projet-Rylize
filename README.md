# projet-Rylize
test pour Rylize
Application de Suivi des Dépenses Personnelles
Description du projet
L'application de suivi des dépenses personnelles permet aux utilisateurs d'enregistrer, de catégoriser, et de visualiser leurs dépenses quotidiennes. Le but est d'aider les utilisateurs à comprendre leurs habitudes de consommation à travers une interface simple et intuitive. Ils peuvent ajouter des dépenses, les visualiser sous forme de tableaux et graphiques, et analyser leurs finances personnelles.
Fonctionnalités principales
1.	Inscription et Connexion :
o	Création de compte.
o	Connexion sécurisée pour accéder aux données personnelles.
2.	Affichage et Modification du Profil :
o	Modification des informations personnelles (nom, prénom, adresse, photo).
3.	Ajout de Dépenses :
o	Interface pour ajouter une dépense avec les champs : montant, catégorie, date, et description optionnelle.
4.	Affichage des Dépenses :
o	Liste des dépenses récentes avec options de filtrage.
5.	Visualisation des Données :
o	Graphiques interactifs pour visualiser la répartition des dépenses par catégorie.
6.	Modification et Suppression de Dépenses :
o	Modification ou suppression des dépenses enregistrées.

Bonnes Pratiques
•	Code propre et structuré : Utilisation des conventions de nommage et de l'architecture MVC pour une meilleure lisibilité et organisation.
•	Sécurité : Hachage des mots de passe et validation des entrées pour protéger les données sensibles.
Utilisation de l'Application
Pour utiliser l'application, suivez ces étapes :
1.	Démarrage de l'application :
Assurez-vous de lancer à la fois le frontend et le backend. Le frontend est accessible à l'adresse http://localhost:3000 tandis que le backend tourne en local sur le port configuré.
2.	Création d'un compte :
Si vous n'avez pas encore de compte, vous pouvez en créer un via l'interface Inscription. Remplissez vos informations personnelles pour créer un compte utilisateur.
3.	Connexion :
Si vous avez déjà un compte, accédez à l'application via l'interface Authentification en vous connectant avec vos identifiants.
4.	Navigation vers la page d'accueil (Home) :
Après vous être connecté, vous serez redirigé directement vers la page d'accueil où vous pourrez :
o	Voir la liste complète de vos dépenses.
o	Ajouter, modifier ou supprimer des dépenses existantes.
o	Utiliser les filtres pour trier vos dépenses par catégorie ou par période.
o	Voir la répartition des dépenses par catégorie grâce aux Graphes interactifs.
5.	Gestion de votre profil :
Depuis la page d'accueil, vous avez également la possibilité d'accéder à votre profil. Vous pourrez modifier vos informations personnelles telles que votre nom, adresse ou photo de profil.
Cette application propose une interface intuitive et une gestion simplifiée pour vous aider à suivre vos dépenses au quotidien.

Instructions d'Installation et d'Exécution de l'Application Localement
Voici les étapes détaillées pour installer et exécuter localement l'application de suivi des dépenses :
Prérequis
Assurez-vous d'avoir installé les outils suivants sur votre machine :
•	Node.js (v14 ou supérieure) 
•	npm (généralement installé avec Node.js)
•	MongoDB (pour la base de données) 
•	Git (pour cloner le dépôt) 
1. Cloner le Dépôt GitHub
Commencez par cloner le dépôt contenant le code de l'application. Cela peut inclure deux parties : frontend et backend.
git clone https://github.com/djebbarBABOURI/projet-Rylize.git
cd projet-Rylize
2. Configuration du Backend
a) Installation des dépendances
Installez les dépendances Node.js (car le fichier package.json pour le backend est au meme niveau avec le dossier de backend).
npm install
b) Configuration des variables d'environnement
Créez un fichier .env dans le dossier backend et configurez les variables d'environnement nécessaires, telles que la connexion à la base de données MongoDB et le secret pour le JWT (JSON Web Token) utilisé pour l'authentification.
Exemple de fichier .env :
PORT=8000 
MONGO_URI=mongodb://localhost:27017/nom-de-la-base JWT_SECRET=unSecretTresFort

c) Lancement du serveur backend
Après avoir installé les dépendances et configuré les variables d'environnement, démarrez le serveur backend.
npm run server 
Le backend devrait maintenant être accessible sur http://localhost:8000.
3. Configuration du Frontend
a) Installation des dépendances
Naviguez ensuite dans le répertoire frontend et installez les dépendances nécessaires
cd ../frontend
npm install
b) Lancement du serveur frontend
Après l'installation des dépendances, lancez le serveur frontend.
npm run dev
Le frontend devrait maintenant être accessible sur http://localhost:3000.
4. Utilisation de l'Application
1.	Ouvrez votre navigateur et accédez à http://localhost:3000.
2.	Inscription : Si vous n'avez pas encore de compte, créez-en un via l'interface d'inscription.
3.	Connexion : Si vous avez déjà un compte, connectez-vous avec vos identifiants.
4.	Ajouter des Dépenses : Une fois connecté, vous pourrez ajouter, modifier et supprimer des dépenses depuis la page d'accueil.
5.	Profil : Vous pouvez également accéder à votre profil pour mettre à jour vos informations personnelles.
5. (Optionnel) Lancement de MongoDB
Si MongoDB n'est pas déjà démarré, assurez-vous de lancer votre serveur MongoDB localement avec :
mongod
6. Tests (Optionnel)
Si des tests unitaires ou d'intégration sont inclus dans le projet, vous pouvez les exécuter avec :
npm test
7. Conteneurisation (Optionnel)
Si vous utilisez Docker, vous pouvez lancer l'application via docker-compose pour démarrer le frontend, le backend, et la base de données MongoDB dans des conteneurs.
1.	Créez un fichier docker-compose.yml pour définir les services frontend, backend, et MongoDB.
2.	Démarrez les services avec la commande suivante :
docker-compose up
L'application devrait être accessible via http://localhost:3000.
________________________________________
L'application est maintenant prête à être utilisée localement !

