CREATE TABLE users(
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255),
    phone_number VARCHAR(255)
);