import jsonwebtoken from "jsonwebtoken";
import config from "../config/env.js";
const genererToken_et_setcookie = (id_utilisateur, res)=>{
    const token = jsonwebtoken.sign({id_utilisateur}, config.jwtSecret, {
        expiresIn: '3d'
    });
    res.cookie("jwt", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: config.isProd
    })
}
export default genererToken_et_setcookie;