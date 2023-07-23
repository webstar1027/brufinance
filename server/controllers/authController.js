const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
  });

  user.password = undefined;

  res.status(statusCode).json({
    success: "true",
    token,
    data: {
      user,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const users = await User.find({});
  console.log(users)

  const user = await User.findOne({ email, provider: "brufinance" });

  if (!user || !user.correctPassword(password)) {
    return next(new AppError("Email or password invalid", 400));
  }

  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser;

  next();
});

exports.getProfile = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

exports.googleSignIn = catchAsync(async (req, res, next) => {
  let user = await User.findOne({
    email: req.body.email,
    provider: "google",
  });

  if (!user) {
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      provider: "google",
    });
  }
  createSendToken(user, 200, req, res);
});

exports.facebookSignIn = catchAsync(async (req, res, next) => {
  let user = await User.findOne({
    email: req.body.email,
    provider: "facebook",
  });

  if (!user) {
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      provider: "facebook",
    });
  }
  createSendToken(user, 200, req, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    msg: "Logged out",
  });
});
