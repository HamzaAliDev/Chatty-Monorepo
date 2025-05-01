import jwt from 'jsonwebtoken';

const verifyAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization
        const tokenSplit = token.split(" ")[1];
        // console.log("token", tokenSplit);

        if (!tokenSplit) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(tokenSplit, process.env.SECRET_KEY);

        if (!decoded) return res.status(401).json({ message: "Unauthorized" });

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(409).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export default verifyAuth;