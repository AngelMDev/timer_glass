SELECT SUM(aet) AS "Total AET" FROM Rated INNER JOIN Tasks ON Rated.task_id = Tasks.task_id where rated_id > 419