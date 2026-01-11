import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, favoriteTeams, favoritePlayers, InsertFavoriteTeam, InsertFavoritePlayer, articles, InsertArticle, Article } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Favoritos - Times
export async function addFavoriteTeam(userId: number, team: Omit<InsertFavoriteTeam, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(favoriteTeams).values({ ...team, userId });
}

export async function removeFavoriteTeam(userId: number, teamId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(favoriteTeams).where(and(eq(favoriteTeams.userId, userId), eq(favoriteTeams.teamId, teamId)));
}

export async function getFavoriteTeams(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(favoriteTeams).where(eq(favoriteTeams.userId, userId));
}

export async function isFavoriteTeam(userId: number, teamId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.select().from(favoriteTeams)
    .where(and(eq(favoriteTeams.userId, userId), eq(favoriteTeams.teamId, teamId)))
    .limit(1);
  
  return result.length > 0;
}

// Favoritos - Jogadores
export async function addFavoritePlayer(userId: number, player: Omit<InsertFavoritePlayer, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(favoritePlayers).values({ ...player, userId });
}

export async function removeFavoritePlayer(userId: number, playerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(favoritePlayers).where(and(eq(favoritePlayers.userId, userId), eq(favoritePlayers.playerId, playerId)));
}

export async function getFavoritePlayers(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(favoritePlayers).where(eq(favoritePlayers.userId, userId));
}

export async function isFavoritePlayer(userId: number, playerId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.select().from(favoritePlayers)
    .where(and(eq(favoritePlayers.userId, userId), eq(favoritePlayers.playerId, playerId)))
    .limit(1);
  
  return result.length > 0;
}

/**
 * ========================================
 * ARTICLE HELPERS
 * ========================================
 */

/**
 * Criar novo artigo
 */
export async function createArticle(article: InsertArticle): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(articles).values(article);
  return result[0].insertId;
}

/**
 * Atualizar artigo existente
 */
export async function updateArticle(id: number, data: Partial<InsertArticle>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(articles).set(data).where(eq(articles.id, id));
}

/**
 * Buscar artigo por ID
 */
export async function getArticleById(id: number): Promise<Article | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return result[0] || null;
}

/**
 * Buscar artigo por slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return result[0] || null;
}

/**
 * Listar todos os artigos publicados (ordenados por data)
 */
export async function getPublishedArticles(limit: number = 20): Promise<Article[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
  
  return result;
}

/**
 * Listar todos os artigos (incluindo rascunhos) - para admin
 */
export async function getAllArticles(): Promise<Article[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(articles)
    .orderBy(desc(articles.createdAt));
  
  return result;
}

/**
 * Deletar artigo
 */
export async function deleteArticle(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(articles).where(eq(articles.id, id));
}

/**
 * Incrementar visualizações de um artigo
 */
export async function incrementArticleViews(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const article = await getArticleById(id);
  if (article) {
    await db.update(articles).set({ views: article.views + 1 }).where(eq(articles.id, id));
  }
}
