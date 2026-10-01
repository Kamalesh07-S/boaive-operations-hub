// src/services/clientService.ts
import prisma from '../config/prisma';
import { generateClientCode } from '../utils/codeGenerator';
import { AppError } from '../middleware/errorHandler';

interface ListOptions {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export const clientService = {
  async list({ page, limit, search, status }: ListOptions) {
    const where: any = {};

    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { clientCode: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.clientStatus = status;

    const [total, clients] = await Promise.all([
      prisma.client.count({ where }),
      prisma.client.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { projects: true, contacts: true } },
        },
      }),
    ]);

    // Calculate financial summaries
    const clientsWithStats = await Promise.all(
      clients.map(async (c) => {
        const [financeAgg, invoiceAgg] = await Promise.all([
          prisma.financeRecord.aggregate({
            where: { clientId: c.id, type: 'Income' },
            _sum: { amount: true },
          }),
          prisma.invoice.aggregate({
            where: { clientId: c.id },
            _sum: { totalAmount: true, amountPaid: true },
          }),
        ]);

        const totalProjectValue = invoiceAgg._sum.totalAmount ?? 0;
        const totalAmountPaid = invoiceAgg._sum.amountPaid ?? 0;
        const outstandingAmount = totalProjectValue - totalAmountPaid;

        return {
          ...c,
          totalProjectValue,
          totalAmountPaid,
          outstandingAmount,
          activeProjectsCount: c._count.projects,
          _financeTotal: financeAgg._sum.amount ?? 0,
        };
      })
    );

    return { data: clientsWithStats, total };
  },

  async getById(id: string) {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        contacts: { orderBy: { createdAt: 'desc' } },
        projects: { orderBy: { createdAt: 'desc' } },
        leads: { orderBy: { createdAt: 'desc' } },
        invoices: { orderBy: { createdAt: 'desc' } },
        _count: { select: { projects: true, contacts: true } },
      },
    });
    if (!client) throw new AppError('Client not found', 404);

    const [financeAgg, invoiceAgg] = await Promise.all([
      prisma.financeRecord.aggregate({ where: { clientId: id, type: 'Income' }, _sum: { amount: true } }),
      prisma.invoice.aggregate({ where: { clientId: id }, _sum: { totalAmount: true, amountPaid: true } }),
    ]);

    return {
      ...client,
      totalProjectValue: invoiceAgg._sum.totalAmount ?? 0,
      totalAmountPaid: invoiceAgg._sum.amountPaid ?? 0,
      outstandingAmount: (invoiceAgg._sum.totalAmount ?? 0) - (invoiceAgg._sum.amountPaid ?? 0),
    };
  },

  async create(data: any) {
    const clientCode = await generateClientCode();
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    return prisma.client.create({
      data: {
        clientCode,
        clientName: data.clientName,
        company: data.company,
        contactPerson: data.contactPerson,
        email: data.email || null,
        phone: data.phone,
        location: data.location,
        website: data.website || null,
        source: data.source,
        clientStatus: data.clientStatus ?? 'Active',
        clientType: data.clientType ?? 'Project_based',
        firstContactDate: parseDate(data.firstContactDate),
        onboardingDate: parseDate(data.onboardingDate),
        lastContactDate: parseDate(data.lastContactDate),
        nextFollowUp: parseDate(data.nextFollowUp),
        notes: data.notes,
      },
    });
  },

  async update(id: string, data: any) {
    await clientService.getById(id);
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    return prisma.client.update({
      where: { id },
      data: {
        ...data,
        email: data.email || undefined,
        website: data.website || undefined,
        firstContactDate: parseDate(data.firstContactDate),
        onboardingDate: parseDate(data.onboardingDate),
        lastContactDate: parseDate(data.lastContactDate),
        nextFollowUp: parseDate(data.nextFollowUp),
      },
    });
  },

  async delete(id: string) {
    await clientService.getById(id);
    return prisma.client.delete({ where: { id } });
  },
};
