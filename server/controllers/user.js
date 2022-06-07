import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.js";

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser)
            return res.status(404).json({ message: `User doesn't exist` });

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!isPasswordCorrect)
            return res.status(400).json({ message: `Invalid password` });

        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id },
            `sercret_thingy_goes_here`, // "test" here is a secret that we use to make 'hacking' harder for others. needs to be in .env file for security reasons
            { expiresIn: "5h" } // exparation time of a token, after an hour user will have to relogin
        );

        res.status(200).json({ user: existingUser, token }); //returning user & token
    } catch (error) {
        res.status(500).json({ message: `Something went wrong` });
    }
};

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: `User already exists` });

        if (password !== confirmPassword)
            return res.status(400).json({ message: `passwords don't match` });
        const hashedPassword = await bcrypt.hash(password, 12); //crypting the password to minimize the chances of data leakage (12 is the dificulty level of encryption)
        const user = await User.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`,
        });
        const token = jwt.sign(
            { email: user.email, id: user._id },
            `sercret_thingy_goes_here`,
            {
                expiresIn: "5h",
            }
        );
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: `something went wrong` });
    }
};
