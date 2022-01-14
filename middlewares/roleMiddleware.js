const jwt = require('jsonwebtoken')
const {secret} = require('../config')

module.exports = (roles) => {
    return (request, response, next) => {
        if (request.method === "OPTIONS") {
            next();
        }
        try {
            const token = request.headers.authorization.split(" ")[1];
            if (!token) {
                return response.status(403).json({message: "Пользователь не авторизован"})
            }
            const {roles: userRoles} = jwt.verify(token, secret);
            let hasRole = false;
            userRoles.forEach((role) => {
                if(roles.includes(role)) {
                    hasRole = true;
                }
            })
            if(!hasRole) {
                return response.status(403).json({message: "у Вас нет доступа"})
            }
            next()
        } catch (e) {
            console.log(e)
            return response.status(403).json({message: "Пользователь не авторизован"})
        }
    }
}