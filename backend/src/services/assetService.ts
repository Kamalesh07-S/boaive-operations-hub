// src/services/assetService.ts
import prisma from '../config/prisma';
import { generateAssetCode } from '../utils/codeGenerator';
import { AppError } from '../middleware/errorHandler';

function getRenewalStatus(renewalDate: Date | null): string {
  if (!renewalDate) return 'OK';
  const now = new Date();
  const daysUntil = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil < 0) return 'Expired';
  if (daysUntil <= 30) return 'Renew Soon';
  return 'OK';
}

export const assetService = {
  async list({ page, limit, search, status, clientId }: any) {
    const where: any = {};
    if (search) {
      where.OR = [
        { assetName: { contains: search, mode: 'insensitive' } },
        { provider: { contains: search, mode: 'insensitive' } },
        { assetCode: { contains: search, mode: 'insensitive' } },
        { domainOrAccountName: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    const [total, records] = await Promise.all([
      prisma.assetRecord.count({ where }),
      prisma.assetRecord.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { renewalDate: 'asc' },
        include: {
          client: { select: { clientName: true } },
          project: { select: { projectName: true } },
        },
      }),
    ]);

    const recordsWithStatus = records.map((r) => ({
      ...r,
      renewalStatus: getRenewalStatus(r.renewalDate),
    }));

    return { data: recordsWithStatus, total };
  },

  async getById(id: string) {
    const record = await prisma.assetRecord.findUnique({
      where: { id },
      include: {
        client: { select: { clientName: true } },
        project: { select: { projectName: true } },
      },
    });
    if (!record) throw new AppError('Asset not found', 404);
    return { ...record, renewalStatus: getRenewalStatus(record.renewalDate) };
  },

  async create(data: any) {
    const assetCode = await generateAssetCode();
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    return prisma.assetRecord.create({
      data: {
        assetCode,
        assetType: data.assetType ?? 'Domain',
        assetName: data.assetName,
        domainOrAccountName: data.domainOrAccountName,
        ownerType: data.ownerType ?? 'Boaive_Internal',
        clientId: data.clientId || null,
        projectId: data.projectId || null,
        provider: data.provider,
        purchaseDate: parseDate(data.purchaseDate),
        renewalDate: parseDate(data.renewalDate),
        cost: data.cost ?? 0,
        billingFrequency: data.billingFrequency ?? 'Annual',
        status: data.status ?? 'Active',
        accountReference: data.accountReference,
        purpose: data.purpose,
        notes: data.notes,
      },
      include: {
        client: { select: { clientName: true } },
        project: { select: { projectName: true } },
      },
    });
  },

  async update(id: string, data: any) {
    await assetService.getById(id);
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    const updated = await prisma.assetRecord.update({
      where: { id },
      data: {
        ...data,
        clientId: data.clientId || undefined,
        projectId: data.projectId || undefined,
        purchaseDate: parseDate(data.purchaseDate),
        renewalDate: parseDate(data.renewalDate),
      },
      include: {
        client: { select: { clientName: true } },
        project: { select: { projectName: true } },
      },
    });
    return { ...updated, renewalStatus: getRenewalStatus(updated.renewalDate) };
  },

  async delete(id: string) {
    await assetService.getById(id);
    return prisma.assetRecord.delete({ where: { id } });
  },
};
