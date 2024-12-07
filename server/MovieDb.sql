DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(45) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(45),
  profile_url VARCHAR(70)
);

DROP TABLE IF EXISTS groups;
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  description VARCHAR (200), 
  owners_id INT,
  CONSTRAINT fk_groups_users FOREIGN KEY (owners_id)
    REFERENCES users (id)
);

DROP TABLE IF EXISTS groupContent;
CREATE TABLE IF NOT EXISTS groupContent (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  group_id INT NOT NULL,
  users_id INT NOT NULL,
  post_content VARCHAR(1000),
  movie_id INT DEFAULT NULL,
  movie_title VARCHAR(255) DEFAULT NULL,
  movie_poster_path VARCHAR(255) DEFAULT NULL,
  show_time_id INT DEFAULT NULL,
  show_time_title VARCHAR(255) DEFAULT NULL,
  show_time_start TIMESTAMP DEFAULT NULL,
  show_time_end TIMESTAMP DEFAULT NULL,
  show_time_image VARCHAR(255) DEFAULT NULL,
  CONSTRAINT fk_groupContent_groups FOREIGN KEY (group_id) REFERENCES groups(id),
  CONSTRAINT fk_groupContent_users FOREIGN KEY (users_id) REFERENCES users(id));


DROP TABLE IF EXISTS groupMembers;
CREATE TABLE IF NOT EXISTS groupMembers (
  id SERIAL PRIMARY KEY,
  users_id INT,
  role VARCHAR(45),
  group_id INT,
  status SMALLINT,
  CONSTRAINT fk_groupMembers_groups FOREIGN KEY (group_id)
    REFERENCES groups (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

