import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { generateArticleContent, generateSlug } from "./ai-service";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  articles: router({
    // Listar todos os artigos publicados (público)
    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getPublishedArticles(input?.limit || 20);
      }),
    
    // Buscar artigo por slug (público)
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const article = await db.getArticleBySlug(input.slug);
        if (article) {
          await db.incrementArticleViews(article.id);
        }
        return article;
      }),
    
    // Listar todos os artigos (admin)
    listAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Acesso negado');
      }
      return await db.getAllArticles();
    }),
    
    // Criar novo artigo (admin)
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        content: z.string(),
        excerpt: z.string().optional(),
        category: z.string(),
        imageUrl: z.string().optional(),
        status: z.enum(['draft', 'published']).default('draft'),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Acesso negado');
        }
        
        const slug = generateSlug(input.title);
        const articleId = await db.createArticle({
          ...input,
          slug,
          authorId: ctx.user.id,
          authorName: ctx.user.name || 'Anônimo',
          publishedAt: input.status === 'published' ? new Date() : undefined,
        });
        
        return { id: articleId, slug };
      }),
    
    // Atualizar artigo (admin)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
        status: z.enum(['draft', 'published']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Acesso negado');
        }
        
        const { id, ...data } = input;
        
        // Se mudou o título, regenerar slug
        if (data.title) {
          (data as any).slug = generateSlug(data.title);
        }
        
        // Se publicou agora, setar publishedAt
        if (data.status === 'published') {
          const article = await db.getArticleById(id);
          if (article && !article.publishedAt) {
            (data as any).publishedAt = new Date();
          }
        }
        
        await db.updateArticle(id, data);
        return { success: true };
      }),
    
    // Deletar artigo (admin)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Acesso negado');
        }
        await db.deleteArticle(input.id);
        return { success: true };
      }),
    
    // Gerar conteúdo com IA (admin)
    generateContent: protectedProcedure
      .input(z.object({
        title: z.string(),
        category: z.string(),
        keywords: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Acesso negado');
        }
        
        const result = await generateArticleContent(input);
        return result;
      }),
  }),

  favorites: router({
    // Times Favoritos
    teams: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        return await db.getFavoriteTeams(ctx.user.id);
      }),
      add: protectedProcedure
        .input(z.object({
          teamId: z.number(),
          teamName: z.string(),
          teamLogo: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          await db.addFavoriteTeam(ctx.user.id, input);
          return { success: true };
        }),
      remove: protectedProcedure
        .input(z.object({ teamId: z.number() }))
        .mutation(async ({ ctx, input }) => {
          await db.removeFavoriteTeam(ctx.user.id, input.teamId);
          return { success: true };
        }),
      isFavorite: protectedProcedure
        .input(z.object({ teamId: z.number() }))
        .query(async ({ ctx, input }) => {
          return await db.isFavoriteTeam(ctx.user.id, input.teamId);
        }),
    }),
    // Jogadores Favoritos
    players: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        return await db.getFavoritePlayers(ctx.user.id);
      }),
      add: protectedProcedure
        .input(z.object({
          playerId: z.number(),
          playerName: z.string(),
          playerPhoto: z.string().optional(),
          teamName: z.string().optional(),
          position: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          await db.addFavoritePlayer(ctx.user.id, input);
          return { success: true };
        }),
      remove: protectedProcedure
        .input(z.object({ playerId: z.number() }))
        .mutation(async ({ ctx, input }) => {
          await db.removeFavoritePlayer(ctx.user.id, input.playerId);
          return { success: true };
        }),
      isFavorite: protectedProcedure
        .input(z.object({ playerId: z.number() }))
        .query(async ({ ctx, input }) => {
          return await db.isFavoritePlayer(ctx.user.id, input.playerId);
        }),
    }),
  }),
});


export type AppRouter = typeof appRouter;
