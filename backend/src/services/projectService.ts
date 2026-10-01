// src/services/projectService.ts
import prisma from '../config/prisma';
import { generateProjectCode } from '../utils/codeGenerator';
import { AppError } from '../middleware/errorHandler';

export const projectService = {
  async list({ page, limit, search, status, clientId }: any) {
    const where: any = {};
    if (search) {
      where.OR = [
        { projectName: { contains: search, mode: 'insensitive' } },
        { projectCode: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { clientName: true, company: true } },
          milestones: { orderBy: { dueDate: 'asc' } },
          _count: { select: { tasks: true } },
        },
      }),
    ]);

    const projectsWithOutstanding = await Promise.all(
      projects.map(async (p) => {
        const invoiceAgg = await prisma.invoice.aggregate({
          where: { projectId: p.id },
          _sum: { totalAmount: true, amountPaid: true },
        });
        const outstanding = (invoiceAgg._sum.totalAmount ?? 0) - (invoiceAgg._sum.amountPaid ?? 0);
        return { ...p, outstanding };
      })
    );

    return { data: projectsWithOutstanding, total };
  },

  async getById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { clientName: true, company: true } },
        tasks: { orderBy: { dueDate: 'asc' } },
        milestones: { orderBy: { dueDate: 'asc' } },
        finance: { orderBy: { date: 'desc' } },
        invoices: { orderBy: { createdAt: 'desc' } },
        expenses: { orderBy: { date: 'desc' } },
      },
    });
    if (!project) throw new AppError('Project not found', 404);

    const invoiceAgg = await prisma.invoice.aggregate({
      where: { projectId: id },
      _sum: { totalAmount: true, amountPaid: true },
    });
    const outstanding = (invoiceAgg._sum.totalAmount ?? 0) - (invoiceAgg._sum.amountPaid ?? 0);

    return { ...project, outstanding };
  },

  async create(data: any) {
    const projectCode = await generateProjectCode();
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    const client = await prisma.client.findUnique({ where: { id: data.clientId } });
    if (!client) throw new AppError('Client not found', 404);

    return prisma.project.create({
      data: {
        projectCode,
        projectName: data.projectName,
        clientId: data.clientId,
        serviceType: data.serviceType ?? 'Web_App',
        status: data.status ?? 'Open_Work',
        priority: data.priority ?? 'Medium',
        startDate: parseDate(data.startDate),
        deadline: parseDate(data.deadline),
        progress: data.progress ?? 0,
        currentPhase: data.currentPhase,
        nextMilestone: data.nextMilestone,
        clientDependency: data.clientDependency ?? 'None',
        paymentStatus: data.paymentStatus ?? 'Draft',
        projectValue: data.projectValue ?? 0,
        repositoryUrl: data.repositoryUrl || null,
        deploymentUrl: data.deploymentUrl || null,
        projectFolder: data.projectFolder,
        assignedTeam: data.assignedTeam ?? [],
        notes: data.notes,
      },
      include: {
        client: { select: { clientName: true, company: true } },
        milestones: true,
      },
    });
  },

  async update(id: string, data: any) {
    await projectService.getById(id);
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    return prisma.project.update({
      where: { id },
      data: {
        ...data,
        repositoryUrl: data.repositoryUrl || undefined,
        deploymentUrl: data.deploymentUrl || undefined,
        startDate: parseDate(data.startDate),
        deadline: parseDate(data.deadline),
      },
      include: {
        client: { select: { clientName: true, company: true } },
        milestones: { orderBy: { dueDate: 'asc' } },
      },
    });
  },

  async delete(id: string) {
    await projectService.getById(id);
    return prisma.project.delete({ where: { id } });
  },
};
