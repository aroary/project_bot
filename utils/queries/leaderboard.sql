SELECT
    id,
    points
FROM member_points
WHERE points = (SELECT MAX(points)
FROM member_points)