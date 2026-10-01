// src/services/leadService.ts
import prisma from '../config/prisma';
import { generateLeadCode } from '../utils/codeGenerator';
import { AppError } from '../middleware/errorHandler';

export const leadService = {
  async list({ page, limit, search, status }: any) {
    const where: any = {};
    if (search) {
      where.OR = [
        { leadName: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { leadCode: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { contact: { select: { name: true } }, client: { select: { clientName: true } } },
      }),
    ]);

    const leadsWithWeighted = leads.map((l) => ({
      ...l,
      weightedValue: Math.round((l.estimatedValue * l.probability) / 100),
    }));

    return { data: leadsWithWeighted, total };
  },

  async getById(id: string) {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { contact: true, client: true },
    });
    if (!lead) throw new AppError('Lead not found', 404);
    return { ...lead, weightedValue: Math.round((lead.estimatedValue * lead.probability) / 100) };
  },

  async create(data: any) {
    const leadCode = await generateLeadCode();
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    const lead = await prisma.lead.create({
      data: {
        leadCode,
        leadName: data.leadName,
        company: data.company,
        contactId: data.contactId || null,
        clientId: data.clientId || null,
        source: data.source,
        status: data.status ?? 'New',
        estimatedValue: data.estimatedValue ?? 0,
        probability: data.probability ?? 0,
        expectedCloseDate: parseDate(data.expectedCloseDate),
        nextFollowUp: parseDate(data.nextFollowUp),
        assignedTo: data.assignedTo,
        notes: data.notes,
      },
      include: { contact: { select: { name: true } }, client: { select: { clientName: true } } },
    });
    return { ...lead, weightedValue: Math.round((lead.estimatedValue * lead.probability) / 100) };
  },

  async update(id: string, data: any) {
    await leadService.getById(id);
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...data,
        contactId: data.contactId || undefined,
        clientId: data.clientId || undefined,
        expectedCloseDate: parseDate(data.expectedCloseDate),
        nextFollowUp: parseDate(data.nextFollowUp),
      },
      include: { contact: { select: { name: true } }, client: { select: { clientName: true } } },
    });
    return { ...lead, weightedValue: Math.round((lead.estimatedValue * lead.probability) / 100) };
  },

  async delete(id: string) {
    await leadService.getById(id);
    return prisma.lead.delete({ where: { id } });
  },
};
