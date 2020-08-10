require("dotenv").config();
let express = require("express");
let app = express();
let sequelize = require("./db");
let headers = require("./middleware/headers");
// let temp = require("./controllers/templateController");
let user = require("./controllers/templateUserController");
 let maker = require("./controllers/templateMakerController");

app.use(headers);
sequelize.sync();
app.use(express.json());
// app.use("/polis", temp);
app.use("/polis", user);
 app.use("/polis", maker);

app.listen(3000, function () {
  console.log("App is listening on port 3000");
});
