const express=require("express")
const router = express.Router()
const {registerUser,loginUser,currentUser, deleteUser, logoutUser}=require("../controllers/userControllers")
const validateToken=require("../middleware/validateTokenHandler")

router.post("/register",registerUser)
router.delete("/delete/:id",deleteUser)

router.post("/login",loginUser)

router.get("/current",validateToken,currentUser)
// Logout route
router.post('/logout',validateToken, logoutUser);

module.exports=router;