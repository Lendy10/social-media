const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('x-code-token');
        if (!token) {
            res.status(401).json({
                message: "Invalid Credential"
            })
        }

        //decode token
        const decode = await jwt.decode(token, config.get('jsonSecret'));
        req.id = decode.user.id;
        next();
    } catch (err) {
        res.status(403).json({
            message: "something goes wrong"
        });
        console.error(err);
    }
}