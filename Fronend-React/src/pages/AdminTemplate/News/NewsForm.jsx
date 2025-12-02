import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tinTucAPI, loaiTinAPI, uploadAPI } from '../../../services/api';
import Input from '../_components/Input';
import Select from '../_components/Select';
import Textarea from '../_components/Textarea';
import Button from '../_components/Button';
import ImageUpload from '../_components/ImageUpload';

const NewsForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        tieu_de: '',
        tom_tat: '',
        noi_dung: '',
        hinh: '',
        ngay: new Date().toISOString().split('T')[0],
        id_loai: '',
        an_hien: 1,
        xem: 0
    });
    const [errors, setErrors] = useState({});

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
                    setFormData(res.data.data);
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
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = async (file) => {
        if (!file) return;

        try {
            setUploadingImage(true);
            const res = await uploadAPI.uploadSingle(file);
            if (res.data?.success) {
                setFormData(prev => ({
                    ...prev,
                    hinh: res.data.data.url
                }));
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Có lỗi khi tải ảnh lên');
        } finally {
            setUploadingImage(false);
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.tieu_de.trim()) {
            newErrors.tieu_de = 'Tiêu đề không được để trống';
        }

        if (!formData.id_loai) {
            newErrors.id_loai = 'Vui lòng chọn loại tin';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            if (isEdit) {
                await tinTucAPI.update(id, formData);
                alert('Cập nhật tin tức thành công');
            } else {
                await tinTucAPI.create(formData);
                alert('Thêm tin tức thành công');
            }

            navigate('/admin/news');
        } catch (error) {
            console.error('Error saving news:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
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
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Tiêu đề"
                        name="tieu_de"
                        value={formData.tieu_de}
                        onChange={handleChange}
                        placeholder="Nhập tiêu đề"
                        error={errors.tieu_de}
                        required
                    />

                    <Textarea
                        label="Tóm tắt"
                        name="tom_tat"
                        value={formData.tom_tat}
                        onChange={handleChange}
                        placeholder="Nhập tóm tắt"
                        rows={3}
                    />

                    <Textarea
                        label="Nội dung"
                        name="noi_dung"
                        value={formData.noi_dung}
                        onChange={handleChange}
                        placeholder="Nhập nội dung"
                        rows={6}
                    />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Select
                            label="Loại tin"
                            name="id_loai"
                            value={formData.id_loai}
                            onChange={handleChange}
                            options={categoryOptions}
                            error={errors.id_loai}
                            required
                        />

                        <Input
                            label="Ngày đăng"
                            name="ngay"
                            type="date"
                            value={formData.ngay}
                            onChange={handleChange}
                        />
                    </div>

                    <ImageUpload
                        label="Hình ảnh"
                        value={formData.hinh}
                        onChange={handleImageChange}
                    />

                    {uploadingImage && (
                        <p className="text-sm text-blue-600">Đang tải ảnh lên...</p>
                    )}

                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="an_hien"
                            checked={formData.an_hien === 1}
                            onChange={handleChange}
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
                            disabled={uploadingImage}
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
