// src/services/searchService.ts
import prisma from '../config/prisma';

export const searchService = {
  async searchAll(query: string) {
    if (!query || query.trim().length < 2) return {};
    const q = query.trim();

    const [clients, contacts, leads, projects, tasks, invoices, assets] = await Promise.all([
      prisma.client.findMany({
        where: {
          OR: [
            { clientName: { contains: q, mode: 'insensitive' } },
            { company: { contains: q, mode: 'insensitive' } },
            { clientCode: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: { id: true, clientCode: true, clientName: true, company: true, clientStatus: true },
      }),
      prisma.contact.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { contactCode: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
        include: { client: { select: { clientName: true } } },
      }),
      prisma.lead.findMany({
        where: {
          OR: [
            { leadName: { contains: q, mode: 'insensitive' } },
            { company: { contains: q, mode: 'insensitive' } },
            { leadCode: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: { id: true, leadCode: true, leadName: true, company: true, status: true, estimatedValue: true },
      }),
      prisma.project.findMany({
        where: {
          OR: [
            { projectName: { contains: q, mode: 'insensitive' } },
            { projectCode: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
        include: { client: { select: { clientName: true } } },
      }),
      prisma.task.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { taskCode: { contains: q, mode: 'insensitive' } },
            { assignedTo: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
        include: { project: { select: { projectName: true } } },
      }),
      prisma.invoice.findMany({
        where: {
          OR: [{ invoiceNumber: { contains: q, mode: 'insensitive' } }],
        },
        take: 5,
        include: { client: { select: { clientName: true } } },
      }),
      prisma.assetRecord.findMany({
        where: {
          OR: [
            { assetName: { contains: q, mode: 'insensitive' } },
            { provider: { contains: q, mode: 'insensitive' } },
            { assetCode: { contains: q, mode: 'insensitive' } },
            { domainOrAccountName: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
        include: { client: { select: { clientName: true } } },
      }),
    ]);

    return {
      CLIENTS: clients.map((c) => ({
        id: c.id,
        title: `${c.clientCode} • ${c.clientName}`,
        subtitle: `${c.company} • ${c.clientStatus}`,
        category: 'CLIENTS',
        targetTab: 'crm-clients',
        targetId: c.id,
        badgeText: c.clientStatus,
      })),
      CONTACTS: contacts.map((c) => ({
        id: c.id,
        title: `${c.contactCode} • ${c.name}`,
        subtitle: `${c.client.clientName} • ${c.role ?? ''}`,
        category: 'CONTACTS',
        targetTab: 'crm-contacts',
        targetId: c.id,
        badgeText: c.role,
      })),
      LEADS: leads.map((l) => ({
        id: l.id,
        title: `${l.leadCode} • ${l.leadName}`,
        subtitle: `${l.company ?? ''} • ${l.status}`,
        category: 'LEADS',
        targetTab: 'crm-leads',
        targetId: l.id,
        badgeText: l.status,
      })),
      PROJECTS: projects.map((p) => ({
        id: p.id,
        title: `${p.projectCode} • ${p.projectName}`,
        subtitle: `${p.client.clientName} • ${p.status}`,
        category: 'PROJECTS',
        targetTab: 'projects',
        targetId: p.id,
        badgeText: p.status,
      })),
      TASKS: tasks.map((t) => ({
        id: t.id,
        title: `${t.taskCode} • ${t.title}`,
        subtitle: `${t.project?.projectName ?? 'No project'} • ${t.assignedTo ?? ''}`,
        category: 'TASKS',
        targetTab: 'tasks',
        targetId: t.id,
        badgeText: t.status,
      })),
      INVOICES: invoices.map((inv) => ({
        id: inv.id,
        title: `${inv.invoiceNumber}`,
        subtitle: `${inv.client.clientName} • ${inv.status}`,
        category: 'INVOICES',
        targetTab: 'finance',
        targetId: inv.id,
        badgeText: inv.status,
      })),
      ASSETS: assets.map((a) => ({
        id: a.id,
        title: `${a.assetCode} • ${a.assetName}`,
        subtitle: `${a.assetType} • ${a.provider ?? ''} • ${a.client?.clientName ?? 'Internal'}`,
        category: 'ASSETS',
        targetTab: 'assets',
        targetId: a.id,
        badgeText: a.status,
      })),
    };
  },
};
