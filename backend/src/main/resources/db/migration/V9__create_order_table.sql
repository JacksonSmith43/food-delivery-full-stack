CREATE TYPE order_status_enum as ENUM(
    'PLACED',
    'PREPARING',
    'OUT_FOR_DELIVERY',
    'DELIVERED'
);
CREATE TABLE "orders" (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount INTEGER NOT NULL,
    total_cost DECIMAL(7, 2) NOT NULL,
    "status" order_status_enum NOT NULL,
    created_at TIMESTAMP,
    currency VARCHAR(10),
    payment_method VARCHAR(55),
    payment_status VARCHAR(55),

    delivery_name VARCHAR(255),
    delivery_phone_number VARCHAR(50),
    delivery_label VARCHAR(50),
    delivery_street_name VARCHAR(255),
    delivery_postal_code VARCHAR(30),
    delivery_city VARCHAR(120),
    delivery_country VARCHAR(120),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (user_id)
)