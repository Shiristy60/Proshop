import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})

// method to match the password with stored password and plain text password that user entered
// stored password is hashed, that is why we use bcryptjs's compare method.
// Returns a promise for whether this password compares to equal this hashed password.
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// before saving the data, run an async function which we typically call next , and when invoked — advances the document/query to the next awaiting middleware
userSchema.pre('save', async function (next) {
    // in case we are updating profile info and we have not changed our password, we do not want hashing of old password to take place again
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User