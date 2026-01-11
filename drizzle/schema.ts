import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de times favoritos dos usuários
 */
export const favoriteTeams = mysqlTable("favoriteTeams", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  teamId: int("teamId").notNull(), // ID do time da API de futebol
  teamName: varchar("teamName", { length: 255 }).notNull(),
  teamLogo: text("teamLogo"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FavoriteTeam = typeof favoriteTeams.$inferSelect;
export type InsertFavoriteTeam = typeof favoriteTeams.$inferInsert;

/**
 * Tabela de jogadores favoritos dos usuários
 */
export const favoritePlayers = mysqlTable("favoritePlayers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  playerId: int("playerId").notNull(), // ID do jogador da API de futebol
  playerName: varchar("playerName", { length: 255 }).notNull(),
  playerPhoto: text("playerPhoto"),
  teamName: varchar("teamName", { length: 255 }),
  position: varchar("position", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FavoritePlayer = typeof favoritePlayers.$inferSelect;
export type InsertFavoritePlayer = typeof favoritePlayers.$inferInsert;

/**
 * Tabela de artigos/notícias do CMS
 */
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"), // Resumo/preview
  category: varchar("category", { length: 100 }).notNull(),
  imageUrl: text("imageUrl"),
  authorId: int("authorId").notNull(),
  authorName: varchar("authorName", { length: 255 }),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  featured: int("featured").default(0).notNull(), // 0 = não, 1 = sim
  views: int("views").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;