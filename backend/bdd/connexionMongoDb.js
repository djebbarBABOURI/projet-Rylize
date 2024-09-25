import mongoose from "mongoose";


const connexionMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Augmentez le délai (en millisecondes)
        });
        console.log("connexion à MongoDB a été faite avec succés");
    } catch (error) {
        console.log("erreur de connexion à MongoDB ", error.message);
    }
}
export default connexionMongoDB;