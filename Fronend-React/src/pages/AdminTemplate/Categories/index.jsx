import { useState, useEffect } from 'react';
import { loaiAPI, sanPhamAPI } from '../../../services/api';
import Table from '../_components/Table';
import Button from '../_components/Button';
import Modal from '../_components/Modal';
import Input from '../_components/Input';
import Textarea from '../_components/Textarea';
import Pagination from '../../../components/common/Pagination';

const ITEMS_PER_PAGE = 10;

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: 'create', // 'create' | 'edit'
        category: null
    });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null });
    const [formData, setFormData] = useState({
        ten_loai: '',
        mo_ta: '',
        thu_tu: 0,
        an_hien: 1
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const [categoriesRes, productsRes] = await Promise.all([
                loaiAPI.getAll(),
                sanPhamAPI.getAll()
            ]);
            setCategories(categoriesRes.data?.data || []);
            setProducts(productsRes.data?.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert('Có lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Tính số lượng sản phẩm theo loại
    const getProductCount = (categoryId) => {
        return products.filter(p => p.id_loai === categoryId).length;
    };

    // Phân trang
    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
    const paginatedCategories = categories.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const openModal = (mode, category = null) => {
        if (mode === 'edit' && category) {
            setFormData({
                ten_loai: category.ten_loai || '',
                mo_ta: category.mo_ta || '',
                thu_tu: category.thu_tu || 0,
                an_hien: category.an_hien || 1
            });
        } else {
            setFormData({
                ten_loai: '',
                mo_ta: '',
                thu_tu: 0,
                an_hien: 1
            });
        }
        setErrors({});
        setModalState({ isOpen: true, mode, category });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: 'create', category: null });
        setFormData({ ten_loai: '', mo_ta: '', thu_tu: 0, an_hien: 1 });
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.ten_loai.trim()) {
            newErrors.ten_loai = 'Tên danh mục không được để trống';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setSubmitting(true);
            if (modalState.mode === 'edit') {
                await loaiAPI.update(modalState.category.id, formData);
                alert('Cập nhật danh mục thành công');
            } else {
                await loaiAPI.create(formData);
                alert('Thêm danh mục thành công');
            }
            closeModal();
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.category) return;

        try {
            await loaiAPI.delete(deleteModal.category.id);
            alert('Xóa danh mục thành công');
            setDeleteModal({ isOpen: false, category: null });
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Có lỗi khi xóa danh mục');
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Tên danh mục', accessor: 'ten_loai' },
        { header: 'Mô tả', accessor: 'mo_ta' },
        {
            header: 'Số SP',
            render: (row) => (
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 font-semibold">
                    {getProductCount(row.id)}
                </span>
            )
        },
        { header: 'Thứ tự', accessor: 'thu_tu' },
        {
            header: 'Trạng thái',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.an_hien === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                    {row.an_hien === 1 ? 'Hiện' : 'Ẩn'}
                </span>
            )
        }
    ];

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Quản lý danh mục
                </h1>
                <Button
                    variant="primary"
                    onClick={() => openModal('create')}
                    icon={
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    }
                >
                    Thêm danh mục
                </Button>
            </div>

            <Table
                columns={columns}
                data={paginatedCategories}
                isLoading={loading}
                onEdit={(category) => openModal('edit', category)}
                onDelete={(category) => setDeleteModal({ isOpen: true, category })}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.mode === 'edit' ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Tên danh mục"
                        name="ten_loai"
                        value={formData.ten_loai}
                        onChange={handleChange}
                        placeholder="Nhập tên danh mục"
                        error={errors.ten_loai}
                        required
                    />

                    <Textarea
                        label="Mô tả"
                        name="mo_ta"
                        value={formData.mo_ta}
                        onChange={handleChange}
                        placeholder="Nhập mô tả"
                        rows={3}
                    />

                    <Input
                        label="Thứ tự"
                        name="thu_tu"
                        type="number"
                        value={formData.thu_tu}
                        onChange={handleChange}
                        placeholder="Nhập thứ tự"
                    />

                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="an_hien"
                            checked={formData.an_hien === 1}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                an_hien: e.target.checked ? 1 : 0
                            }))}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                            Hiển thị danh mục
                        </span>
                    </label>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={closeModal}>
                            Hủy
                        </Button>
                        <Button type="submit" variant="primary" loading={submitting}>
                            {modalState.mode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, category: null })}
                title="Xác nhận xóa"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-slate-400">
                        Bạn có chắc chắn muốn xóa danh mục <strong>{deleteModal.category?.ten_loai}</strong>?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModal({ isOpen: false, category: null })}
                        >
                            Hủy
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Categories;
