import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const code = err.statusCode || 500;
  const msg = err.message || "Server error";
  res.status(code).json({
    success: false,
    status: code,
    message: msg,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

export default errorHandler;
