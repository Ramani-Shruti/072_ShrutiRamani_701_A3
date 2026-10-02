const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);


const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
// session configuration
app.use(session({

    // Configure file-storage in session 
    store: new FileStore({
        path :"./sessions",
        retries:0
    }),
    secret: "mySeretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
}));

//protecting routes authentication
function checkLogin(req, res, next) {
    if (req.session.username) {
        next()
    }
    else {
        req.session.returnTo = req.originalUrl
        res.redirect("/login")
    }
}
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/home.html");
});
app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html")
})
app.post("/login", (req, res) => {
    console.log(req.body)
    // res.send("got it");
    const { username, password } = req.body;

    // res.send("got it")  
    if ((username === "admin" && password === "123456") ||(username === "meera" && password === "123")) {
        req.session.username = username
        const redirectUrl = req.session.returnTo || "/home";
        delete req.session.returnTo;
        // res.redirect(redirectUrl);
        res.send("login")

    }
    else {
        res.send("Invalid username or password");
    }
})
app.get("/profile", checkLogin, (req, res) => {
    res.send(`<b>Protected Route</b> username : ${req.session.username} `)
})
app.get("/purchesModel", checkLogin, (req, res) => {
    res.send("<b>Protected Route</b> yes,you can purse the model! with login")
})
app.get("/home", checkLogin, (req, res) => {
    res.send(`Welcome ${req.session.username}`)
})
app.listen(PORT, () => {
    console.log("server is listening on port 3000")
})


