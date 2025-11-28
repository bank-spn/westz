CREATE TABLE `parcels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`trackingNumber` varchar(255) NOT NULL,
	`destination` text,
	`recipientName` text,
	`dateSent` timestamp,
	`note` text,
	`currentStatus` text,
	`currentStatusDescription` text,
	`currentLocation` text,
	`lastUpdated` timestamp,
	`deliveryStatus` text,
	`isDelivered` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `parcels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`isCompleted` boolean DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projectTasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('planning','in_progress','completed','on_hold') NOT NULL DEFAULT 'planning',
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`dueDate` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`thailandPostApiToken` text,
	`supabaseUrl` text,
	`supabaseAnonKey` text,
	`notificationsEnabled` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `weeklyPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`weekStartDate` timestamp NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`dayOfWeek` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
	`startTime` varchar(10),
	`endTime` varchar(10),
	`isCompleted` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `weeklyPlans_id` PRIMARY KEY(`id`)
);
