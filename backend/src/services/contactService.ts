// src/services/contactService.ts
import prisma from '../config/prisma';
import { generateContactCode } from '../utils/codeGenerator';
import { AppError } from '../middleware/errorHandler';

export const contactService = {
  async list({ page, limit, search, clientId }: any) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { contactCode: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (clientId) where.clientId = clientId;

    const [total, contacts] = await Promise.all([
      prisma.contact.count({ where }),
      prisma.contact.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { client: { select: { clientName: true, company: true } } },
      }),
    ]);
    return { data: contacts, total };
  },

  async getById(id: string) {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: { client: true, leads: { orderBy: { createdAt: 'desc' } } },
    });
    if (!contact) throw new AppError('Contact not found', 404);
    return contact;
  },

  async create(data: any) {
    const contactCode = await generateContactCode();
    // Verify client exists
    const client = await prisma.client.findUnique({ where: { id: data.clientId } });
    if (!client) throw new AppError('Client not found', 404);

    return prisma.contact.create({
      data: {
        contactCode,
        clientId: data.clientId,
        name: data.name,
        role: data.role,
        email: data.email || null,
        phone: data.phone,
        preferredContactMethod: data.preferredContactMethod ?? 'Email',
        notes: data.notes,
      },
      include: { client: { select: { clientName: true, company: true } } },
    });
  },

  async update(id: string, data: any) {
    await contactService.getById(id);
    return prisma.contact.update({
      where: { id },
      data: { ...data, email: data.email || undefined },
      include: { client: { select: { clientName: true, company: true } } },
    });
  },

  async delete(id: string) {
    await contactService.getById(id);
    return prisma.contact.delete({ where: { id } });
  },
};
