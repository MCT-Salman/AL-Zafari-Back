import { validationResult } from "express-validator";
import { FAILURE_REQUEST } from "../validators/messagesResponse.js";
import { BAD_REQUEST_STATUS_CODE } from "../validators/statusCode.js";

export const validate = (rules) => {
  return [
    ...(Array.isArray(rules) ? rules : [rules]),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const details = errors.array().map((e) => ({
          field: e.param,
          message: e.msg,
          location: e.location,
        }));
        return res.status(BAD_REQUEST_STATUS_CODE).json({
          success: FAILURE_REQUEST,
          message:details[0].message,
          data:{}
        });
      }
      next();
    },
  ];
};
