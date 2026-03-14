import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

dotenv.config();

export const db = drizzle(process.env.DATABASE_URL!, { schema });
