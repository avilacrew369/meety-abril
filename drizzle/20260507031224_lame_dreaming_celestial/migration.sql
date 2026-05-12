CREATE TABLE "accounts" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"slug" varchar(50) NOT NULL,
	"name" varchar(50) NOT NULL,
	"image" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "communities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"image" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"creted_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_members" (
	"community_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "meetis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(255) NOT NULL,
	"details" text NOT NULL,
	"available_seats" integer NOT NULL,
	"date" date NOT NULL,
	"time" time NOT NULL,
	"image" varchar(100) NOT NULL,
	"community_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"created_by" text NOT NULL,
	"virtual" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meeti_attendds" (
	"meeti_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meeti_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"meeti_id" uuid NOT NULL,
	"place_name" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"actor_name" varchar(60) NOT NULL,
	"message" varchar(100) NOT NULL,
	"target" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"read" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" ("identifier");--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "community_members" ADD CONSTRAINT "community_members_community_id_communities_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "community_members" ADD CONSTRAINT "community_members_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meetis" ADD CONSTRAINT "meetis_community_id_communities_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meetis" ADD CONSTRAINT "meetis_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meeti_attendds" ADD CONSTRAINT "meeti_attendds_meeti_id_meetis_id_fkey" FOREIGN KEY ("meeti_id") REFERENCES "meetis"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meeti_attendds" ADD CONSTRAINT "meeti_attendds_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meeti_locations" ADD CONSTRAINT "meeti_locations_meeti_id_meetis_id_fkey" FOREIGN KEY ("meeti_id") REFERENCES "meetis"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;