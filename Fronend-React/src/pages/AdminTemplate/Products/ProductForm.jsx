import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { sanPhamAPI, loaiAPI, uploadAPI } from '../../../services/api';
import { productValidationSchema } from '../../../utils/validationSchemas';
import Input from '../_components/Input';
import Select from '../_components/Select';
import Button from '../_components/Button';
import ImageUpload from '../_components/ImageUpload';
import RichTextEditor from '../_components/RichTextEditor';

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [categories, setCategories] = useState([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [loading, setLoading] = useState(false);

    // Formik setup
    const formik = useFormik({
        initialValues: {
            ten_sp: '',
            gia: '',
            gia_km: '',
            hinh: '',
            ngay: new Date().toISOString().split('T')[0],
            mo_ta: '',
            id_loai: '',
            an_hien: 1,
            hot: 0
        },
        validationSchema: productValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setLoading(true);
            try {
                // Convert string to number for price fields
                const dataToSubmit = {
                    ...values,
                    gia: Number(values.gia),
                    gia_km: values.gia_km ? Number(values.gia_km) : null,
                    id_loai: Number(values.id_loai)
                };

                console.log('📦 Submitting product data:', dataToSubmit);

                if (isEdit) {
                    const response = await sanPhamAPI.update(id, dataToSubmit);
                    console.log('✅ Update response:', response.data);
                    alert('Cập nhật sản phẩm thành công');
                } else {
                    const response = await sanPhamAPI.create(dataToSubmit);
                    console.log('✅ Create response:', response.data);
                    alert('Thêm sản phẩm thành công');
                }

                navigate('/admin/products');
            } catch (error) {
                console.error('❌ Error saving product:', error);
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lưu sản phẩm';
                alert(errorMessage);
            } finally {
                setSubmitting(false);
                setLoading(false);
            }
        }
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await loaiAPI.getAll();
                setCategories(res.data?.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchProduct = async () => {
            try {
                const res = await sanPhamAPI.getById(id);
                if (res.data?.success) {
                    // Set Formik values
                    formik.setValues(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                alert('Có lỗi khi tải thông tin sản phẩm');
            }
        };

        fetchCategories();
        if (isEdit) {
            fetchProduct();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isEdit]);

    const handleImageChange = async (file) => {
        if (!file) {
            return;
        }

        // Upload immediately
        try {
            setUploadingImage(true);
            const res = await uploadAPI.uploadSingle(file);
            if (res.data?.success) {
                formik.setFieldValue('hinh', res.data.data.url);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Có lỗi khi tải ảnh lên');
        } finally {
            setUploadingImage(false);
        }
    };

    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.ten_loai
    }));

    if (loading && isEdit) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h1>
            </div>

            <div className="rounded-lg bg-white dark:bg-slate-800 p-6 shadow">
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Input
                            label="Tên sản phẩm"
                            name="ten_sp"
                            value={formik.values.ten_sp}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Nhập tên sản phẩm"
                            error={formik.touched.ten_sp && formik.errors.ten_sp}
                            required
                        />

                        <Select
                            label="Danh mục"
                            name="id_loai"
                            value={formik.values.id_loai}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            options={categoryOptions}
                            error={formik.touched.id_loai && formik.errors.id_loai}
                            required
                        />

                        <Input
                            label="Giá"
                            name="gia"
                            type="number"
                            value={formik.values.gia}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Nhập giá"
                            error={formik.touched.gia && formik.errors.gia}
                            required
                        />

                        <Input
                            label="Giá khuyến mãi"
                            name="gia_km"
                            type="number"
                            value={formik.values.gia_km}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Nhập giá khuyến mãi (nếu có)"
                            error={formik.touched.gia_km && formik.errors.gia_km}
                        />

                        <Input
                            label="Ngày"
                            name="ngay"
                            type="date"
                            value={formik.values.ngay}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.ngay && formik.errors.ngay}
                        />
                    </div>

                    <div>
                        <RichTextEditor
                            label="Mô tả sản phẩm"
                            value={formik.values.mo_ta}
                            onChange={(content) => formik.setFieldValue('mo_ta', content)}
                            placeholder="Nhập mô tả chi tiết sản phẩm..."
                            minHeight="250px"
                            error={formik.touched.mo_ta && formik.errors.mo_ta}
                        />

                        {/* Preview Section */}
                        {formik.values.mo_ta && (
                            <div className="mt-4 rounded-lg border border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-800">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    📝 Xem trước mô tả:
                                </h3>
                                <div
                                    className="html-content prose prose-sm dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: formik.values.mo_ta }}
                                />
                            </div>
                        )}
                    </div>

                    <ImageUpload
                        label="Hình ảnh sản phẩm"
                        value={formik.values.hinh}
                        onChange={handleImageChange}
                        error={formik.touched.hinh && formik.errors.hinh}
                    />

                    {uploadingImage && (
                        <p className="text-sm text-blue-600">Đang tải ảnh lên...</p>
                    )}

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="an_hien"
                                checked={formik.values.an_hien === 1}
                                onChange={(e) => formik.setFieldValue('an_hien', e.target.checked ? 1 : 0)}
                                onBlur={formik.handleBlur}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                Hiển thị sản phẩm
                            </span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="hot"
                                checked={formik.values.hot === 1}
                                onChange={(e) => formik.setFieldValue('hot', e.target.checked ? 1 : 0)}
                                onBlur={formik.handleBlur}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                Sản phẩm hot
                            </span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-4 border-t border-gray-200 dark:border-slate-700 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/admin/products')}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            disabled={uploadingImage || formik.isSubmitting}
                        >
                            {isEdit ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
