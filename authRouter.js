const Router = require('express');
const controller = require('./authController')
const router = new Router();
const {check} = require('express-validator')

router.post("/registration", [
    check("username", "Имя пользователя не может быть пустым").notEmpty(),
    check("password", "длина пароля не может быть меньше 8 и больше 20").isLength({min: 8, max: 20})
], controller.registration)
router.post("/login", controller.login)
router.get("/users", controller.getUsers)

module.exports = router;