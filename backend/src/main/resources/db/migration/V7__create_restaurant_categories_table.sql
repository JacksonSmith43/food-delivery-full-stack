CREATE TABLE restaurant_categories (
    restaurant_id BIGINT,
    categories_id BIGINT,

    CONSTRAINT pk_restaurant_categories PRIMARY KEY (restaurant_id, categories_id),
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id),
    FOREIGN KEY (categories_id) REFERENCES categories (id)
)