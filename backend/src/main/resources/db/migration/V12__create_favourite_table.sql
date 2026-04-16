CREATE TABLE favourites (
    id BIGSERIAL PRIMARY KEY,
    menu_item_id BIGINT,
    user_id BIGINT,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items (id),
    FOREIGN KEY (user_id) REFERENCES "users" (user_id)
)