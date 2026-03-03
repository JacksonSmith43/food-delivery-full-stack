

INSERT INTO
    address (
        label,
        street_name,
        postal_code,
        city,
        country,
        is_default
    )
VALUES (
        'Home',
        'Jackass Lane',
        '23',
        'Vienna',
        'Austria',
        TRUE
    ),
    (
        'Granny',
        'Pocket Handkerchief Lane',
        '10',
        'Vienna',
        'Austria',
        FALSE
    ),
    (
        'Work',
        'Cake Street',
        '12',
        'Vienna',
        'Austria',
        FALSE
    ),
    (
        'Home',
        'Awkward Hill',
        '13',
        'Vienna',
        'Austria',
        TRUE
    ),
    (
        'Home',
        'Ha-Ha Road',
        '23',
        'Vienna',
        'Austria',
        TRUE
    ),
    (
        'Home',
        'Happy Land',
        '23',
        'Vienna',
        'Austria',
        TRUE
    ),
    (
        'Work',
        'Cutthroat Lane',
        '23',
        'Vienna',
        'Austria',
        FALSE
    ),
    (
        'Friend',
        'Bellenden Gardens',
        '23',
        'Vienna',
        'Austria',
        FALSE
    )
    ON CONFLICT DO NOTHING;