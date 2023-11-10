-- DECLARE @id AS BIGINT 
-- DECLARE @points AS INT

IF NOT EXISTS (SELECT 1
FROM member_points
WHERE id=@id)
BEGIN
    INSERT INTO member_points
        (id, points)
    VALUES
        (@id, @points)
END
ELSE UPDATE member_points SET points = points + @points WHERE id = @id;