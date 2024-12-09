DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS users;

-- Table: users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(45) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: reviews
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  movies_id INT NOT NULL,
  users_id INT NOT NULL,
  rating INT,
  comment VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type VARCHAR(45),
  CONSTRAINT fk_reviews_users FOREIGN KEY (users_id)
    REFERENCES users (id)
);

-- Table: favorites
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  movie_id INT,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  users_id INT,
  type VARCHAR(10),
  title VARCHAR(255),
  CONSTRAINT fk_favorites_users FOREIGN KEY (users_id)
    REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);


-- Unit Testing: Inserting test data for user and review tables to test review browsing feature
INSERT INTO users (email, password) VALUES ('review@unittest.com', 'test123');
INSERT INTO reviews (users_id, movies_id, rating, comment, type) VALUES ('1', '1', '4','TV show review - Unit test ', 'tv' );
INSERT INTO reviews (users_id, movies_id, rating, comment, type) VALUES ('1', '1', '4','Movie review - Unit test', 'movie' );