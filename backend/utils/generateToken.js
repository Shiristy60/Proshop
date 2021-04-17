import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    // sign method is used to generate a token
    // id - id of the user who logs in 
    // process.env.JWT_SECRET - secret key
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // 30 days
    })
}

export default generateToken