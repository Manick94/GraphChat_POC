import { Router } from "express";
import { z } from "zod";
import {
  sendMessage,
  startConversation,
} from "../services/conversationService";

const router = Router();

router.post("/", async (req, res) => {
  const schema = z.object({
    scenarioId: z.string(),
    userId: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const conversation = await startConversation(
    parsed.data.scenarioId,
    parsed.data.userId,
  );
  return res.json(conversation);
});

router.post("/:id/message", async (req, res) => {
  const schema = z.object({ message: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const result = await sendMessage(req.params.id, parsed.data.message);
    return res.json({
      messages: [result.node],
      context: result.context,
      availableOptions: result.availableOptions.map((option) => option.label),
      isComplete: result.isComplete,
    });
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
});

export default router;
