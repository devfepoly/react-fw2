import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tinTucAPI, loaiTinAPI } from '../../../services/api';
import { getImageUrl, getPlaceholderImage } from '../../../utils/imageUtils';
import Table from '../_components/Table';
import Button from '../_components/Button';
import Modal from '../_components/Modal';
import Pagination from '../../../components/common/Pagination';

const ITEMS_PER_PAGE = 10;

const News = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchData();
    }, []);

    // Phân trang
    const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);
    const paginatedNews = news.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [newsRes, categoriesRes] = await Promise.all([
                tinTucAPI.getAll(),
                loaiTinAPI.getAll()
            ]);
            setNews(newsRes.data?.data || []);
            setCategories(categoriesRes.data?.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Có lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.item) return;

        try {
            await tinTucAPI.delete(deleteModal.item.id);
            alert('Xóa tin tức thành công');
            setDeleteModal({ isOpen: false, item: null });
            fetchData();
        } catch (error) {
            console.error('Error deleting news:', error);
            alert('Có lỗi khi xóa tin tức');
        }
    };

    const getCategoryName = (idLoai) => {
        const category = categories.find(cat => cat.id === idLoai);
        return category?.ten_loai || 'N/A';
    };

    const columns = [
        { header: 'ID', accessor: 'id' },
        {
            header: 'Hình ảnh',
            render: (row) => (
                <img
                    src={row.hinh ? getImageUrl(row.hinh) : getPlaceholderImage(50, 50)}
                    alt={row.tieu_de}
                    className="h-12 w-12 rounded object-cover"
                    onError={(e) => { e.target.src = getPlaceholderImage(50, 50); }}
                />
            )
        },
        { header: 'Tiêu đề', accessor: 'tieu_de' },
        {
            header: 'Mô tả',
            render: (row) => {
                // Strip HTML tags for table display
                const stripHtml = (html) => {
                    const tmp = document.createElement('DIV');
                    tmp.innerHTML = html || '';
                    return tmp.textContent || tmp.innerText || '';
                };
                const plainText = stripHtml(row.mo_ta);
                return (
                    <div className="max-w-xs truncate text-sm text-gray-600 dark:text-slate-400">
                        {plainText || '-'}
                    </div>
                );
            }
        },
        {
            header: 'Loại tin',
            render: (row) => getCategoryName(row.id_loai)
        },
        {
            header: 'Ngày đăng',
            render: (row) => new Date(row.ngay).toLocaleDateString('vi-VN')
        },
        {
            header: 'Lượt xem',
            accessor: 'luot_xem'
        }
    ];

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Quản lý tin tức
                </h1>
                <Button
                    variant="primary"
                    onClick={() => navigate('/admin/news/create')}
                    icon={
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    }
                >
                    Thêm tin tức
                </Button>
            </div>

            <Table
                columns={columns}
                data={paginatedNews}
                isLoading={loading}
                onEdit={(item) => navigate(`/admin/news/edit/${item.id}`)}
                onDelete={(item) => setDeleteModal({ isOpen: true, item })}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, item: null })}
                title="Xác nhận xóa"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-slate-400">
                        Bạn có chắc chắn muốn xóa tin tức <strong>{deleteModal.item?.tieu_de}</strong>?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModal({ isOpen: false, item: null })}
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

export default News;
