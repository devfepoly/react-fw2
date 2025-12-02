import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
    const pages = useMemo(() => {
        if (totalPages <= 1) return [];

        const result = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                result.push(i);
            }
        } else {
            if (currentPage <= 3) {
                result.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                result.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                result.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return result;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        return pages.map((page, index) => {
            if (page === '...') {
                return (
                    <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-400">
                        ...
                    </span>
                );
            }

            return (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition text-sm sm:text-base ${currentPage === page
                        ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500'
                        }`}
                >
                    {page}
                </button>
            );
        });
    };

    return (
        <div className="mt-8 sm:mt-12">
            <div className="flex justify-center items-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Previous page"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                    {renderPageNumbers()}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Next page"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
});

Pagination.displayName = 'Pagination';

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
