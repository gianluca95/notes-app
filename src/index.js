const express = require("express");
const path = require("path")
const exphbs = require("express-handlebars")
const methodOverride = require("method-override")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")

// Initializations
const app = express();
require("./database");
require("./config/passport")

// Settings
app.set("port", process.env.PORT || 3000); // Si hay un puerto en mi PC que lo use, sino el 3000
app.set("views", path.join(__dirname, "views")); // Configuro la carpeta views
app.engine(".hbs", exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs"
})); // Configuro los handlebars
app.set("view engine", ".hbs") // Usamos los handlebars luego de configurarlos (los activa)

// Middlewares: funciones que se van a ejecutar antes de llegar a las vistas
app.use(express.urlencoded({extended: false})) // Cuando el usuario se quiera registrar por ejemplo, me va a enviar esos datos y yo quiero recibirlos y entenderlos
app.use(methodOverride("_method")); // Sirve para que los formularios puedan enviar otros tipos que no sean GET o POST
app.use(session({
    secret: "mysecretapp",
    resave: true,
    saveUninitialized: true
})); // Autenticar al usuario 
app.use(passport.initialize())
app.use(passport.session())
app.use(flash()) // Sirve para enviar mensajes en las distintas vistas

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next() // SIEMPRE ponerlo para que la web no quede cargando y siga con las otras funciones de abajo
}) // Creo una variable global para que los mensajes salgan en todas las vistas, uno de success y otro de error

// Routes
app.use(require("./routes/index"));
app.use(require("./routes/notes"));
app.use(require("./routes/users"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Server is listenning
app.listen(app.get("port"), () => {
    console.log("Server on port", app.get("port"));
});