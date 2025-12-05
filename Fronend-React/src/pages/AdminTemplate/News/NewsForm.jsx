import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { tinTucAPI, loaiTinAPI, uploadAPI } from '../../../services/api';
import { newsValidationSchema } from '../../../utils/validationSchemas';
import Input from '../_components/Input';
import Select from '../_components/Select';
import Textarea from '../_components/Textarea';
import Button from '../_components/Button';
import ImageUpload from '../_components/ImageUpload';
import RichTextEditor from '../_components/RichTextEditor';

const NewsForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Formik setup
    const formik = useFormik({
        initialValues: {
            tieu_de: '',
            slug: '',
            mo_ta: '',
            noi_dung: '',
            hinh: '',
            ngay: new Date().toISOString().split('T')[0],
            id_loai: '',
            an_hien: 1,
            hot: 0,
            luot_xem: 0,
            tags: ''
        },
        validationSchema: newsValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setLoading(true);
            try {
                console.log('📦 Submitting news data:', values);

                if (isEdit) {
                    const response = await tinTucAPI.update(id, values);
                    console.log('✅ Update response:', response.data);
                    alert('Cập nhật tin tức thành công');
                } else {
                    const response = await tinTucAPI.create(values);
                    console.log('✅ Create response:', response.data);
                    alert('Thêm tin tức thành công');
                }

                navigate('/admin/news');
            } catch (error) {
                console.error('❌ Error saving news:', error);
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lưu tin tức';
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
                const res = await loaiTinAPI.getAll();
                setCategories(res.data?.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchNews = async () => {
            try {
                setLoading(true);
                const res = await tinTucAPI.getById(id);
                if (res.data?.success) {
                    formik.setValues(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching news:', error);
                alert('Có lỗi khi tải thông tin tin tức');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        if (isEdit) {
            fetchNews();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isEdit]);

    const handleImageChange = async (file) => {
        if (!file) return;

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
                    {isEdit ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới'}
                </h1>
            </div>

            <div className="rounded-lg bg-white dark:bg-slate-800 p-6 shadow">
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <Input
                        label="Tiêu đề"
                        name="tieu_de"
                        value={formik.values.tieu_de}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Nhập tiêu đề"
                        error={formik.touched.tieu_de && formik.errors.tieu_de}
                        required
                    />

                    <Textarea
                        label="Mô tả"
                        name="mo_ta"
                        value={formik.values.mo_ta}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Nhập mô tả ngắn"
                        rows={3}
                        error={formik.touched.mo_ta && formik.errors.mo_ta}
                    />

                    <div>
                        <RichTextEditor
                            label="Nội dung"
                            value={formik.values.noi_dung}
                            onChange={(content) => formik.setFieldValue('noi_dung', content)}
                            placeholder="Nhập nội dung bài viết..."
                            minHeight="300px"
                            error={formik.touched.noi_dung && formik.errors.noi_dung}
                        />

                        {/* Preview Section */}
                        {formik.values.noi_dung && (
                            <div className="mt-4 rounded-lg border border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-800">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    📝 Xem trước nội dung:
                                </h3>
                                <div
                                    className="html-content prose prose-sm dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: formik.values.noi_dung }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Select
                            label="Loại tin"
                            name="id_loai"
                            value={formik.values.id_loai}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            options={categoryOptions}
                            error={formik.touched.id_loai && formik.errors.id_loai}
                            required
                        />

                        <Input
                            label="Ngày đăng"
                            name="ngay"
                            type="date"
                            value={formik.values.ngay}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.ngay && formik.errors.ngay}
                        />
                    </div>

                    <ImageUpload
                        label="Hình ảnh"
                        value={formik.values.hinh}
                        onChange={handleImageChange}
                        error={formik.touched.hinh && formik.errors.hinh}
                    />

                    {uploadingImage && (
                        <p className="text-sm text-blue-600">Đang tải ảnh lên...</p>
                    )}

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
                            Hiển thị tin tức
                        </span>
                    </label>

                    <div className="flex justify-end gap-4 border-t border-gray-200 dark:border-slate-700 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/admin/news')}
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

export default NewsForm;
