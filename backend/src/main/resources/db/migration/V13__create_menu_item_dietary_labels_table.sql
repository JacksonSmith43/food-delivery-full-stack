CREATE TABLE menu_item_dietary_labels (
    menu_item_id BIGINT NOT NULL,
    dietary_labels VARCHAR(50) NOT NULL,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items (id) ON DELETE CASCADE
);