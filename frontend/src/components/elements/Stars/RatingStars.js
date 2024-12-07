export const RatingStars = ({ rating }) => (
    <>
        {Array.from({ length: 5 }, (_, index) => (
            <i
                key={index}
                className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'}`}
                style={{
                    color: index < rating ? 'gold' : 'gray',
                    fontSize: '1.3rem',
                }}
            ></i>
        ))}
    </>
);