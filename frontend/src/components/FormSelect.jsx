function FormSelect({ label, htmlFor, name, value, onChange, required, error, options }) {
    return (
        <div className="formFieldContainer">
            <label htmlFor={htmlFor}>{label}</label>
            <select
                name={name}
                id={htmlFor}
                value={value}
                onChange={onChange}
                required={required}
                className={error ? 'input-error' : ''}
            >
                <option value="">Seleccionar {label.toLowerCase()}</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default FormSelect;
