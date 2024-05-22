const express = require("express");
const session = require("express-session")
const app = express();

app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: "Victoria's secret",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

app.get("/", (req, res) => {
    console.log(req.session);

    if(req.session.userInfo) {
       res.send(req.session.userInfo.username);
    } else {
        res.send("Please login!");
    }
});

app.get("/login", (req, res) => {
    res.send(`
<form action="/login" method="post">
    <label >Username</label>
    <input type="text" name="username" />
    <label >Password</label>
    <input type="password" name="password">
    <input type="submit" value="login">
</form>
`)
});

app.post("/login", (req, res) => {
    req.session.userInfo = req.body;
    req.session.privateInfo = "This is the private info"

    res.end();
});

app.get("/logout", (req, res) => {
req.session.destroy()
    res.end();
});

app.listen(5000, () => console.log("Server is listning on http://localhost:5000 ..."))