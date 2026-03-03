CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    menu_item_id BIGINT NOT NULL,
    cart_id BIGINT NOT NULL,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items (id),
    FOREIGN KEY (cart_id) REFERENCES carts (id)
)