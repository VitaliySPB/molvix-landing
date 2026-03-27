import { Router, type IRouter } from "express";
import { db, demoRequestsTable } from "@workspace/db";
import { SubmitDemoRequestBody, ListDemoRequestsResponse } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.post("/demo-requests", async (req, res): Promise<void> => {
  const parsed = SubmitDemoRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation failed",
      details: parsed.error.issues.map((i) => i.message),
    });
    return;
  }

  const [request] = await db
    .insert(demoRequestsTable)
    .values(parsed.data)
    .returning();

  req.log.info({ id: request.id, email: request.email }, "Demo request submitted");

  res.status(201).json({
    id: request.id,
    name: request.name,
    email: request.email,
    phone: request.phone,
    company: request.company,
    role: request.role,
    message: request.message ?? null,
    createdAt: request.createdAt.toISOString(),
  });
});

router.get("/demo-requests", async (req, res): Promise<void> => {
  const requests = await db
    .select()
    .from(demoRequestsTable)
    .orderBy(desc(demoRequestsTable.createdAt));

  const response = ListDemoRequestsResponse.parse({
    requests: requests.map((r) => ({
      ...r,
      message: r.message ?? null,
      createdAt: r.createdAt.toISOString(),
    })),
  });

  res.json(response);
});

export default router;
