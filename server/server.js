const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({});
const conf = require('./config');
const app = require("./app");

mongoose
  .connect(conf.mongo.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to Database ${conf.mongo.name}`);
    // lien.run();
  })
  .catch((err) => console.log(err));

app.listen(conf.port, () => {
  console.log("Server running on", conf.port);
});
