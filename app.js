const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const bookRoutes = require("./routes/bookRoutes");

const transactionRoutes = require("./routes/transactionRoutes");
const helperRoutes = require("./routes/helperRoutes");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("combined"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

connectDB();
app.get("/",(req,res)=>{

    res.send("Hello Welcome To Books")
})
app.use("/api/books", bookRoutes);

app.use("/api/transactions", transactionRoutes);
app.use("/api/helpers", helperRoutes);

app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});



module.exports = app;
