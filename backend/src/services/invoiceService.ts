// src/services/invoiceService.ts
import prisma from '../config/prisma';
import { generateInvoiceCode } from '../utils/codeGenerator';
import { AppError } from '../middleware/errorHandler';

export const invoiceService = {
  async list({ page, limit, search, status, clientId, projectId }: any) {
    const where: any = {};
    if (search) {
      where.OR = [{ invoiceNumber: { contains: search, mode: 'insensitive' } }];
    }
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (projectId) where.projectId = projectId;

    const [total, invoices] = await Promise.all([
      prisma.invoice.count({ where }),
      prisma.invoice.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { clientName: true, company: true } },
          project: { select: { projectName: true } },
        },
      }),
    ]);

    const invoicesWithBalance = invoices.map((inv) => ({
      ...inv,
      balance: inv.totalAmount - inv.amountPaid,
    }));

    return { data: invoicesWithBalance, total };
  },

  async getById(id: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: { select: { clientName: true, company: true, email: true, phone: true } },
        project: { select: { projectName: true, projectCode: true } },
      },
    });
    if (!invoice) throw new AppError('Invoice not found', 404);
    return { ...invoice, balance: invoice.totalAmount - invoice.amountPaid };
  },

  async create(data: any) {
    const invoiceNumber = await generateInvoiceCode();
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    const subtotal = data.subtotal ?? 0;
    const tax = data.tax ?? 0;
    const discount = data.discount ?? 0;
    const totalAmount = subtotal + tax - discount;

    const client = await prisma.client.findUnique({ where: { id: data.clientId } });
    if (!client) throw new AppError('Client not found', 404);

    return prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId: data.clientId,
        projectId: data.projectId || null,
        issueDate: parseDate(data.issueDate) ?? new Date(),
        dueDate: parseDate(data.dueDate),
        subtotal,
        tax,
        discount,
        totalAmount,
        amountPaid: data.amountPaid ?? 0,
        status: data.status ?? 'Draft',
        notes: data.notes,
      },
      include: {
        client: { select: { clientName: true, company: true } },
        project: { select: { projectName: true } },
      },
    });
  },

  async update(id: string, data: any) {
    await invoiceService.getById(id);
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    const subtotal = data.subtotal;
    const tax = data.tax;
    const discount = data.discount;
    const totalAmount =
      subtotal !== undefined ? subtotal + (tax ?? 0) - (discount ?? 0) : undefined;

    return prisma.invoice.update({
      where: { id },
      data: {
        ...data,
        projectId: data.projectId || undefined,
        issueDate: parseDate(data.issueDate),
        dueDate: parseDate(data.dueDate),
        totalAmount,
      },
      include: {
        client: { select: { clientName: true, company: true } },
        project: { select: { projectName: true } },
      },
    });
  },

  async delete(id: string) {
    await invoiceService.getById(id);
    return prisma.invoice.delete({ where: { id } });
  },
};
