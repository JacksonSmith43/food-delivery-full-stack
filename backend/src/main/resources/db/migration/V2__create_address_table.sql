CREATE TABLE address (
    id BIGSERIAL PRIMARY KEY,
    label VARCHAR(255),
    street_name VARCHAR(255),
    postal_code VARCHAR(255),
    city VARCHAR(255),
    country VARCHAR(255),
    is_default BOOLEAN,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);