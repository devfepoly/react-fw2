import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sanPhamAPI, loaiAPI, uploadAPI } from '../../../services/api';
import Input from '../_components/Input';
import Select from '../_components/Select';
import Textarea from '../_components/Textarea';
import Button from '../_components/Button';
import ImageUpload from '../_components/ImageUpload';

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        ten_sp: '',
        gia: '',
        gia_km: '',
        hinh: '',
        ngay: new Date().toISOString().split('T')[0],
        mo_ta: '',
        id_loai: '',
        an_hien: 1,
        hot: 0
    });
    const [errors, setErrors] = useState({});

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
                setLoading(true);
                const res = await sanPhamAPI.getById(id);
                if (res.data?.success) {
                    setFormData(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                alert('Có lỗi khi tải thông tin sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        if (isEdit) {
            fetchProduct();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = async (file) => {
        if (!file) {
            return;
        }

        // Upload immediately
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

        if (!formData.ten_sp.trim()) {
            newErrors.ten_sp = 'Tên sản phẩm không được để trống';
        }

        const gia = Number(formData.gia);
        const gia_km = Number(formData.gia_km);

        if (!gia || gia <= 0) {
            newErrors.gia = 'Giá phải lớn hơn 0';
        }

        if (gia_km && gia_km >= gia) {
            newErrors.gia_km = 'Giá khuyến mãi phải nhỏ hơn giá gốc';
        }

        if (!formData.id_loai) {
            newErrors.id_loai = 'Vui lòng chọn danh mục';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setLoading(true);

            if (isEdit) {
                await sanPhamAPI.update(id, formData);
                alert('Cập nhật sản phẩm thành công');
            } else {
                await sanPhamAPI.create(formData);
                alert('Thêm sản phẩm thành công');
            }

            navigate('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
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
                    {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h1>
            </div>

            <div className="rounded-lg bg-white dark:bg-slate-800 p-6 shadow">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Input
                            label="Tên sản phẩm"
                            name="ten_sp"
                            value={formData.ten_sp}
                            onChange={handleChange}
                            placeholder="Nhập tên sản phẩm"
                            error={errors.ten_sp}
                            required
                        />

                        <Select
                            label="Danh mục"
                            name="id_loai"
                            value={formData.id_loai}
                            onChange={handleChange}
                            options={categoryOptions}
                            error={errors.id_loai}
                            required
                        />

                        <Input
                            label="Giá"
                            name="gia"
                            type="number"
                            value={formData.gia}
                            onChange={handleChange}
                            placeholder="Nhập giá"
                            error={errors.gia}
                            required
                        />

                        <Input
                            label="Giá khuyến mãi"
                            name="gia_km"
                            type="number"
                            value={formData.gia_km}
                            onChange={handleChange}
                            placeholder="Nhập giá khuyến mãi (nếu có)"
                            error={errors.gia_km}
                        />

                        <Input
                            label="Ngày"
                            name="ngay"
                            type="date"
                            value={formData.ngay}
                            onChange={handleChange}
                        />
                    </div>

                    <Textarea
                        label="Mô tả"
                        name="mo_ta"
                        value={formData.mo_ta}
                        onChange={handleChange}
                        placeholder="Nhập mô tả sản phẩm"
                        rows={4}
                    />

                    <ImageUpload
                        label="Hình ảnh sản phẩm"
                        value={formData.hinh}
                        onChange={handleImageChange}
                    />

                    {uploadingImage && (
                        <p className="text-sm text-blue-600">Đang tải ảnh lên...</p>
                    )}

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="an_hien"
                                checked={formData.an_hien === 1}
                                onChange={handleChange}
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
                                checked={formData.hot === 1}
                                onChange={handleChange}
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

export default ProductForm;
