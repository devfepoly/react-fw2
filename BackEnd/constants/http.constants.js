// HTTP Status Codes
module.exports = {
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        INTERNAL_SERVER_ERROR: 500
    },

    MESSAGES: {
        SUCCESS: 'Thành công',
        CREATED: 'Tạo mới thành công',
        UPDATED: 'Cập nhật thành công',
        DELETED: 'Xóa thành công',
        NOT_FOUND: 'Không tìm thấy',
        BAD_REQUEST: 'Dữ liệu không hợp lệ',
        INTERNAL_ERROR: 'Lỗi hệ thống'
    }
};
