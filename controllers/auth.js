const dbClient = require("../db.js")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const maxAge = 3 * 34 * 60 * 60 ;
exports.register = (req,res)=>{
    const {name, email, password, confirm_password} = req.body
    
    dbClient.query('SELECT email from users WHERE email = $1', [email], async(error, results)=>{
        if(error){
            console.log(error);
        }
        // console.log(results)
        if(results.rows.length > 0){
            return res.render('register', {
                message: 'That email is already in use!!'
            })
        }
         if(password !== confirm_password){
            return res.render('register', {
                message: 'Passwords do not match!!'
            })
        }

        let hashedPass = await bcrypt.hash(password, 8)
        dbClient.query('INSERT INTO users (name, email, password) values ($1, $2, $3)', [name, email, hashedPass], (error, results)=>{
            if(error){
                console.log(error);
            }
            else{
                return res.render('register', {
                    message: 'User Registered!!'
                })
            }
        })
    })
    
   
}

exports.login = async(req, res)=>{
    const {email, password} = req.body;
    let hashedPass = await bcrypt.hash(password, 8)
    const result = await dbClient.query('SELECT * FROM users WHERE email = $1', [email], )

    if(result.rows.length === 0){
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const hashedPassFromDB = result.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassFromDB);

    if (!passwordMatch) {
        // Passwords do not match
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Login successful, you can now use the user ID
    const userId = result.rows[0].id;
    const token =  createToken(userId);
    res.cookie('jwt', token,{httpOnly: true, maxAge: maxAge * 1000})
    res.status(201).json({user: userId})
}

exports.logout =(req, res)=>{
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/')
}
const createToken = (id)=>{
    return jwt.sign({id}, 'yash dhumal secret',{
        expiresIn: maxAge
    })
}