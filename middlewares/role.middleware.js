import { FAILURE_REQUEST, NO_AUTH } from "../validators/messagesResponse.js";
import { UNAUTHORIZED_STATUS_CODE, FORBIDDEN_STATUS_CODE  } from "../validators/statusCode.js";
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(UNAUTHORIZED_STATUS_CODE).json({ 
        success: FAILURE_REQUEST, 
        message: NO_AUTH,
        data: {}
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(FORBIDDEN_STATUS_CODE).json({ 
         success: FAILURE_REQUEST, 
        message: NO_AUTH,
        data: {}
      });
    }

    next();
  };
};
