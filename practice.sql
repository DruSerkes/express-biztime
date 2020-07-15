SELECT c.code, c.name, c.description, t.tag
FROM messages AS m
    LEFT JOIN messages_tags AS mt
    ON m.id = mt.message_id
    LEFT JOIN tags AS t ON mt.tag_code = t.code
WHERE m.id = $1