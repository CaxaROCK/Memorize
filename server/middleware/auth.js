import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500; //if token is shorter than 500 - it's our 'custom made', if longer - it's from google
        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.REACT_APP_SECRET);

            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub; // sub is a google thingy that differentiates every google user, basically an id
        }

        next();
    } catch (error) {
        console.log(error);
    }
};

export default auth;
