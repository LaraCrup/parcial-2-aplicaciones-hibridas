export const Alert = ({ text, isVisible, onClose, actions }) => {
    if (!isVisible) return null;

    return (
        <div className="alertOverlay">
            <div className="alertContainer">
                <p>{text}</p>
                <div className="alertActions">
                    {actions ? (
                        actions.map((action, index) => (
                            <button 
                                key={index} 
                                onClick={action.onClick} 
                                className="secondaryButton"
                            >
                                {action.text}
                            </button>
                        ))
                    ) : (
                        onClose && (
                            <button onClick={onClose} className="secondaryButton">
                                Cerrar
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};