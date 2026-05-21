import { useMovieContext } from "../contexts/MovieContext";
import "../css/Toast.css";

function Toast() {
    const { toast } = useMovieContext();

    if (!toast) return null;

    const icons = {
        success: "✅",
        info: "ℹ️",
        error: "❌",
    };

    return (
        <div className="toast-container">
            <div className={`toast-message ${toast.type}`}>
                <span className="toast-icon">{icons[toast.type] || icons.info}</span>
                <span>{toast.message}</span>
            </div>
        </div>
    );
}

export default Toast;
