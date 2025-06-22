function FormCheckbox({ label, name, value, checked, onChange, required, error }) {
    return (
        <div className="formCheckboxContainer">
            <input
                type="checkbox"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                required={required}
            />
            <label style={{ fontWeight: 'normal' }}>
                {label}
            </label>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
}

export default FormCheckbox;
