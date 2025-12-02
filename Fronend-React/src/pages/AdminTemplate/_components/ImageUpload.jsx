import { useState } from 'react';
import PropTypes from 'prop-types';
import { getImageUrl } from '../../../utils/imageUtils';

const ImageUpload = ({
    value = '',
    onChange,
    label = 'Tải ảnh lên',
    accept = 'image/*',
    maxSize = 5 * 1024 * 1024, // 5MB
    preview = true,
    className = ''
}) => {
    const [previewUrl, setPreviewUrl] = useState(value);
    const [error, setError] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError('');

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Vui lòng chọn file ảnh');
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            setError(`Kích thước file không được vượt quá ${maxSize / (1024 * 1024)}MB`);
            return;
        }

        // Show preview
        if (preview) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }

        // Call onChange with file
        if (onChange) {
            onChange(file);
        }
    };

    const handleRemove = () => {
        setPreviewUrl('');
        setError('');
        if (onChange) {
            onChange(null);
        }
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {label}
            </label>

            <div className="space-y-4">
                {/* Preview */}
                {previewUrl && preview && (
                    <div className="relative inline-block">
                        <img
                            src={previewUrl.startsWith('blob:') || previewUrl.startsWith('data:')
                                ? previewUrl
                                : getImageUrl(previewUrl)}
                            alt="Preview"
                            className="h-40 w-40 object-cover rounded-lg border border-gray-300 dark:border-slate-600"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Upload button */}
                {!previewUrl && (
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-slate-800 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-slate-400">
                                    <span className="font-semibold">Click để tải lên</span> hoặc kéo thả
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                    PNG, JPG, GIF (MAX. {maxSize / (1024 * 1024)}MB)
                                </p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept={accept}
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
            </div>
        </div>
    );
};

ImageUpload.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    accept: PropTypes.string,
    maxSize: PropTypes.number,
    preview: PropTypes.bool,
    className: PropTypes.string
};

export default ImageUpload;
