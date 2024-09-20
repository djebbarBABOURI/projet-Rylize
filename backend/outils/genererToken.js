import jsonwebtoken from "jsonwebtoken";
const genererToken_et_setcookie = (id_utilisateur, res)=>{
    const token = jsonwebtoken.sign({id_utilisateur}, process.env.JWT_SECRET, {
        expiresIn: '3d'
    });
    res.cookie("jwt", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "developement"
    })
}
export default genererToken_et_setcookie;