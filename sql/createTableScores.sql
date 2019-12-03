/*
  DROP TABLE IF EXISTS memory.scores;
*/

CREATE TABLE IF NOT EXISTS memory.scores
(
	DateScore datetime NOT NULL,
	PlayerId varchar(20) NOT NULL,
	SecondDuration int NOT NULL,
	CardsNumber int NOT NULL,
	PRIMARY KEY (DateScore) /* La date suffit comme clé primaire car il y a suffisamment peu de joueurs pour ne pas avoir de validation à la seconde, auquel cas il faudrait aussi le PlayerId */
);
