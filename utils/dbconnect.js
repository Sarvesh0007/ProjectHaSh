const mongoose = require("mongoose");
exports.dbConnect = async (URI) => {
  // mongoose and mongodb connect
  try {
    const db = await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    if (db) return true;
    return false;
  } catch (error) {
    console.log("databse error ", error);
  }
};
