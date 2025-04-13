const mongoose = require("mongoose");
const User = require("./UserSchema"); // Adjust the path to your User model

// Connect to your MongoDB database
mongoose.connect("mongodb://localhost:27017/filmjunc", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");

  // Delete documents where 'Username' is null
  User.deleteMany({ Username: null })
    .then(result => {
      console.log(`${result.deletedCount} documents with null usernames were deleted.`);
      mongoose.connection.close(); // Close the connection after cleanup
    })
    .catch(err => {
      console.error("Error deleting documents:", err);
      mongoose.connection.close();
    });
})
.catch(err => {
  console.error("Error connecting to MongoDB:", err);
});
