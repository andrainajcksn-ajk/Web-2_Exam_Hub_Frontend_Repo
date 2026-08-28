const Select = ({ label, options = [], className = '', ...props }) => {
  return (
    <div>
      {label && <label className="block text-sm text-neutral-400 mb-1">{label}</label>}
      <select
        className={`w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 focus:outline-none focus:border-brand-500 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
export default Select;
