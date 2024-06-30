const UsersModel = require('../models/usersModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * User SignUp Controller
 * @param {Object} req
 * @param {Object} res
 * @returns Signup - status and message/error
 */
const signupUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({ error: "email and password required" });
        }

        //Check Email already exists
        const user = await UsersModel.findOne({ email });
        if (user) {
            return res.status(422).json({ error: "email already exists" });
        }

        //Password Hash
        const hashedPassword = await bcrypt.hash(password, 11);

        //Save into DB
        await new UsersModel({
            email,
            password: hashedPassword
        }).save();

        return res.status(201).json({ message: "Signup success, you can login now." });
    } catch (error) {
        res.status(400).json({ error: 'internal server error: ' + error })
    }
}

/**
 * User SignIn Controller
 * @param {Object} req
 * @param {Object} res 
 * @returns Signin - status and message/error
 */
const signinUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({ error: "email and password required" });
        }

        const user = await UsersModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "invalid user" });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            return res.status(401).json({ error: "invalid Email and Password" });
        }

        // Update login state
        user.lastLogin = new Date();
        user.isLoggedIn = true;
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_AUTH_SERVICE);

        return res.status(200).json({
            token,
            message: "Login success",
        });
    } catch (error) {
        res.status(400).json({ error: 'internal server error: ' + error });
    }
}

const testProtected = async (req, res) => {
    try {
        res.status(200).json({ message: 'Access in protected resources', user: req.user })
    } catch (error) {
        res.status(400).json({ error: 'internal server error: ' + error })
    }
}

const testUnProtected = async (req, res) => {
    try {
        res.status(200).json({ message: 'Access in Un-protected resources', user: req.user })
    } catch (error) {
        res.status(400).json({ error: 'internal server error: ' + error })
    }
}

const isUserSignedIn = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await UsersModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check login status
        if (user.isLoggedIn) {
            return res.status(200).json({ message: 'User is signed in', lastLogin: user.lastLogin });
        } else {
            return res.status(401).json({ message: 'User is not signed in' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error: ' + error });
    }
}

module.exports = { signupUser, signinUser, testUnProtected, testProtected, isUserSignedIn };