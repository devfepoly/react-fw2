import * as Yup from 'yup';

/**
 * Validation Schema cho News Form
 */
export const newsValidationSchema = Yup.object({
    tieu_de: Yup.string()
        .required('Tiêu đề không được để trống')
        .min(5, 'Tiêu đề phải có ít nhất 5 ký tự')
        .max(200, 'Tiêu đề không được vượt quá 200 ký tự'),

    slug: Yup.string()
        .matches(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang')
        .max(255, 'Slug không được vượt quá 255 ký tự'),

    mo_ta: Yup.string()
        .max(500, 'Mô tả không được vượt quá 500 ký tự'),

    noi_dung: Yup.string()
        .required('Nội dung không được để trống')
        .min(20, 'Nội dung phải có ít nhất 20 ký tự'),

    id_loai: Yup.number()
        .required('Vui lòng chọn loại tin')
        .positive('Loại tin không hợp lệ'),

    hinh: Yup.string()
        .url('URL hình ảnh không hợp lệ'),

    ngay: Yup.date()
        .required('Ngày đăng không được để trống')
        .max(new Date(), 'Ngày đăng không được ở tương lai'),

    an_hien: Yup.number()
        .oneOf([0, 1], 'Giá trị không hợp lệ'),

    hot: Yup.number()
        .oneOf([0, 1], 'Giá trị không hợp lệ'),

    luot_xem: Yup.number()
        .min(0, 'Lượt xem không được âm'),

    tags: Yup.string()
        .max(255, 'Tags không được vượt quá 255 ký tự')
});

/**
 * Validation Schema cho Product Form
 */
export const productValidationSchema = Yup.object({
    ten_sp: Yup.string()
        .required('Tên sản phẩm không được để trống')
        .min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự')
        .max(200, 'Tên sản phẩm không được vượt quá 200 ký tự'),

    gia: Yup.number()
        .transform((value, originalValue) => {
            return originalValue === '' ? undefined : value;
        })
        .required('Giá không được để trống')
        .positive('Giá phải là số dương')
        .min(1000, 'Giá phải lớn hơn 1,000đ')
        .max(1000000000, 'Giá không được vượt quá 1 tỷ đồng'),

    gia_km: Yup.number()
        .transform((value, originalValue) => {
            return originalValue === '' ? null : value;
        })
        .nullable()
        .positive('Giá khuyến mãi phải là số dương')
        .when('gia', (gia, schema) => {
            return schema.test({
                test: function (gia_km) {
                    if (!gia_km) return true; // Cho phép null/undefined
                    const giaValue = Number(this.parent.gia);
                    return Number(gia_km) < giaValue;
                },
                message: 'Giá khuyến mãi phải nhỏ hơn giá gốc'
            });
        }),

    id_loai: Yup.number()
        .transform((value, originalValue) => {
            return originalValue === '' ? undefined : value;
        })
        .required('Vui lòng chọn danh mục')
        .positive('Danh mục không hợp lệ'),

    mo_ta: Yup.string()
        .max(5000, 'Mô tả không được vượt quá 5000 ký tự'),

    hinh: Yup.string()
        .url('URL hình ảnh không hợp lệ'),

    ngay: Yup.date()
        .required('Ngày không được để trống'),

    an_hien: Yup.number()
        .oneOf([0, 1], 'Giá trị không hợp lệ'),

    hot: Yup.number()
        .oneOf([0, 1], 'Giá trị không hợp lệ')
});

/**
 * Validation Schema cho User Form
 */
export const userValidationSchema = Yup.object({
    ho_ten: Yup.string()
        .required('Họ tên không được để trống')
        .min(3, 'Họ tên phải có ít nhất 3 ký tự')
        .max(100, 'Họ tên không được vượt quá 100 ký tự'),

    email: Yup.string()
        .required('Email không được để trống')
        .email('Email không hợp lệ')
        .max(100, 'Email không được vượt quá 100 ký tự'),

    mat_khau: Yup.string()
        .required('Mật khẩu không được để trống')
        .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt'
        ),

    dien_thoai: Yup.string()
        .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'),

    dia_chi: Yup.string()
        .max(255, 'Địa chỉ không được vượt quá 255 ký tự'),

    vai_tro: Yup.number()
        .oneOf([0, 1], 'Vai trò không hợp lệ'),

    khoa: Yup.number()
        .oneOf([0, 1], 'Giá trị không hợp lệ')
});

/**
 * Validation Schema cho Login Form
 */
export const loginValidationSchema = Yup.object({
    email: Yup.string()
        .required('Email không được để trống')
        .email('Email không hợp lệ'),

    password: Yup.string()
        .required('Mật khẩu không được để trống')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});

/**
 * Validation Schema cho Register Form
 */
export const registerValidationSchema = Yup.object({
    ho_ten: Yup.string()
        .required('Họ tên không được để trống')
        .min(3, 'Họ tên phải có ít nhất 3 ký tự'),

    email: Yup.string()
        .required('Email không được để trống')
        .email('Email không hợp lệ'),

    password: Yup.string()
        .required('Mật khẩu không được để trống')
        .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt'
        ),

    confirmPassword: Yup.string()
        .required('Xác nhận mật khẩu không được để trống')
        .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp'),

    dien_thoai: Yup.string()
        .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'),

    dia_chi: Yup.string()
        .max(255, 'Địa chỉ không được vượt quá 255 ký tự')
});

/**
 * Validation Schema cho Category Form
 */
export const categoryValidationSchema = Yup.object({
    ten_loai: Yup.string()
        .required('Tên danh mục không được để trống')
        .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
        .max(100, 'Tên danh mục không được vượt quá 100 ký tự'),

    thu_tu: Yup.number()
        .nullable()
        .min(0, 'Thứ tự phải là số dương'),

    an_hien: Yup.number()
        .oneOf([0, 1], 'Giá trị không hợp lệ')
});
