import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, contactInquiries, InsertContactInquiry, ContactInquiry } from "../drizzle/schema";
import { desc } from "drizzle-orm";
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

// Contact inquiry helpers
export async function createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create contact inquiry: database not available");
    return null;
  }

  try {
    const result = await db.insert(contactInquiries).values(inquiry);
    const insertId = result[0].insertId;
    
    const created = await db.select().from(contactInquiries).where(eq(contactInquiries.id, insertId)).limit(1);
    return created[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create contact inquiry:", error);
    throw error;
  }
}

export async function getAllContactInquiries(): Promise<ContactInquiry[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contact inquiries: database not available");
    return [];
  }

  return await db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
}

export async function getContactInquiryById(id: number): Promise<ContactInquiry | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contact inquiry: database not available");
    return null;
  }

  const result = await db.select().from(contactInquiries).where(eq(contactInquiries.id, id)).limit(1);
  return result[0] || null;
}

export async function updateContactInquiryStatus(id: number, status: "new" | "in_progress" | "completed" | "archived"): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update contact inquiry: database not available");
    return false;
  }

  try {
    await db.update(contactInquiries).set({ status }).where(eq(contactInquiries.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update contact inquiry:", error);
    return false;
  }
}
