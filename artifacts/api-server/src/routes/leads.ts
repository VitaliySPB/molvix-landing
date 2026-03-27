import { Router, type IRouter } from "express";
import { db, eventLeadsTable } from "@workspace/db";

const router: IRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/event-leads", async (req, res): Promise<void> => {
  const { email, eventType, participants } = req.body as Record<string, unknown>;

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }

  const [lead] = await db
    .insert(eventLeadsTable)
    .values({
      email: email.trim().toLowerCase(),
      eventType: typeof eventType === "string" ? eventType.slice(0, 200) : null,
      participants: typeof participants === "string" ? participants.slice(0, 50) : null,
    })
    .returning();

  req.log.info({ id: lead.id, email: lead.email }, "Event lead captured");

  res.status(201).json({ id: lead.id });
});

export default router;
