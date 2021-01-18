const moongose = require("mongoose")
const bcrypt = require("bcryptjs")

const {Schema} = moongose

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now},
})

// Creo un método para cifrar las contraseñas
UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10) // Aplica un hash 10 veces
    const hash = bcrypt.hash(password, salt)
    return hash
}

// Creo un método para comparar la contraseaña que pone el usuario vs la encriptada
UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
} 

module.exports = moongose.model("User", UserSchema)