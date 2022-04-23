const UserSchema = require("../Models/user");
const dbConnection = require("../dbConnection");
let dbC;

function setConnection(newConnection) {
  dbC = newConnection;
  return dbC;
}

async function getUsers() {
  dbC = dbConnection.getDbConnection(dbC);
  const userModel = dbC.model("User", UserSchema);
  let userResults = await userModel.find().lean();
  return userResults;
}

async function getUserByEmail(email) {
  dbC = dbConnection.getDbConnection(dbC);
  const userModel = dbC.model("User", UserSchema);
  try {
    let result = await userModel.findById(id).lean();
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function addUser(user) {
  dbC = dbConnection.getDbConnection(dbC);
  const userModel = dbC.model("User", UserSchema);
  // generate salt to hash password
  const salt = await bcrypt.genSalt(process.env.PASSWORD_SALT);
  const hashedPWd = await bcrypt.hash(user.password, salt);
  user.password = hashedPWd;

  try {
    const userToAdd = new userModel(user);
    var savedUser = await userToAdd.save();

    user._id = savedUser._id;
    return user;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateUser(user) {
  dbC = dbConnection.getDbConnection(dbC);
  const userModel = dbC.model("User", UserSchema);
  try {
    let updatedUser = await userModel
      .findOneAndUpdate(
        { _id: user._id },
        {
          email: user.email,
          password: user.password,
          administrator: user.administrator,
          associatedClient: user.associatedClient,
        },
        { returnOriginal: false }
      )
      .lean();
    await formatClient(updatedUser);
    return updatedUser;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteUserById(id) {
  dbC = dbConnection.getDbConnection(dbC);
  const userModel = dbC.model("Client", UserSchema);
  try {
    return await userModel.findByIdAndRemove(id);
  } catch (error) {
    console.log(error);
    return false;
  }
}

exports.setConnection = setConnection;
exports.getUsers = getUsers;
exports.getUserByEmail = getUserByEmail;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUserById = deleteUserById;
