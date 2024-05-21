const express = require("express");

const app = express();

app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
  
    const loginInfo = req.header("Cookie");
    if(loginInfo) {
        res.send(`Hello, ${loginInfo.split("=").at(1)}`);
    } else {
    res.send("Please login");
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
    console.log(req.body);

    res.header("Set-Cookie", `login-info=${req.body.username}`);

    res.end();
});

app.listen(5000, () => console.log("Server is listning on http://localhost:5000 ..."))