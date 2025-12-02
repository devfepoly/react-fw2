import { memo } from 'react';
import PropTypes from 'prop-types';

const Table = memo(({ columns, data, onEdit, onDelete, onView, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center">
                <p className="text-gray-500 dark:text-slate-400">Không có dữ liệu</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700 shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-800">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400"
                            >
                                {column.header}
                            </th>
                        ))}
                        {(onEdit || onDelete || onView) && (
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400">
                                Thao tác
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-100"
                                >
                                    {column.render
                                        ? column.render(row, rowIndex)
                                        : row[column.accessor]}
                                </td>
                            ))}
                            {(onEdit || onDelete || onView) && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        {onView && (
                                            <button
                                                onClick={() => onView(row)}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                        )}
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(row)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

Table.displayName = 'Table';

Table.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            header: PropTypes.string.isRequired,
            accessor: PropTypes.string,
            render: PropTypes.func
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onView: PropTypes.func,
    isLoading: PropTypes.bool
};

export default Table;
