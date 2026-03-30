CREATE TABLE menu_items (
    id BIGSERIAL PRIMARY KEY,
    food_name VARCHAR(255),
    description VARCHAR(255),
    price DECIMAL(10, 2),
    food_image VARCHAR(255),
    restaurant_id BIGINT,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
)