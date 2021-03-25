const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    last_name: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    // TODO: CoMe BaCk here this is critical
    enc_password: {
      type: String,
      required: true,
    },
    // ! SALT is very important
    salt: String,
    // 0 common user , 1 patient,2 doctor , 8990 admin
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ? Virutuals for schema
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.enc_password = this.securePassword(password);
  })
  .get(() => {
    return this._password;
  });

// ? schema methods
userSchema.methods = {
  // check for valid password during signin
  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.enc_password;
  },
  // encrypt the password so that it's not visible as plain text
  securePassword: function (plainPassword) {
    if (!plainPassword) {
      return "";
    }
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

exports.User = mongoose.model("User", userSchema);
