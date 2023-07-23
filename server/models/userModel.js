const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  photoUrl: {
    type: String,
  },
  provider: {
    type: String,
    default: "brufinance",
  },
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  // const aaa = await bcrypt.compare(candidatePassword, this.password)
  // console.log("============candidatePassword==============".candidatePassword, aaa)
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema, "bruusers");

module.exports = User;
