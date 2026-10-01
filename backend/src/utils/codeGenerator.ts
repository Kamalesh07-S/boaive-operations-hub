// src/utils/codeGenerator.ts - Sequential code generators matching frontend format
import prisma from '../config/prisma';

async function getNextCode(
  model: string,
  prefix: string,
  field: string
): Promise<string> {
  // Find the highest existing code
  const records = await (prisma as any)[model].findMany({
    select: { [field]: true },
    orderBy: { [field]: 'desc' },
    take: 1,
  });

  if (records.length === 0) {
    return `${prefix}-001`;
  }

  const lastCode: string = records[0][field];
  const match = lastCode.match(/(\d+)$/);
  if (!match) return `${prefix}-001`;

  const nextNum = parseInt(match[1], 10) + 1;
  return `${prefix}-${String(nextNum).padStart(3, '0')}`;
}

export const generateClientCode = () => getNextCode('client', 'CLI', 'clientCode');
export const generateContactCode = () => getNextCode('contact', 'CON', 'contactCode');
export const generateLeadCode = () => getNextCode('lead', 'LED', 'leadCode');
export const generateProjectCode = () => getNextCode('project', 'PRJ', 'projectCode');
export const generateTaskCode = () => getNextCode('task', 'TSK', 'taskCode');
export const generateFinanceCode = () => getNextCode('financeRecord', 'FIN', 'transactionCode');
export const generateInvoiceCode = () => getNextCode('invoice', 'INV', 'invoiceNumber');
export const generateExpenseCode = () => getNextCode('expenseRecord', 'EXP', 'expenseCode');
export const generateAssetCode = () => getNextCode('assetRecord', 'AST', 'assetCode');
export const generateContentCode = () => getNextCode('contentRecord', 'CNT', 'contentCode');
