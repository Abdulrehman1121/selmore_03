import { Router } from "express";
import { authGuard, roleGuard } from "../middleware/auth";
import multer from "multer";
import os from "os";
import {
  listBillboards,
  getBillboard,
  createBillboard,
  updateBillboard,
  deleteBillboard,
} from "../controllers/billboardController";

const router = Router();

// Configure multer for Vercel (Serverless)
// Vercel only allows writing to /tmp directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/**
 * ✅ Get all billboards (public)
 */
router.get("/", listBillboards);

/**
 * ✅ Get a single billboard by ID
 */
router.get("/:id", getBillboard);

/**
 * ✅ Create a new billboard (Owner only)
 */
router.post(
  "/",
  authGuard,
  roleGuard(["owner"]),
  upload.single("image"),
  createBillboard
);

/**
 * ✅ Update billboard (Owner only)
 */
router.put(
  "/:id",
  authGuard,
  roleGuard(["owner"]),
  upload.single("image"),
  updateBillboard
);

/**
 * ✅ Delete billboard (Owner only)
 */
router.delete(
  "/:id",
  authGuard,
  roleGuard(["owner"]),
  deleteBillboard
);

export default router;
