import { Request, Response } from "express";
import prisma from "../prismaClient";
import PDFDocument from "pdfkit";

export const listInvoices = async (req: any, res: Response): Promise<void> => {
  if (req.user.role === "owner") {
    const bookings = await prisma.booking.findMany({
      where: { ownerId: req.user.id },
      select: { id: true },
    });
    const bookingIds = bookings.map((b) => b.id);
    const invoices = await prisma.invoice.findMany({ where: { bookingId: { in: bookingIds } } });
    res.json(invoices);
    return;
  }

  if (req.user.role === "client") {
    const bookings = await prisma.booking.findMany({
      where: { clientId: req.user.id },
      select: { id: true },
    });
    const bookingIds = bookings.map((b) => b.id);
    const invoices = await prisma.invoice.findMany({ where: { bookingId: { in: bookingIds } } });
    res.json(invoices);
    return;
  }

  const invoices = await prisma.invoice.findMany();
  res.json(invoices);
};

export const downloadInvoice = async (req: any, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { booking: true },
  });

  if (!invoice) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const booking = invoice.booking;
  if (req.user.role === "owner" && booking.ownerId !== req.user.id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  if (req.user.role === "client" && booking.clientId !== req.user.id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${invoice.invoiceNumber}.pdf`);
  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice #: ${invoice.invoiceNumber}`);
  doc.text(`Amount: $${invoice.amount.toFixed(2)}`);
  doc.text(`Status: ${invoice.status}`);
  doc.text(`Date: ${invoice.createdAt}`);
  doc.pipe(res);
  doc.end();
};

export const markPaid = async (req: any, res: Response) => {
  const id = parseInt(req.params.id);
  const inv = await prisma.invoice.update({ where: { id }, data: { status: "paid" } });
  res.json(inv);
};
