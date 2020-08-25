import * as dotenv from "dotenv";

dotenv.config();

dotenv.config({ path: "../.env" });

export const ATLAS_CONFIG = process.env.ATLAS;

export const SEND_GRID = process.env.SEND_GRID;
