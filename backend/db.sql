-- Table: users
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(45) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: favorites
DROP TABLE IF EXISTS favorites;

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

-- Table: reviews
DROP TABLE IF EXISTS reviews;

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

-- Table: groups
DROP TABLE IF EXISTS groups;

CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  owners_id INT,
  description VARCHAR(200),
  CONSTRAINT fk_groups_users FOREIGN KEY (owners_id)
    REFERENCES users (id)
);

-- Table: groupContent
DROP TABLE IF EXISTS groupContent;

CREATE TABLE groupContent (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  group_id INT NOT NULL,
  users_id INT NOT NULL,
  post_content VARCHAR(1000),
  movie_id INT,
  movie_title VARCHAR(255),
  movie_poster_path VARCHAR(255),
  show_time_id INT,
  show_time_title TIMESTAMP,
  show_time_start TIMESTAMP,
  show_time_end TIMESTAMP,
  show_time_image VARCHAR(255),
  CONSTRAINT fk_groupContent_groups FOREIGN KEY (group_id) REFERENCES groups (id),
  CONSTRAINT fk_groupContent_users FOREIGN KEY (users_id) REFERENCES users(id)

);

-- Table: groupMembers
DROP TABLE IF EXISTS groupMembers;

CREATE TABLE groupMembers (
  id SERIAL PRIMARY KEY,
  users_id INT,
  role VARCHAR(45),
  group_id INT,
  status varchar(255),
  CONSTRAINT fk_groupMembers_groups FOREIGN KEY (group_id)
    REFERENCES groups (id)
);