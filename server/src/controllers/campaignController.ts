import { Request, Response } from "express";
import prisma from "../prismaClient";

export const createCampaign = async (req: any, res: Response) => {
    const { title, description, budget, startDate, endDate } = req.body;
    const campaign = await prisma.campaign.create({
        data: {
            clientId: parseInt(req.user.id),
            title,
            description,
            budget: budget ? parseFloat(String(budget)) : undefined,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            status: "active"
        }
    });
    res.json(campaign);
};

export const listCampaigns = async (req: any, res: Response): Promise<void> => {
    // client sees own; owner maybe use query to see campaigns that bid on their billboards
    if (req.user.role === "client") {
        const c = await prisma.campaign.findMany({ where: { clientId: parseInt(req.user.id) } });
        res.json(c);
        return;
    }
    // owner view: campaigns that have bids for their billboards
    if (req.user.role === "owner") {
        const billboards = await prisma.billboard.findMany({
            where: { ownerId: parseInt(req.user.id) },
            select: { id: true }
        });
        const bIds = billboards.map(b => b.id);
        const bids = await prisma.bid.findMany({
            where: { billboardId: { in: bIds } },
            include: { campaign: true }
        });
        res.json(bids);
        return;
    }
    res.json([]);
};

export const getCampaign = async (req: any, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const c = await prisma.campaign.findUnique({
        where: { id },
        include: { bids: true }
    });
    if (!c) {
        res.status(404).json({ error: "Not found" });
        return;
    }
    res.json(c);
};
