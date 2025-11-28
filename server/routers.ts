import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { trackParcel, getLatestStatus, isDelivered } from "./thailandPost";

export const appRouter = router({
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

  // Parcel management
  parcels: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserParcels(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getParcelById(input.id, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        trackingNumber: z.string(),
        destination: z.string().optional(),
        recipientName: z.string().optional(),
        dateSent: z.date().optional(),
        note: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createParcel({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        trackingNumber: z.string().optional(),
        destination: z.string().optional(),
        recipientName: z.string().optional(),
        dateSent: z.date().optional(),
        note: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateParcel(id, ctx.user.id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteParcel(input.id, ctx.user.id);
        return { success: true };
      }),

    refreshStatus: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const parcel = await db.getParcelById(input.id, ctx.user.id);
        if (!parcel) {
          throw new Error('Parcel not found');
        }

        const settings = await db.getUserSettings(ctx.user.id);
        const trackingItems = await trackParcel(
          parcel.trackingNumber,
          settings?.thailandPostApiToken || undefined
        );

        const latest = getLatestStatus(trackingItems);
        const delivered = isDelivered(trackingItems);

        if (latest) {
          await db.updateParcel(input.id, ctx.user.id, {
            currentStatus: latest.status,
            currentStatusDescription: latest.status_description,
            currentLocation: latest.location,
            lastUpdated: new Date(latest.status_date),
            deliveryStatus: latest.delivery_status,
            isDelivered: delivered,
          });
        }

        return { success: true, trackingItems };
      }),

    getTrackingHistory: protectedProcedure
      .input(z.object({ trackingNumber: z.string() }))
      .query(async ({ ctx, input }) => {
        const settings = await db.getUserSettings(ctx.user.id);
        const trackingItems = await trackParcel(
          input.trackingNumber,
          settings?.thailandPostApiToken || undefined
        );
        return trackingItems;
      }),
  }),

  // Project management
  projects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserProjects(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getProjectById(input.id, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        status: z.enum(["planning", "in_progress", "completed", "on_hold"]).optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
        dueDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createProject({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["planning", "in_progress", "completed", "on_hold"]).optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
        dueDate: z.date().optional(),
        completedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateProject(id, ctx.user.id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteProject(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // Project tasks
  projectTasks: router({
    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProjectTasks(input.projectId);
      }),

    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        title: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createProjectTask(input);
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        isCompleted: z.boolean().optional(),
        completedAt: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateProjectTask(id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProjectTask(input.id);
        return { success: true };
      }),
  }),

  // Weekly plans
  weeklyPlans: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserWeeklyPlans(ctx.user.id);
    }),

    getByWeek: protectedProcedure
      .input(z.object({ weekStartDate: z.date() }))
      .query(async ({ ctx, input }) => {
        return await db.getWeeklyPlansByWeek(ctx.user.id, input.weekStartDate);
      }),

    create: protectedProcedure
      .input(z.object({
        weekStartDate: z.date(),
        title: z.string(),
        description: z.string().optional(),
        dayOfWeek: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createWeeklyPlan({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        dayOfWeek: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]).optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        isCompleted: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateWeeklyPlan(id, ctx.user.id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteWeeklyPlan(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // Settings
  settings: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserSettings(ctx.user.id);
    }),

    update: protectedProcedure
      .input(z.object({
        thailandPostApiToken: z.string().optional(),
        supabaseUrl: z.string().optional(),
        supabaseAnonKey: z.string().optional(),
        notificationsEnabled: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertSettings(ctx.user.id, input);
        return { success: true };
      }),

    testConnection: protectedProcedure.query(async ({ ctx }) => {
      const settings = await db.getUserSettings(ctx.user.id);
      
      try {
        // Test Thailand Post API
        await trackParcel('EE001040482TH', settings?.thailandPostApiToken || undefined);
        return { 
          success: true, 
          thailandPostApi: true,
          message: 'Connection successful'
        };
      } catch (error) {
        return { 
          success: false, 
          thailandPostApi: false,
          message: 'Thailand Post API connection failed'
        };
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
