import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyAdmin = asyncHandler(async (req, res, next) => {
    if (req.user?.role !== 'admin') {
        throw new ApiError(403, "You do not have permission to perform this action");
    }
    next();
});

export { verifyAdmin };