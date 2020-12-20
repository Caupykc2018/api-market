const AuthService = require('../services/auth')

class AuthController {
    async register(req, res) {
        try {
            const result = await AuthService.register(req.body);
            res.status(200).json(result);
        }
        catch(e) {
            res.status(422).json(e);
        }
    }

    async login(req, res) {
        try {
            const result = await AuthService.login(req.body);
            res.status(200).json(result);
        }
        catch(e) {
            res.status(422).json(e);
        }
    }

    async me(req, res) {
        try{
            const result = await AuthService.me(req.user.id);
            res.status(200).json(result);
        }
        catch(e) {
            console.log(e);
            res.status(401);
        }
    }
}

module.exports = new AuthController();
