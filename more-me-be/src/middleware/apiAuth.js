import { errorResponse } from '../helpers';
import { User } from '../models';

const jwt = require('jsonwebtoken');

const apiAuth = async (req, res, next) => {
  console.log("apiAuth middleware triggered"); // Debugging line

  if (!(req.headers && req.headers['x-token'])) {
    console.log("Token is not provided"); // Debugging line

    return errorResponse(req, res, 'Token is not provided', 401);
  }
  const token = req.headers['x-token'];
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded.user;
    console.log("Decoded token:", decoded); // Debugging line

    const user = await User.scope('withSecretColumns').findOne({
      where: { email: req.user.email },
    });
    if (!user) {
      console.log("User is not found in system"); // Debugging line
      return errorResponse(req, res, 'User is not found in system', 401);
    }
    const reqUser = { ...user.get() };
    reqUser.userId = user.id;
    req.user = reqUser;
    console.log("User authenticated:", reqUser); // Debugging line
    return next();
  } catch (error) {
    console.log("Token verification failed:", error); // Debugging line

    return errorResponse(
      req,
      res,
      'Incorrect token is provided, try re-login',
      401,
    );
  }
};

export default apiAuth;
