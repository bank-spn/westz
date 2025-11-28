import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("parcels router", () => {
  it("should list parcels for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.parcels.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should create a new parcel", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.parcels.create({
      trackingNumber: "TEST123456789TH",
      destination: "Bangkok, Thailand",
      recipientName: "Test Recipient",
      note: "Test parcel",
    });

    expect(result.success).toBe(true);
  });

  it("should update parcel", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a parcel first
    await caller.parcels.create({
      trackingNumber: "TEST123456789TH",
      destination: "Bangkok, Thailand",
    });

    // Get the parcel list to find the ID
    const parcels = await caller.parcels.list();
    const testParcel = parcels.find((p) => p.trackingNumber === "TEST123456789TH");

    if (testParcel) {
      const result = await caller.parcels.update({
        id: testParcel.id,
        destination: "Phuket, Thailand",
      });

      expect(result.success).toBe(true);
    }
  });

  it("should delete parcel", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a parcel first
    await caller.parcels.create({
      trackingNumber: "TEST987654321TH",
      destination: "Chiang Mai, Thailand",
    });

    // Get the parcel list to find the ID
    const parcels = await caller.parcels.list();
    const testParcel = parcels.find((p) => p.trackingNumber === "TEST987654321TH");

    if (testParcel) {
      const result = await caller.parcels.delete({
        id: testParcel.id,
      });

      expect(result.success).toBe(true);
    }
  });
});
