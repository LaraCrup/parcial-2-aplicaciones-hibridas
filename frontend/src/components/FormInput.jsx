function FormInput({ label, htmlFor, type, name, value, onChange, required, error }) {
    return (
        <div className="formFieldContainer">
            <label htmlFor={htmlFor}>{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={error ? 'input-error' : ''}
            />
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default FormInput;
