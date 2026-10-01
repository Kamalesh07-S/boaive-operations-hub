// src/services/dashboardService.ts
import prisma from '../config/prisma';

export const dashboardService = {
  async getDashboard() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [
      activeClients,
      openLeads,
      activeProjects,
      pendingTasks,
      revenueAgg,
      expensesAgg,
      outstandingAgg,
      overdueTasks,
      overduePayments,
      upcomingDeadlines,
      upcomingRenewals,
      recentClients,
      recentProjects,
      recentTasks,
      leads,
    ] = await Promise.all([
      // KPIs
      prisma.client.count({ where: { clientStatus: 'Active' } }),
      prisma.lead.count({
        where: { status: { notIn: ['Won', 'Lost'] } },
      }),
      prisma.project.count({
        where: { status: { in: ['Open_Work', 'In_Progress', 'Awaiting_Client', 'Testing'] } },
      }),
      prisma.task.count({
        where: { status: { in: ['Todo', 'In_Progress'] } },
      }),
      prisma.financeRecord.aggregate({
        where: { type: 'Income', paymentStatus: 'Paid', date: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.expenseRecord.aggregate({
        where: { date: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { status: { in: ['Sent', 'Partially_Paid', 'Overdue'] } },
        _sum: { totalAmount: true, amountPaid: true },
      }),

      // Attention items
      prisma.task.findMany({
        where: { dueDate: { lt: now }, status: { notIn: ['Completed', 'Overdue'] } },
        include: { project: { select: { projectName: true } } },
        orderBy: { dueDate: 'asc' },
        take: 10,
      }),
      prisma.invoice.findMany({
        where: { dueDate: { lt: now }, status: { in: ['Sent', 'Partially_Paid', 'Overdue'] } },
        include: { client: { select: { clientName: true } } },
        orderBy: { dueDate: 'asc' },
        take: 10,
      }),
      prisma.project.findMany({
        where: {
          deadline: { gte: now, lte: in14Days },
          status: { notIn: ['Completed', 'Cancelled'] },
        },
        include: { client: { select: { clientName: true } } },
        orderBy: { deadline: 'asc' },
        take: 10,
      }),
      prisma.assetRecord.findMany({
        where: {
          renewalDate: { gte: now, lte: in30Days },
          status: 'Active',
        },
        include: { client: { select: { clientName: true } } },
        orderBy: { renewalDate: 'asc' },
        take: 10,
      }),

      // Recent activity
      prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { clientCode: true, clientName: true, company: true, createdAt: true },
      }),
      prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { projectCode: true, projectName: true, status: true, createdAt: true },
      }),
      prisma.task.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { taskCode: true, title: true, status: true, createdAt: true },
      }),

      // Pipeline
      prisma.lead.findMany({
        where: { status: { notIn: ['Won', 'Lost'] } },
        select: { estimatedValue: true, probability: true },
      }),
    ]);

    const weightedPipelineValue = leads.reduce(
      (sum, l) => sum + Math.round((l.estimatedValue * l.probability) / 100),
      0
    );

    const outstandingPayments =
      (outstandingAgg._sum.totalAmount ?? 0) - (outstandingAgg._sum.amountPaid ?? 0);

    const recentActivity = [
      ...recentClients.map((c) => ({
        type: 'CLIENT',
        code: c.clientCode,
        title: c.clientName,
        subtitle: c.company,
        timestamp: c.createdAt,
      })),
      ...recentProjects.map((p) => ({
        type: 'PROJECT',
        code: p.projectCode,
        title: p.projectName,
        subtitle: p.status,
        timestamp: p.createdAt,
      })),
      ...recentTasks.map((t) => ({
        type: 'TASK',
        code: t.taskCode,
        title: t.title,
        subtitle: t.status,
        timestamp: t.createdAt,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    return {
      kpis: {
        activeClients,
        openLeads,
        weightedPipelineValue,
        activeProjects,
        revenue: revenueAgg._sum.amount ?? 0,
        expenses: expensesAgg._sum.amount ?? 0,
        outstandingPayments,
        pendingTasks,
      },
      attention: {
        overdueTasks: overdueTasks.map((t) => ({
          id: t.id,
          taskCode: t.taskCode,
          title: t.title,
          dueDate: t.dueDate,
          project: t.project?.projectName,
        })),
        overduePayments: overduePayments.map((inv) => ({
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          client: inv.client.clientName,
          dueDate: inv.dueDate,
          balance: inv.totalAmount - inv.amountPaid,
        })),
        upcomingDeadlines: upcomingDeadlines.map((p) => ({
          id: p.id,
          projectCode: p.projectCode,
          projectName: p.projectName,
          deadline: p.deadline,
          client: p.client.clientName,
        })),
        upcomingRenewals: upcomingRenewals.map((a) => ({
          id: a.id,
          assetCode: a.assetCode,
          assetName: a.assetName,
          renewalDate: a.renewalDate,
          client: a.client?.clientName,
        })),
      },
      recentActivity,
    };
  },
};
