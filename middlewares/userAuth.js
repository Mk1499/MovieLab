const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      throw "Un Authenticated Request";
    }
    const decodedToken = jwt.verify(token, process.env.tokenSecret).userData;

    console.log("AUTH : ", decodedToken);
    const userType = decodedToken.type;
    const userId = decodedToken.id;
    if (!userType) {
      throw "Un Authorized Request";
    } else if (userType === "admin" || userId == req.params.userId) {
      next();
    } else {
      throw "Un Authorized Request";
    }
  } catch (error) {
    console.log("err : ", error);

    res.status(401).send({
      error
    });
  }
};