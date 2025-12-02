/**
 * Custom error handler for catching async errors
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Database error handler
 */
const handleDatabaseError = (err, res) => {
    console.error('Database Error:', err);

    const { errorResponse } = require('./response.helper');
    const { HTTP_STATUS } = require('../constants/http.constants');

    return errorResponse(
        res,
        'Lỗi cơ sở dữ liệu',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
};

module.exports = {
    asyncHandler,
    handleDatabaseError
};
