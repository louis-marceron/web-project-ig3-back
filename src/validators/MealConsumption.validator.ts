import { z } from "zod";

const MealSchema = z.object({
    name: z.string().nonempty(),
    description: z.string().optional(),
    carbon_footprint: z.number().min(0),
});
