import { z } from 'zod'

export default z.object({
  meal_id: z.string().uuid(),
  consumption_date: z.string().datetime(),
})
