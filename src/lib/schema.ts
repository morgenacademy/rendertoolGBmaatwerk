import { z } from "zod";

export const InterpretationSchema = z.object({
  summary: z.string().min(1),
  changes: z.array(z.string().min(1)).min(1),
  render_prompt: z.string().min(1),
});

export type Interpretation = z.infer<typeof InterpretationSchema>;
