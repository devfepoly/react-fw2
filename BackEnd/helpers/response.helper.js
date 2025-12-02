const { HTTP_STATUS, MESSAGES } = require('../constants/http.constants');

/**
 * Success response helper
 */
const successResponse = (res, data, message = MESSAGES.SUCCESS, statusCode = HTTP_STATUS.OK) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Error response helper
 */
const errorResponse = (res, message = MESSAGES.INTERNAL_ERROR, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};

/**
 * Created response helper
 */
const createdResponse = (res, data, message = MESSAGES.CREATED) => {
    return successResponse(res, data, message, HTTP_STATUS.CREATED);
};

/**
 * Not found response helper
 */
const notFoundResponse = (res, message = MESSAGES.NOT_FOUND) => {
    return errorResponse(res, message, HTTP_STATUS.NOT_FOUND);
};

/**
 * Bad request response helper
 */
const badRequestResponse = (res, message = MESSAGES.BAD_REQUEST) => {
    return errorResponse(res, message, HTTP_STATUS.BAD_REQUEST);
};

module.exports = {
    successResponse,
    errorResponse,
    createdResponse,
    notFoundResponse,
    badRequestResponse
};
