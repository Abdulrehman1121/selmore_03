import { Request, Response } from "express";
import prisma from "../prismaClient";
import fs from "fs";
import path from "path";

export const listBillboards = async (req: Request, res: Response) => {
  const { city, type, minPrice, maxPrice, bookingType } = req.query;
  const where: any = {};
  if (city) where.city = String(city);
  if (type) where.type = String(type);
  if (bookingType) where.bookingType = String(bookingType);
  if (minPrice || maxPrice) where.price = {};
  if (minPrice) where.price.gte = Number(minPrice);
  if (maxPrice) where.price.lte = Number(maxPrice);

  const billboards = await prisma.billboard.findMany({ where });
  res.json(billboards);
};

export const getBillboard = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const b = await prisma.billboard.findUnique({ where: { id } });
  if (!b) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(b);
};

export const createBillboard = async (req: any, res: Response) => {
  try {
    const data = req.body;
    const ownerId = req.user.id;
    const image = req.file ? `/${process.env.UPLOAD_DIR || "uploads"}/${req.file.filename}` : undefined;
    const bb = await prisma.billboard.create({
      data: {
        ownerId,
        title: data.title,
        location: data.location,
        city: data.city,
        type: data.type,
        price: parseFloat(data.price),
        priceType: data.priceType,
        weekPrice: data.weekPrice ? parseFloat(data.weekPrice) : undefined,
        monthPrice: data.monthPrice ? parseFloat(data.monthPrice) : undefined,
        bookingType: data.bookingType || "direct",
        image
      }
    });
    res.json(bb);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateBillboard = async (req: any, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const bb = await prisma.billboard.findUnique({ where: { id } });
    if (!bb) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    if (bb.ownerId !== req.user.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const data = req.body;
    const image = req.file ? `/${process.env.UPLOAD_DIR || "uploads"}/${req.file.filename}` : bb.image;

    const updated = await prisma.billboard.update({
      where: { id },
      data: { ...data, price: data.price ? parseFloat(data.price) : bb.price, image }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteBillboard = async (req: any, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const bb = await prisma.billboard.findUnique({ where: { id } });
    if (!bb) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    if (bb.ownerId !== req.user.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    if (bb.image) {
      const fpath = path.join(__dirname, "..", "..", bb.image);
      if (fs.existsSync(fpath)) fs.unlinkSync(fpath);
    }
    await prisma.billboard.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
