const db = require("./data/db");
const auth = require("./routes/auth.js");

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

db.connect();

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Connected Angkot API!");
});

//routing
app.use(auth);

app.listen(port, () => {
  console.log(`Express app listening at port: http://localhost:${port}/`);
});