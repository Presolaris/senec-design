import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createContactInquiry: vi.fn().mockResolvedValue({
    id: 1,
    name: "Test User",
    email: "test@example.com",
    phone: null,
    subject: null,
    message: "Test message for inquiry",
    interest: null,
    status: "new",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getAllContactInquiries: vi.fn().mockResolvedValue([]),
  getContactInquiryById: vi.fn().mockResolvedValue(null),
  updateContactInquiryStatus: vi.fn().mockResolvedValue(true),
}));

// Mock the notification function
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("contact.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully submits a contact inquiry with required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Max Mustermann",
      email: "max@example.com",
      message: "Ich interessiere mich für eine PV-Anlage.",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBe(1);
  });

  it("successfully submits a contact inquiry with all fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Max Mustermann",
      email: "max@example.com",
      phone: "+49 341 123456",
      subject: "Anfrage PV-Anlage",
      message: "Ich interessiere mich für eine PV-Anlage für mein Einfamilienhaus.",
      interest: "pv-anlage",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBe(1);
  });

  it("rejects submission with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Max Mustermann",
        email: "invalid-email",
        message: "Test message",
      })
    ).rejects.toThrow();
  });

  it("rejects submission with short name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "M",
        email: "max@example.com",
        message: "Test message",
      })
    ).rejects.toThrow();
  });

  it("rejects submission with short message", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Max Mustermann",
        email: "max@example.com",
        message: "Short",
      })
    ).rejects.toThrow();
  });
});
