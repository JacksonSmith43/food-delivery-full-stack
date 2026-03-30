CREATE TABLE order_item (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT,
    menu_item_id BIGINT,
    quantity INTEGER,
    price DECIMAL(7, 2),
    menu_item_name_snapshot VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES "orders" (id)
)