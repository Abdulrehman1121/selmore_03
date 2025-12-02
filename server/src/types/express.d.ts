import { User } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user?: any; // Using any to avoid strict type issues for now, or define a proper User interface
        }
    }
}
