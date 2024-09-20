import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authautification.routes.js";
import connexionMongoDB from "./bdd/connexionMongoDb.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;
app.get("/",(req,res)=>{
    res.send("hello ,jjpppooo!!");
})
//pour permettre d'extraire les données depuis req.body
app.use(express.json());

app.use("/api/authautification/", authRoutes);
app.listen(port, ()=>{
    connexionMongoDB();
    console.log(`server running on port ${port}`);
});