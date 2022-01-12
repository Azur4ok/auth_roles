const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "12h"});
}

class AuthController {
    async registration(request, response) {
        try {
            const errors = validationResult(request)
            if(!errors.isEmpty()){
                return response.status(400).json({message: "произошла ошибка", errors})
            }
            const {username, password} = request.body;
            const candidate = await User.findOne({username})
            if(candidate)
                return response.status(400).json({message: "Пользователь с таким именем уже существует"});
            const hashedPassword = bcrypt.hashSync(password, 8);
            const userRole = await Role.findOne({value: "user"});
            const user = new User({username, password: hashedPassword, roles: [userRole.value]})
            await user.save()
            return response.json({message: "Пользователь успешно зарегистрирован"})
        } catch (e) {
            console.log(e)
            response.status(400).json({message: "registration error"})
        }
    }

    async login(request, response) {
        try {
            const {username, password} = request.body;
            const user = await User.findOne({username})
            if(!user) {
                return response.status(400).json({message: `пользователь ${username} не найден`})
            }
            const validPassword =bcrypt.compareSync(password, user.password);
            if(!validPassword) {
                return response.status(400).json({message: `введен неверный пароль`})
            }
            const token = generateAccessToken(user._id, user.roles);
            return response.json({token})
        } catch (e) {
            console.log(e)
            response.status(400).json({message: "login error"})
        }
    }

    async getUsers(request, response) {
        try {
            response.json("server works")
        } catch (e) {

        }
    }
}

module.exports = new AuthController();