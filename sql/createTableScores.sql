/*
  DROP TABLE IF EXISTS memory.scores;
*/

CREATE TABLE IF NOT EXISTS memory.scores
(
	DateScore datetime NOT NULL,
	PlayerId int NOT NULL,
	SecondDuration int NOT NULL,
	PRIMARY KEY (DateScore, PlayerId)
);
