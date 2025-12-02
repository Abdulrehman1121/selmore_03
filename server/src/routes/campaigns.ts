import { Router } from "express";
import { authGuard, roleGuard } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

/**
 * ✅ Create a new campaign (Client only)
 */
router.post("/", authGuard, roleGuard(["client"]), async (req, res) => {
  try {
    const { name, description } = req.body;

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        clientId: req.user.id,
      },
    });

    res.status(201).json(campaign);
  } catch (err) {
    console.error("Error creating campaign:", err);
    res.status(500).json({ error: "Failed to create campaign" });
  }
});

/**
 * ✅ Get all campaigns (public or client)
 */
router.get("/", async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        client: { select: { id: true, name: true, email: true } },
        bookings: true,
        bids: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(campaigns);
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
});

/**
 * ✅ Get single campaign
 */
router.get("/:id", async (req, res) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        client: { select: { id: true, name: true, email: true } },
        bookings: true,
        bids: true,
      },
    });
    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }
    res.json(campaign);
  } catch (err) {
    console.error("Error fetching campaign:", err);
    res.status(500).json({ error: "Failed to fetch campaign" });
  }
});

export default router;
