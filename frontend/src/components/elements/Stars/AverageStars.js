export const AverageStars = ({ value, reviewCount, showBrackets }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (value >= i) {
            stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
        } else if (value >= i - 0.5) {
            stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
        } else {
            stars.push(<i key={i} className="bi bi-star text-warning"></i>);
        }
    }
    return <div>{stars} {/* Conditionally render parentheses around the review count */}
        <span>{showBrackets ? `(${reviewCount})` : reviewCount}</span></div>;
};
