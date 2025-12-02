import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanPhamAPI, loaiAPI } from '../../../services/api';
import { getImageUrl, getPlaceholderImage } from '../../../utils/imageUtils';
import Table from '../_components/Table';
import Button from '../_components/Button';
import Modal from '../_components/Modal';
import Pagination from '../../../components/common/Pagination';

const ITEMS_PER_PAGE = 10;

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchData();
    }, []);

    // Phân trang
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const paginatedProducts = products.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                sanPhamAPI.getAll(),
                loaiAPI.getAll()
            ]);
            setProducts(productsRes.data?.data || []);
            setCategories(categoriesRes.data?.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Có lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.product) return;

        try {
            await sanPhamAPI.delete(deleteModal.product.id);
            alert('Xóa sản phẩm thành công');
            setDeleteModal({ isOpen: false, product: null });
            fetchData();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Có lỗi khi xóa sản phẩm');
        }
    };

    const getCategoryName = (idLoai) => {
        const category = categories.find(cat => cat.id === idLoai);
        return category?.ten_loai || 'N/A';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const columns = [
        {
            header: 'ID',
            accessor: 'id',
        },
        {
            header: 'Hình ảnh',
            render: (row) => (
                <img
                    src={row.hinh ? getImageUrl(row.hinh) : getPlaceholderImage(50, 50)}
                    alt={row.ten_sp}
                    className="h-12 w-12 rounded object-cover"
                    onError={(e) => { e.target.src = getPlaceholderImage(50, 50); }}
                />
            )
        },
        {
            header: 'Tên sản phẩm',
            accessor: 'ten_sp',
        },
        {
            header: 'Giá',
            render: (row) => formatPrice(row.gia)
        },
        {
            header: 'Giá khuyến mãi',
            render: (row) => row.gia_km ? formatPrice(row.gia_km) : 'N/A'
        },
        {
            header: 'Danh mục',
            render: (row) => getCategoryName(row.id_loai)
        },
        {
            header: 'Ngày',
            render: (row) => new Date(row.ngay).toLocaleDateString('vi-VN')
        },
        {
            header: 'Ẩn/Hiện',
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
                    Quản lý sản phẩm
                </h1>
                <Button
                    variant="primary"
                    onClick={() => navigate('/admin/products/create')}
                    icon={
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    }
                >
                    Thêm sản phẩm
                </Button>
            </div>

            <Table
                columns={columns}
                data={paginatedProducts}
                isLoading={loading}
                onEdit={(product) => navigate(`/admin/products/edit/${product.id}`)}
                onDelete={(product) => setDeleteModal({ isOpen: true, product })}
                onView={(product) => navigate(`/admin/products/${product.id}`)}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, product: null })}
                title="Xác nhận xóa"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-slate-400">
                        Bạn có chắc chắn muốn xóa sản phẩm <strong>{deleteModal.product?.ten_sp}</strong>?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModal({ isOpen: false, product: null })}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                        >
                            Xóa
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Products;
