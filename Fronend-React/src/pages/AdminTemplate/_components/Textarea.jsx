import PropTypes from 'prop-types';

const Textarea = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    rows = 4,
    error,
    required = false,
    disabled = false,
    className = ''
}) => {
    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                required={required}
                className={`
                    block w-full rounded-lg border px-4 py-2.5 text-gray-900 dark:text-white
                    placeholder-gray-400 dark:placeholder-slate-500
                    ${error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                    }
                    bg-white dark:bg-slate-800
                    focus:outline-none focus:ring-2
                    disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-700
                    resize-none
                `}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};

Textarea.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
    error: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string
};

export default Textarea;
