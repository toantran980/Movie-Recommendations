import { useMovieContext } from "../contexts/MovieContext";
import "../css/Toast.css";

function Toast() {
    const { toast } = useMovieContext();

    if (!toast) return null;

    return (
        <div className="toast-container">
            <div className={`toast-message ${toast.type}`}>
                {toast.message}
            </div>
        </div>
    );
}

export default Toast;
