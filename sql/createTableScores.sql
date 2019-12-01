/*
  DROP TABLE IF EXISTS memory.scores;
*/

CREATE TABLE IF NOT EXISTS memory.scores
(
	DateScore datetime NOT NULL,
	PlayerId varchar(10) NOT NULL,
	SecondDuration int NOT NULL,
	CardsNumber int NOT NULL,
	PRIMARY KEY (DateScore, PlayerId)
);
