const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const User = require("../models/User")

passport.use(new LocalStrategy({
    usernameField: "email"
}, async (email, password, done) => {
    const user = await User.findOne({email: email})
    if (!user) {
        return done(null, false, {message: "Usuario no encontrado"}) // null error, false ningun usuario, mensaje
    } else {
        const match = await user.matchPassword(password)
        if (match) {
            return done(null, user) // nul error, hay usuario
        } else {
            return done(null, false, {message: "Contraseña incorrecta"})
        }
    }
}))

// Toma un usuario y genera un id para que no tengas que estar logueandote todo el tiempo en cada vista
passport.serializeUser((user, done) => {
    done(null, user.id)
})

// Proceso inverso, de un id busco si el usuario está en la base
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})