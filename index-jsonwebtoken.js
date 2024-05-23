const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const app = express();

const secret = "svkaerblkaenwflkwavlkrnvwewwravjnaervj"

const db = {
    "Ben": "$2b$12$B91lF.9/LdrejwrUeFCNi.FnCi8t3wjDaNdsQLAsvIDuRNLqcPNjC"
};

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get("/", (req, res) => {
    const token = req.cookies["auth"];

    if(!token) {
       return res.send("Please log in");
    }

    try {
        const decodedToken = jsonwebtoken.verify(token, secret)
        console.log(decodedToken);
         res.send(`Welocme, ${decodedToken["username"]}`);
    } catch(err) {
      res.status(401).send("Unauthorized");
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

app.post("/login", async (req, res) => {

     const hash = db[req.body.username];
     console.log("hash", hash);
     if(!hash) {
        return res.status(401).end();
     }

     //Check if password is valid
     const isValid = await bcrypt.compare(req.body.password, hash);
      
     if(!isValid) {
        return res.status(401).send("Unauthorized");
     }

     // Generate token
     const payload = {
        username: req.body.username
     }

     // That's synchronous use, but it is not recommended
    const token =  jsonwebtoken.sign(payload, secret, {expiresIn: "2h"});
     
    res.cookie("auth", token, {httpOnly: true});
      
     res.send("Logged in successfully");
});

app.get("/register", (req, res) => {
    res.send(`
    <form action="/register" method="post">
    <label >Username</label>
    <input type="text" name="username" />
    <label >Password</label>
    <input type="password" name="password">
    <input type="submit" value="register">
</form>
    `)
});

app.post("/register", async (req, res) => {
    //HASH PASSWORD

    //  const salt = await bcrypt.genSalt(10);
    //  const saltedHash = await bcrypt.hash(req.body.password, salt);
    const hash = await bcrypt.hash(req.body.password, 12);
    console.log(hash);
    db[req.body.username] = hash;
   
    res.redirect("/login");

});

app.get("/logout", (req, res) => {
    res.clearCookie("user");


    res.send(`User logged out seuccesffully!`);
});

app.listen(5000, () => console.log("Server is listning on http://localhost:5000 ..."))