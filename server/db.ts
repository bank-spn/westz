import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  parcels, 
  InsertParcel,
  projects,
  InsertProject,
  projectTasks,
  InsertProjectTask,
  weeklyPlans,
  InsertWeeklyPlan,
  settings,
  InsertSettings
} from "../drizzle/schema";
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

// Parcel helpers
export async function getUserParcels(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(parcels).where(eq(parcels.userId, userId)).orderBy(desc(parcels.createdAt));
}

export async function getParcelById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(parcels).where(and(eq(parcels.id, id), eq(parcels.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createParcel(parcel: InsertParcel) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(parcels).values(parcel);
  return result;
}

export async function updateParcel(id: number, userId: number, data: Partial<InsertParcel>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(parcels).set(data).where(and(eq(parcels.id, id), eq(parcels.userId, userId)));
}

export async function deleteParcel(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(parcels).where(and(eq(parcels.id, id), eq(parcels.userId, userId)));
}

// Project helpers
export async function getUserProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
}

export async function getProjectById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(projects).where(and(eq(projects.id, id), eq(projects.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(projects).values(project);
  return result;
}

export async function updateProject(id: number, userId: number, data: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(projects).set(data).where(and(eq(projects.id, id), eq(projects.userId, userId)));
}

export async function deleteProject(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)));
}

// Project Task helpers
export async function getProjectTasks(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(projectTasks).where(eq(projectTasks.projectId, projectId)).orderBy(desc(projectTasks.createdAt));
}

export async function createProjectTask(task: InsertProjectTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(projectTasks).values(task);
  return result;
}

export async function updateProjectTask(id: number, data: Partial<InsertProjectTask>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(projectTasks).set(data).where(eq(projectTasks.id, id));
}

export async function deleteProjectTask(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(projectTasks).where(eq(projectTasks.id, id));
}

// Weekly Plan helpers
export async function getUserWeeklyPlans(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(weeklyPlans).where(eq(weeklyPlans.userId, userId)).orderBy(desc(weeklyPlans.weekStartDate));
}

export async function getWeeklyPlansByWeek(userId: number, weekStartDate: Date) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(weeklyPlans).where(
    and(eq(weeklyPlans.userId, userId), eq(weeklyPlans.weekStartDate, weekStartDate))
  );
}

export async function createWeeklyPlan(plan: InsertWeeklyPlan) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(weeklyPlans).values(plan);
  return result;
}

export async function updateWeeklyPlan(id: number, userId: number, data: Partial<InsertWeeklyPlan>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(weeklyPlans).set(data).where(and(eq(weeklyPlans.id, id), eq(weeklyPlans.userId, userId)));
}

export async function deleteWeeklyPlan(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(weeklyPlans).where(and(eq(weeklyPlans.id, id), eq(weeklyPlans.userId, userId)));
}

// Settings helpers
export async function getUserSettings(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertSettings(userId: number, data: Partial<InsertSettings>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getUserSettings(userId);
  
  if (existing) {
    await db.update(settings).set(data).where(eq(settings.userId, userId));
  } else {
    await db.insert(settings).values({ userId, ...data });
  }
}
