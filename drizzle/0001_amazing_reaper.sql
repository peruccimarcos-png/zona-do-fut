CREATE TABLE `favoritePlayers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`playerId` int NOT NULL,
	`playerName` varchar(255) NOT NULL,
	`playerPhoto` text,
	`teamName` varchar(255),
	`position` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favoritePlayers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `favoriteTeams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`teamId` int NOT NULL,
	`teamName` varchar(255) NOT NULL,
	`teamLogo` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favoriteTeams_id` PRIMARY KEY(`id`)
);
