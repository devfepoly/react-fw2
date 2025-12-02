import PropTypes from 'prop-types';

const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = 'Chọn...',
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
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`
                    block w-full rounded-lg border px-4 py-2.5 text-gray-900 dark:text-white
                    ${error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                    }
                    bg-white dark:bg-slate-800
                    focus:outline-none focus:ring-2
                    disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-700
                `}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};

Select.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired
        })
    ),
    placeholder: PropTypes.string,
    error: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string
};

export default Select;
