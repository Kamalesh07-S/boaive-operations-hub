// src/services/expenseService.ts
import prisma from '../config/prisma';
import { generateExpenseCode } from '../utils/codeGenerator';
import { AppError } from '../middleware/errorHandler';

function calcMonthlyCost(amount: number, frequency: string): number {
  switch (frequency) {
    case 'Monthly': return amount;
    case 'Quarterly': return Math.round(amount / 3);
    case 'Annual': return Math.round(amount / 12);
    default: return 0;
  }
}

export const expenseService = {
  async list({ page, limit, search, status, clientId, projectId }: any) {
    const where: any = {};
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { vendor: { contains: search, mode: 'insensitive' } },
        { expenseCode: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.paymentStatus = status;
    if (clientId) where.clientId = clientId;
    if (projectId) where.projectId = projectId;

    const [total, records] = await Promise.all([
      prisma.expenseRecord.count({ where }),
      prisma.expenseRecord.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          client: { select: { clientName: true } },
          project: { select: { projectName: true } },
        },
      }),
    ]);
    return { data: records, total };
  },

  async getById(id: string) {
    const record = await prisma.expenseRecord.findUnique({
      where: { id },
      include: {
        client: { select: { clientName: true } },
        project: { select: { projectName: true } },
      },
    });
    if (!record) throw new AppError('Expense not found', 404);
    return record;
  },

  async create(data: any) {
    const expenseCode = await generateExpenseCode();
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);
    const freq = data.frequency ?? 'One_time';
    const monthlyCost = calcMonthlyCost(data.amount, freq);

    return prisma.expenseRecord.create({
      data: {
        expenseCode,
        date: parseDate(data.date) ?? new Date(),
        type: data.type ?? 'Operational',
        category: data.category ?? 'Operations_Office',
        description: data.description,
        vendor: data.vendor,
        amount: data.amount,
        frequency: freq,
        monthlyCost,
        renewalDate: parseDate(data.renewalDate),
        nextDue: parseDate(data.nextDue),
        paymentStatus: data.paymentStatus ?? 'Pending',
        paymentMethod: data.paymentMethod,
        ownerId: data.ownerId,
        clientId: data.clientId || null,
        projectId: data.projectId || null,
        notes: data.notes,
      },
      include: {
        client: { select: { clientName: true } },
        project: { select: { projectName: true } },
      },
    });
  },

  async update(id: string, data: any) {
    await expenseService.getById(id);
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);
    const monthlyCost = data.amount && data.frequency
      ? calcMonthlyCost(data.amount, data.frequency)
      : undefined;

    return prisma.expenseRecord.update({
      where: { id },
      data: {
        ...data,
        clientId: data.clientId || undefined,
        projectId: data.projectId || undefined,
        date: parseDate(data.date),
        renewalDate: parseDate(data.renewalDate),
        nextDue: parseDate(data.nextDue),
        monthlyCost,
      },
      include: {
        client: { select: { clientName: true } },
        project: { select: { projectName: true } },
      },
    });
  },

  async delete(id: string) {
    await expenseService.getById(id);
    return prisma.expenseRecord.delete({ where: { id } });
  },
};
