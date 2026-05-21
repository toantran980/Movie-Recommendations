import "../css/MovieSkeleton.css";

function MovieSkeleton({ count = 8 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-poster"></div>
          <div className="skeleton-info">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-meta"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieSkeleton;
