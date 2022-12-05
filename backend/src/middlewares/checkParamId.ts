import { RequestHandler } from "express";

const checkParamId: RequestHandler<{ id: string }> = (req, res, next) => {
  if (!req.params.id) {
    const error: any = new Error('Param "id" missing');
    error.statusCode = 400;
    throw error;
  } else {
    next();
  }
};
export default checkParamId;
