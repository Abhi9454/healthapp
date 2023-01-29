import userModel from '../models/userModel.js';
import pkg from 'bcryptjs';
const { genSalt, hash, compare } = pkg;
import pkgs from 'jsonwebtoken';
const { sign } = pkgs;

export async function signUp(req, res) {
    try {
        const { firstName, lastName, email, password, userType, phone, organizationName, partnerId } = req.body;
        let user = await userModel.findOne({ email });
        if (user)
        return res.status(400).json({ success: false, message: "Email Already Exists" });
        user = new userModel({ firstName, lastName, email, password, userType, phone, organizationName, partnerId });
        const salt = await genSalt(10);
        user.password = await hash(password, salt);
        await user.save();
        const payload = { id: user.id };
        sign(
            payload,
            "healthapp", {
            expiresIn: '10d'
        },
            (err, token) => {
                if (err)
                    throw err;
                res.status(200).json({
                    success: true, message: {
                        token: token,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phoneNumber: user.phone,
                        userType: user.userType,
                        organizationName: user.organizationName
                    }
                });
            }
        );
    }
    catch (error) {
        console.log('error', error);
        res.status(400).json({ success: false, message: error.message });
    }
}
export async function login(req, res) {
    console.log('cominerg');
    try {
        const { email, password } = req.body;
        let user = await userModel.findOne({ email, active: 1 });
        if (user) {
            const validPassword = await compare(password, user.password);
            if (validPassword) {
                const payload = {
                    id: user.id
                };

                sign(
                    payload,
                    "healthapp", {
                    expiresIn: '10d'
                },
                    (err, token) => {
                        if (err)
                            throw err;
                        //sendEmail("mishra.abhi8888@gmail.com")
                        res.status(200).json({
                            success: true, message: {
                                token: token,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                id: user._id,
                                phoneNumber: user.phone,
                                userType: user.userType,
                                organizationName: user.organizationName,
                            }
                        });
                    }
                );
            }
            else {
                return res.status(400).json({
                    success: false, message: "Invalid email/password"
                });
            }
        }

        else {
            return res.status(400).json({
                success: false, message: "No user exists"
            });
        }
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

