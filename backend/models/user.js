// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const Joi = require('joi');
// const passwordComplexity = require('joi-password-complexity');

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },             
//     email: { type: String, required: true },
//     phone: { type: String, required: true },
//     password: { type: String, required: true },
//     confirmPassword: { type: String, required: true },
//     role: { type: String, default: 'user' }, 
// });

// userSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign({_id:this._id}, process.env.JWTPRIVATEKEY, {expiresIn:"8d"});
//     return token

// };

// const User = mongoose.model("user", userSchema);

// const validate = (data) => {
//     const schema = Joi.object({
//         name : Joi.string().required().label("Name"),
//         email : Joi.string().required().label("Email"),
//         phone : Joi.string().required().label("Phone"),
//         password : Joi.string().required().label("Password"),
//         confirmPassword : Joi.string().required().label("Confirm Password"),
//     });
//     return schema.validate(data);
// }

// module.exports = {User, validate}



const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },             
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }, 
});

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { _id: this._id, role: this.role }, 
        process.env.JWTPRIVATEKEY, 
        { expiresIn: "8d" }
    );
};

const User = mongoose.model("user", userSchema);

// Validate user input before storing in DB
const validate = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().label("Name"),
        email: Joi.string().email().required().label("Email"),
        phone: Joi.string().required().label("Phone"),
        password: passwordComplexity().required().label("Password"),
        confirmPassword: Joi.string()
            .valid(Joi.ref("password"))
            .required()
            .label("Confirm Password")
            .messages({ "any.only": "Passwords must match" }),
    });
    return schema.validate(data);
};

module.exports = { User, validate };

