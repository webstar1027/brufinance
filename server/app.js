const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');
const authRouter = require("./routes/authRoutes");
const nftRouter = require("./routes/nftRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// const whitelist = ["http://localhost:4200"];
// const corsOptions = {
//   origin: '*',
// };

// app.use(
//   cors({
//     maxAge: 3600,
//     credentials: true,
//     methods: 'GET, HEAD, OPTIONS, PUT, POST, DELETE, PATCH',
//     headers:
//       'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials',
//     expose: ['Authorization', 'Access-Control-Allow-Origin'],
//   })
// );
const corsOptions = {
  origin: ['https://v2.bru.finance',
    'https://uat.bru.finance',
    'https://celo.bru.finance',
    'http://localhost:4200',
    'http://localhost:3030',
    'http://localhost:8100'],
  credentials: true,

}
app.use(cors(corsOptions));

// app.options('*', cors(corsOptions));
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || whitelist.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/nfts", nftRouter);

// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't ${req.method} ${req.originalUrl}`, 404));
// });
// Serving static index.html
app.get('*', (req, res) => {
  // next(new AppError(`Can't ${req.method} ${req.originalUrl}`, 404));
  res.sendFile(path.join(__dirname, '404.html'));
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

app.use(globalErrorHandler);

module.exports = app;
