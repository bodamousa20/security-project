const userdb = require('../Model/user')
const jwt = require ('jsonwebtoken');


const handleerror = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

module.exports.signup_get = (req,res)=>{   // بتصدر الملفات للي هيعمل include 
    res.render('signup')
}

module.exports.login_get = (req,res)=>{

res.render('login')

}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCreated = await userdb.create({ email, password });
        const token = Create_token(userCreated._id); // create token and return it here 
        res.cookie('jwt', token, { httpOnly: true, maxAge: tokenAge * 500 }); // save the token in a cookies in browser 

        
       // console.log('User created:', userCreated._id);
        res.status(200).json({ user: userCreated._id });
    } catch (err) {
        const error = handleerror(err);
        console.error('Signup error:', error);
        res.status(400).json({ error: error });
    }
}


const tokenAge = 3*60*500 ; 
const Create_token = (id)=>{
    return jwt.sign({id},'bodamousa',{
        expiresIn : tokenAge 
    });
}


module.exports.login_post = async (req, res) => {
    console.log(req.body); // Add this line to log the request body
    const { email, password } = req.body;
    try {
        const user = await userdb.login(email, password);
        res.status(200).json({ user: user._id });
    } catch (error) {
        console.error('Login error:', error); // Add this line to log any errors
        res.status(400).json({});
    }
}   
