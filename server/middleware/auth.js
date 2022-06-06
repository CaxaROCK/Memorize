import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// if user wants to like a post
// click the like button => auth middleware (NEXT) => like controller...

// ? basically confirms that user has permissions to do something on the website,
// ? for example he cannot like same post twice, he cannot create/update/delete post if he's not loggedin
// ? or is not the author of the post and etc. this is how we put a restriction on user access

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
