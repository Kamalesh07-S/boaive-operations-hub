// Boaive Operations Hub - AI Operations Assistant Service

import { AssistantMessage, AssistantActionCard } from '../types';

export const suggestedPrompts = [
  'What needs my attention today?',
  'Which clients have pending payments?',
  'Show projects nearing their deadlines.',
  'How much revenue did we make this month?',
  'Which leads need follow-up?',
  "Summarize this week's activity.",
];

export const initialAssistantMessages: AssistantMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: `Hello! I am your **Boaive Operations Assistant**. I monitor real-time client pipelines, active project milestones, cash flow health, and infrastructure renewals.\n\nHow can I assist your operational decisions today?`,
    timestamp: new Date(),
    suggestedPrompts: [
      'What needs my attention today?',
      'Which clients have pending payments?',
      'Show projects nearing their deadlines.',
      'Which leads need follow-up?',
    ],
  },
];

export const assistantService = {
  async processQuery(query: string): Promise<AssistantMessage> {
    // Simulate thinking delay for natural AI feel
    await new Promise((resolve) => setTimeout(resolve, 350));

    const q = query.toLowerCase().trim();

    if (q.includes('attention') || q.includes('urgent') || q.includes('today')) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Here is the prioritized operational status requiring immediate action today:\n\n` +
          `🔴 **2 Overdue Tasks**: Auth token security leak (Nexus Health) & App Store privacy manifests (Apex FinTech).\n` +
          `🔴 **₹25,000 Payment Overdue**: Invoice #INV-2026-024 from Apex FinTech (12 days overdue).\n` +
          `🟠 **3 Client Follow-ups Due**: Solaris Clean Energy, CloudPeak Labs, and Zenith Retail.\n` +
          `🟠 **Project Delivery in 4 Days**: Website Redesign & Telehealth Portal (82% complete).\n` +
          `🟡 **Asset Renewal**: api.boaive.com Wildcard SSL expires in 6 days.\n\n` +
          `Would you like me to dispatch automatic follow-up tasks to the assigned team leads?`,
        timestamp: new Date(),
        actionCard: {
          id: `act-${Date.now()}`,
          type: 'create_tasks',
          title: 'Auto-Generate SLA Escalation Tasks',
          description: 'Creates priority tasks for Aarav Sharma and Priya Iyer to address the 2 overdue security items.',
        },
        suggestedPrompts: ['Which clients have pending payments?', 'Show projects nearing their deadlines.'],
      };
    }

    if (q.includes('payment') || q.includes('pending payment') || q.includes('overdue payment') || q.includes('unpaid')) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Here is the current accounts receivable status:\n\n` +
          `• **Apex FinTech Global**: **₹25,000 OVERDUE** (Invoice #INV-2026-024, due 17 Sep 2026).\n` +
          `• **Solaris Clean Energy**: **₹35,000 PENDING** (Invoice #INV-2026-025, due 05 Oct 2026).\n` +
          `• **Zenith Retail Brands**: **₹18,000 PENDING** (Invoice #INV-2026-026, due 07 Oct 2026).\n\n` +
          `**Total Outstanding**: **₹78,000** | **Total Collected This Month**: **₹1,30,000**\n\n` +
          `Would you like to review the overdue invoice #INV-2026-024?`,
        timestamp: new Date(),
        actionCard: {
          id: `act-${Date.now()}`,
          type: 'view_overdue',
          title: 'Review Invoice INV-2026-024',
          description: 'Open invoice workspace for Apex FinTech Global with one-click payment reminder option.',
          data: { invoiceId: 'inv-024' },
        },
        suggestedPrompts: ['How much revenue did we make this month?', 'What needs my attention today?'],
      };
    }

    if (q.includes('deadline') || q.includes('project') || q.includes('nearing')) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Here are active Boaive client projects sorted by impending deadlines:\n\n` +
          `1. 🚀 **Website Redesign & Telehealth Portal** (Nexus Healthcare)\n` +
          `   • **Deadline**: 04 Oct 2026 (**4 days left**)\n` +
          `   • **Progress**: 82% complete (15/18 tasks done)\n` +
          `   • **Status**: Development & Final QA\n\n` +
          `2. 📱 **Mobile Banking Core App** (Apex FinTech)\n` +
          `   • **Deadline**: 14 Oct 2026 (**14 days left**)\n` +
          `   • **Progress**: 61% complete (15/24 tasks done)\n` +
          `   • **Status**: Testing & Sandbox Simulation\n\n` +
          `3. ⚡ **Solar Grid IoT Monitoring Hub** (Solaris Clean Energy)\n` +
          `   • **Deadline**: 18 Oct 2026 (**18 days left**)\n` +
          `   • **Progress**: 90% complete (In Review)\n\n` +
          `Nexus Healthcare has the highest delivery risk due to the remaining staging compliance audit.`,
        timestamp: new Date(),
        suggestedPrompts: ['What needs my attention today?', 'Which leads need follow-up?'],
      };
    }

    if (q.includes('revenue') || q.includes('financial') || q.includes('margin') || q.includes('money')) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Here is the Boaive Financial Summary for the current operating period:\n\n` +
          `• **Gross Revenue**: **₹4,20,000 (₹4.2L)** (↑ 12.4% vs last month)\n` +
          `• **Total Operating Expenses**: **₹1,60,000 (₹1.6L)**\n` +
          `• **Net Operating Margin**: **₹2,60,000 (61.9% margin)**\n` +
          `• **Accounts Receivable Outstanding**: **₹78,000**\n` +
          `• **Overdue Invoices**: **₹25,000**\n\n` +
          `Top expense category is **Cloud Infrastructure & AI compute** (₹72,200 total).`,
        timestamp: new Date(),
        suggestedPrompts: ['Which clients have pending payments?', 'What needs my attention today?'],
      };
    }

    if (q.includes('lead') || q.includes('pipeline') || q.includes('sales') || q.includes('crm')) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `**Boaive Sales & Lead Pipeline Overview**:\n\n` +
          `• **Total Pipeline Value**: **₹15,40,000 (₹15.4L)**\n` +
          `• **Weighted Expected Value**: **₹9,80,000**\n` +
          `• **Active Leads**: 23 (5 high-intent deals in active negotiation)\n\n` +
          `**Follow-ups due right now**:\n` +
          `1. **Pooja Bhatt** (Zeta Protocol, ₹4.5L) — Follow-up date: **Today**\n` +
          `2. **Deepak Chawla** (FinEdge Advisory, ₹2.1L) — Follow-up date: **01 Oct**\n` +
          `3. **Karan Mehra** (Aether Logistics, ₹2.8L) — Proposal sent, follow-up: **02 Oct**\n\n` +
          `Would you like me to generate calendar reminders for these follow-ups?`,
        timestamp: new Date(),
        actionCard: {
          id: `act-${Date.now()}`,
          type: 'create_tasks',
          title: 'Schedule Lead Follow-up Calls',
          description: 'Generates calendar reminders for Ananya Verma and Aarav Sharma.',
        },
        suggestedPrompts: ['What needs my attention today?', 'Summarize this week\'s activity.'],
      };
    }

    if (q.includes('summar') || q.includes('week') || q.includes('activity') || q.includes('log')) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `**Weekly Operations Summary for Boaive**:\n\n` +
          `• **Deliverables**: 4 milestone deliverables approved (Patient Booking Engine, MQTT Broker, Biometric SDK, Storybook design system).\n` +
          `• **Finance**: ₹85,000 payment collected from Nexus Healthcare; 1 overdue reminder dispatched.\n` +
          `• **CRM**: 1 deal won (HyperGrowth Media, ₹1.6L) and 2 new enterprise inquiries registered.\n` +
          `• **DevOps**: 1 SSL wildcard certificate scheduled for renewal; staging cluster uptime maintained at 99.98%.\n\n` +
          `Overall operational efficiency score is **94/100**.`,
        timestamp: new Date(),
        suggestedPrompts: ['What needs my attention today?', 'Show projects nearing their deadlines.'],
      };
    }

    // Default intelligent assistant response
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `I analyzed Boaive's live operational telemetry regarding **"${query}"**.\n\n` +
        `Current System Status:\n` +
        `• **14 Active Clients** across HealthTech, FinTech, and IoT.\n` +
        `• **9 Active Projects** (1 nearing critical deadline in 4 days).\n` +
        `• **₹4.2L Monthly Revenue** with ₹78k pending invoices.\n` +
        `• **2 Urgent Attention Items** requiring operational escalation.\n\n` +
        `Feel free to click one of the suggested prompts below to inspect specific modules.`,
      timestamp: new Date(),
      suggestedPrompts: [
        'What needs my attention today?',
        'Which clients have pending payments?',
        'Show projects nearing their deadlines.',
        'Which leads need follow-up?',
      ],
    };
  },
};
