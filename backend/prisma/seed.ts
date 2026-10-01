// prisma/seed.ts - Realistic development seed data for Boaive Operations Hub
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Boaive seed...');

  // ─── Clean existing data (order matters for FK constraints) ──────────────
  await prisma.milestone.deleteMany();
  await prisma.contentRecord.deleteMany();
  await prisma.assetRecord.deleteMany();
  await prisma.expenseRecord.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.financeRecord.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  // ─── Users ────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Admin@123', 12);

  const superAdmin = await prisma.user.create({
    data: {
      name: 'Boaive Admin',
      email: 'admin@boaive.com',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });

  await prisma.user.createMany({
    data: [
      { name: 'Aarav Sharma', email: 'aarav@boaive.com', passwordHash, role: 'ADMIN' },
      { name: 'Priya Iyer', email: 'priya@boaive.com', passwordHash, role: 'MEMBER' },
      { name: 'Rohan Mehta', email: 'rohan@boaive.com', passwordHash, role: 'MEMBER' },
      { name: 'Ananya Verma', email: 'ananya@boaive.com', passwordHash, role: 'MEMBER' },
    ],
  });

  console.log('✅ Users created');

  // ─── Settings ────────────────────────────────────────────────────────────
  await prisma.setting.createMany({
    data: [
      { key: 'businessName', value: 'Boaive Technologies Private Limited', group: 'general' },
      { key: 'currency', value: 'INR (₹)', group: 'general' },
      { key: 'dueSoonWindow', value: '7', group: 'general' },
      { key: 'followUpWindow', value: '3', group: 'general' },
      { key: 'upcomingWindow', value: '14', group: 'general' },
      { key: 'renewalWarning', value: '30', group: 'general' },
      // Dropdown options stored as JSON strings
      { key: 'clientStatuses', value: JSON.stringify(['Open', 'Active', 'Hold', 'Completed', 'Declined', 'Inactive']), group: 'dropdowns' },
      { key: 'clientTypes', value: JSON.stringify(['Enterprise', 'Retainer', 'Project_based', 'Advisory']), group: 'dropdowns' },
      { key: 'leadStatuses', value: JSON.stringify(['New', 'Contacted', 'Discovery', 'Proposal_Sent', 'Negotiation', 'Won', 'Lost', 'On_Hold']), group: 'dropdowns' },
      { key: 'sources', value: JSON.stringify(['Referral', 'LinkedIn', 'Inbound Web', 'Cold Outreach', 'Conference', 'Partner']), group: 'dropdowns' },
      { key: 'serviceTypes', value: JSON.stringify(['Web_App', 'AI_ML_Engineering', 'Mobile_App', 'Cloud_Infrastructure', 'UI_UX_Design', 'Retainer']), group: 'dropdowns' },
      { key: 'teamMembers', value: JSON.stringify(['Aarav Sharma', 'Priya Iyer', 'Rohan Mehta', 'Ananya Verma']), group: 'dropdowns' },
    ],
  });

  console.log('✅ Settings seeded');

  // ─── Clients ─────────────────────────────────────────────────────────────
  const client1 = await prisma.client.create({
    data: {
      clientCode: 'CLI-001',
      clientName: 'Arjun Kapoor',
      company: 'NexaCore Technologies',
      contactPerson: 'Arjun Kapoor',
      email: 'arjun@nexacore.in',
      phone: '+91 98400 11234',
      location: 'Mumbai, India',
      website: 'https://nexacore.in',
      source: 'LinkedIn',
      clientStatus: 'Active',
      clientType: 'Enterprise',
      firstContactDate: new Date('2025-01-15'),
      onboardingDate: new Date('2025-02-01'),
      lastContactDate: new Date('2026-09-20'),
      nextFollowUp: new Date('2026-10-15'),
      notes: 'Key enterprise account. Decision maker is Arjun.',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      clientCode: 'CLI-002',
      clientName: 'Meera Nair',
      company: 'Veda Analytics',
      contactPerson: 'Meera Nair',
      email: 'meera@vedaanalytics.com',
      phone: '+91 97321 55678',
      location: 'Bangalore, India',
      website: 'https://vedaanalytics.com',
      source: 'Referral',
      clientStatus: 'Active',
      clientType: 'Retainer',
      firstContactDate: new Date('2025-03-10'),
      onboardingDate: new Date('2025-03-25'),
      lastContactDate: new Date('2026-09-25'),
      nextFollowUp: new Date('2026-10-05'),
      notes: 'On monthly retainer for AI/ML consulting.',
    },
  });

  const client3 = await prisma.client.create({
    data: {
      clientCode: 'CLI-003',
      clientName: 'Rahul Bose',
      company: 'SwiftCart Commerce',
      contactPerson: 'Rahul Bose',
      email: 'rahul@swiftcart.io',
      phone: '+91 99001 23456',
      location: 'Hyderabad, India',
      website: 'https://swiftcart.io',
      source: 'Inbound Web',
      clientStatus: 'Active',
      clientType: 'Project_based',
      firstContactDate: new Date('2025-06-01'),
      onboardingDate: new Date('2025-06-15'),
      lastContactDate: new Date('2026-09-18'),
      nextFollowUp: new Date('2026-10-10'),
      notes: 'E-commerce platform build.',
    },
  });

  const client4 = await prisma.client.create({
    data: {
      clientCode: 'CLI-004',
      clientName: 'Kavita Singh',
      company: 'FinEdge Capital',
      contactPerson: 'Kavita Singh',
      email: 'kavita@finedge.in',
      phone: '+91 98200 44556',
      location: 'Delhi, India',
      source: 'Conference',
      clientStatus: 'Hold',
      clientType: 'Advisory',
      firstContactDate: new Date('2025-09-01'),
      lastContactDate: new Date('2026-08-30'),
      nextFollowUp: new Date('2026-10-20'),
      notes: 'Project on hold pending regulatory approval.',
    },
  });

  const client5 = await prisma.client.create({
    data: {
      clientCode: 'CLI-005',
      clientName: 'Suresh Reddy',
      company: 'AgroTech Solutions',
      contactPerson: 'Suresh Reddy',
      email: 'suresh@agrotech.in',
      phone: '+91 96543 21098',
      location: 'Chennai, India',
      source: 'Partner',
      clientStatus: 'Completed',
      clientType: 'Project_based',
      firstContactDate: new Date('2024-11-01'),
      onboardingDate: new Date('2024-11-15'),
      lastContactDate: new Date('2026-06-30'),
      notes: 'Project completed. Potential for future work.',
    },
  });

  console.log('✅ Clients seeded');

  // ─── Contacts ─────────────────────────────────────────────────────────────
  const contact1 = await prisma.contact.create({
    data: {
      contactCode: 'CON-001',
      clientId: client1.id,
      name: 'Arjun Kapoor',
      role: 'CEO',
      email: 'arjun@nexacore.in',
      phone: '+91 98400 11234',
      preferredContactMethod: 'Email',
      notes: 'Primary decision maker.',
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      contactCode: 'CON-002',
      clientId: client1.id,
      name: 'Sneha Patel',
      role: 'CTO',
      email: 'sneha@nexacore.in',
      phone: '+91 98400 55678',
      preferredContactMethod: 'Slack',
      notes: 'Technical contact.',
    },
  });

  await prisma.contact.create({
    data: {
      contactCode: 'CON-003',
      clientId: client2.id,
      name: 'Meera Nair',
      role: 'Head of Data',
      email: 'meera@vedaanalytics.com',
      phone: '+91 97321 55678',
      preferredContactMethod: 'Email',
    },
  });

  await prisma.contact.create({
    data: {
      contactCode: 'CON-004',
      clientId: client3.id,
      name: 'Rahul Bose',
      role: 'Founder',
      email: 'rahul@swiftcart.io',
      phone: '+91 99001 23456',
      preferredContactMethod: 'WhatsApp',
    },
  });

  await prisma.contact.create({
    data: {
      contactCode: 'CON-005',
      clientId: client4.id,
      name: 'Kavita Singh',
      role: 'Managing Partner',
      email: 'kavita@finedge.in',
      preferredContactMethod: 'Phone',
    },
  });

  console.log('✅ Contacts seeded');

  // ─── Leads ───────────────────────────────────────────────────────────────
  await prisma.lead.createMany({
    data: [
      {
        leadCode: 'LED-001',
        leadName: 'Vikram Luthra',
        company: 'CloudNine Retail',
        contactId: null,
        source: 'LinkedIn',
        status: 'Proposal_Sent',
        estimatedValue: 1500000,
        probability: 60,
        expectedCloseDate: new Date('2026-11-30'),
        nextFollowUp: new Date('2026-10-08'),
        assignedTo: 'Aarav Sharma',
        notes: 'Proposal sent for e-commerce platform.',
      },
      {
        leadCode: 'LED-002',
        leadName: 'Nisha Agarwal',
        company: 'MediLink Health',
        source: 'Referral',
        status: 'Discovery',
        estimatedValue: 2200000,
        probability: 35,
        expectedCloseDate: new Date('2026-12-15'),
        nextFollowUp: new Date('2026-10-12'),
        assignedTo: 'Priya Iyer',
        notes: 'Healthcare portal with patient management.',
      },
      {
        leadCode: 'LED-003',
        leadName: 'Deepak Chawla',
        company: 'EduPulse Academy',
        source: 'Conference',
        status: 'Negotiation',
        estimatedValue: 800000,
        probability: 75,
        expectedCloseDate: new Date('2026-10-31'),
        nextFollowUp: new Date('2026-10-05'),
        assignedTo: 'Aarav Sharma',
        notes: 'Learning management system.',
      },
      {
        leadCode: 'LED-004',
        leadName: 'Tanvi Desai',
        company: 'PropSmart Realty',
        source: 'Cold Outreach',
        status: 'New',
        estimatedValue: 500000,
        probability: 20,
        expectedCloseDate: new Date('2026-12-31'),
        nextFollowUp: new Date('2026-10-15'),
        assignedTo: 'Rohan Mehta',
      },
      {
        leadCode: 'LED-005',
        leadName: 'Sanjay Malhotra',
        company: 'TechVenture Labs',
        source: 'LinkedIn',
        status: 'Won',
        estimatedValue: 3000000,
        probability: 100,
        expectedCloseDate: new Date('2026-09-01'),
        assignedTo: 'Aarav Sharma',
        notes: 'Converted to client CLI-001.',
        clientId: client1.id,
      },
      {
        leadCode: 'LED-006',
        leadName: 'Pooja Sharma',
        company: 'QuickBite Foods',
        source: 'Inbound Web',
        status: 'Lost',
        estimatedValue: 600000,
        probability: 0,
        expectedCloseDate: new Date('2026-08-15'),
        assignedTo: 'Ananya Verma',
        notes: 'Lost to competitor.',
      },
    ],
  });

  console.log('✅ Leads seeded');

  // ─── Projects ─────────────────────────────────────────────────────────────
  const project1 = await prisma.project.create({
    data: {
      projectCode: 'PRJ-001',
      projectName: 'NexaCore Enterprise Portal',
      clientId: client1.id,
      serviceType: 'Web_App',
      status: 'In_Progress',
      priority: 'High',
      startDate: new Date('2025-02-15'),
      deadline: new Date('2026-11-30'),
      progress: 65,
      currentPhase: 'Development',
      nextMilestone: 'Beta Release',
      clientDependency: 'Feedback_Required',
      paymentStatus: 'Partially_Paid',
      projectValue: 2500000,
      repositoryUrl: 'https://github.com/boaive/nexacore-portal',
      assignedTeam: ['Aarav Sharma', 'Priya Iyer', 'Rohan Mehta'],
      notes: 'Enterprise portal with SSO and role management.',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      projectCode: 'PRJ-002',
      projectName: 'Veda Analytics Dashboard',
      clientId: client2.id,
      serviceType: 'AI_ML_Engineering',
      status: 'Awaiting_Client',
      priority: 'Medium',
      startDate: new Date('2025-04-01'),
      deadline: new Date('2026-10-15'),
      progress: 80,
      currentPhase: 'Testing',
      nextMilestone: 'Client UAT',
      clientDependency: 'Assets_Pending',
      paymentStatus: 'Partially_Paid',
      projectValue: 1800000,
      repositoryUrl: 'https://github.com/boaive/veda-dashboard',
      deploymentUrl: 'https://staging.vedaanalytics.com',
      assignedTeam: ['Priya Iyer', 'Ananya Verma'],
      notes: 'ML-powered analytics dashboard.',
    },
  });

  const project3 = await prisma.project.create({
    data: {
      projectCode: 'PRJ-003',
      projectName: 'SwiftCart Mobile App',
      clientId: client3.id,
      serviceType: 'Mobile_App',
      status: 'Open_Work',
      priority: 'Urgent',
      startDate: new Date('2026-07-01'),
      deadline: new Date('2026-12-31'),
      progress: 20,
      currentPhase: 'Design',
      nextMilestone: 'Wireframe Approval',
      clientDependency: 'None',
      paymentStatus: 'Sent',
      projectValue: 1200000,
      assignedTeam: ['Rohan Mehta', 'Ananya Verma'],
      notes: 'iOS and Android e-commerce app.',
    },
  });

  const project4 = await prisma.project.create({
    data: {
      projectCode: 'PRJ-004',
      projectName: 'AgroTech IoT Platform',
      clientId: client5.id,
      serviceType: 'Cloud_Infrastructure',
      status: 'Completed',
      priority: 'Medium',
      startDate: new Date('2024-11-20'),
      deadline: new Date('2026-06-30'),
      progress: 100,
      currentPhase: 'Closed',
      nextMilestone: 'None',
      clientDependency: 'None',
      paymentStatus: 'Paid',
      projectValue: 900000,
      deploymentUrl: 'https://platform.agrotech.in',
      assignedTeam: ['Aarav Sharma'],
      notes: 'IoT sensor data platform on AWS.',
    },
  });

  // Milestones
  await prisma.milestone.createMany({
    data: [
      { projectId: project1.id, title: 'Requirements Finalized', dueDate: new Date('2025-02-28'), completed: true },
      { projectId: project1.id, title: 'UI/UX Design Approved', dueDate: new Date('2025-04-15'), completed: true },
      { projectId: project1.id, title: 'Alpha Release', dueDate: new Date('2026-08-30'), completed: true },
      { projectId: project1.id, title: 'Beta Release', dueDate: new Date('2026-10-31'), completed: false },
      { projectId: project1.id, title: 'Go Live', dueDate: new Date('2026-11-30'), completed: false },
      { projectId: project2.id, title: 'Data Pipeline Setup', dueDate: new Date('2025-05-30'), completed: true },
      { projectId: project2.id, title: 'Model Training Complete', dueDate: new Date('2026-08-15'), completed: true },
      { projectId: project2.id, title: 'Client UAT', dueDate: new Date('2026-10-15'), completed: false },
    ],
  });

  console.log('✅ Projects and milestones seeded');

  // ─── Tasks ────────────────────────────────────────────────────────────────
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await prisma.task.createMany({
    data: [
      {
        taskCode: 'TSK-001',
        title: 'Implement SSO with Azure AD',
        projectId: project1.id,
        clientId: client1.id,
        category: 'Development',
        priority: 'High',
        status: 'In_Progress',
        dueDate: nextWeek,
        assignedTo: 'Aarav Sharma',
        notes: 'Using MSAL library.',
      },
      {
        taskCode: 'TSK-002',
        title: 'Fix mobile responsiveness on dashboard',
        projectId: project1.id,
        clientId: client1.id,
        category: 'Design',
        priority: 'Medium',
        status: 'Todo',
        dueDate: nextWeek,
        assignedTo: 'Priya Iyer',
      },
      {
        taskCode: 'TSK-003',
        title: 'Setup CI/CD pipeline on GitHub Actions',
        projectId: project1.id,
        clientId: client1.id,
        category: 'DevOps',
        priority: 'High',
        status: 'Completed',
        dueDate: new Date('2026-09-15'),
        assignedTo: 'Rohan Mehta',
      },
      {
        taskCode: 'TSK-004',
        title: 'ML model accuracy validation',
        projectId: project2.id,
        clientId: client2.id,
        category: 'QA_Testing',
        priority: 'Urgent',
        status: 'In_Progress',
        dueDate: yesterday, // Overdue
        assignedTo: 'Priya Iyer',
        notes: 'Target accuracy: 92%+',
      },
      {
        taskCode: 'TSK-005',
        title: 'Prepare client UAT test cases',
        projectId: project2.id,
        clientId: client2.id,
        category: 'QA_Testing',
        priority: 'High',
        status: 'Todo',
        dueDate: nextWeek,
        assignedTo: 'Ananya Verma',
      },
      {
        taskCode: 'TSK-006',
        title: 'SwiftCart wireframe design',
        projectId: project3.id,
        clientId: client3.id,
        category: 'Design',
        priority: 'Urgent',
        status: 'In_Progress',
        dueDate: nextWeek,
        assignedTo: 'Ananya Verma',
      },
      {
        taskCode: 'TSK-007',
        title: 'API documentation update',
        projectId: project1.id,
        clientId: client1.id,
        category: 'Development',
        priority: 'Low',
        status: 'Todo',
        dueDate: nextMonth,
        assignedTo: 'Aarav Sharma',
      },
      {
        taskCode: 'TSK-008',
        title: 'Security audit - penetration testing',
        projectId: project1.id,
        clientId: client1.id,
        category: 'Security',
        priority: 'High',
        status: 'Todo',
        dueDate: yesterday, // Overdue
        assignedTo: 'Rohan Mehta',
        notes: 'External security audit required before go-live.',
      },
      {
        taskCode: 'TSK-009',
        title: 'Send monthly retainer invoice to Veda Analytics',
        clientId: client2.id,
        category: 'Client_Ops',
        priority: 'High',
        status: 'Todo',
        dueDate: nextWeek,
        assignedTo: 'Ananya Verma',
      },
      {
        taskCode: 'TSK-010',
        title: 'Bugfix: cart total calculation error',
        projectId: project3.id,
        clientId: client3.id,
        category: 'Bugfix',
        priority: 'Urgent',
        status: 'In_Progress',
        dueDate: nextWeek,
        assignedTo: 'Rohan Mehta',
      },
    ],
  });

  console.log('✅ Tasks seeded');

  // ─── Finance Records ─────────────────────────────────────────────────────
  await prisma.financeRecord.createMany({
    data: [
      {
        transactionCode: 'FIN-001',
        date: new Date('2025-03-01'),
        type: 'Income',
        clientId: client1.id,
        projectId: project1.id,
        description: 'NexaCore - Project Kickoff Payment (30%)',
        amount: 750000,
        paymentStatus: 'Paid',
        paidDate: new Date('2025-03-05'),
        paymentMethod: 'NEFT',
      },
      {
        transactionCode: 'FIN-002',
        date: new Date('2026-06-01'),
        type: 'Income',
        clientId: client1.id,
        projectId: project1.id,
        description: 'NexaCore - Milestone 2 Payment (40%)',
        amount: 1000000,
        paymentStatus: 'Paid',
        paidDate: new Date('2026-06-08'),
        paymentMethod: 'RTGS',
      },
      {
        transactionCode: 'FIN-003',
        date: new Date('2026-08-01'),
        type: 'Income',
        clientId: client2.id,
        projectId: project2.id,
        description: 'Veda Analytics - Dashboard Development (50%)',
        amount: 900000,
        paymentStatus: 'Paid',
        paidDate: new Date('2026-08-05'),
        paymentMethod: 'NEFT',
      },
      {
        transactionCode: 'FIN-004',
        date: new Date('2026-09-01'),
        type: 'Income',
        clientId: client2.id,
        projectId: project2.id,
        description: 'Veda Analytics - Monthly Retainer September',
        amount: 150000,
        paymentStatus: 'Sent',
        paymentMethod: 'NEFT',
      },
      {
        transactionCode: 'FIN-005',
        date: new Date('2026-09-15'),
        type: 'Income',
        clientId: client3.id,
        projectId: project3.id,
        description: 'SwiftCart - Initial Payment (25%)',
        amount: 300000,
        paymentStatus: 'Paid',
        paidDate: new Date('2026-09-18'),
        paymentMethod: 'UPI',
      },
      {
        transactionCode: 'FIN-006',
        date: new Date('2026-07-15'),
        type: 'Income',
        clientId: client5.id,
        projectId: project4.id,
        description: 'AgroTech - Final Payment',
        amount: 900000,
        paymentStatus: 'Paid',
        paidDate: new Date('2026-07-20'),
        paymentMethod: 'RTGS',
      },
    ],
  });

  console.log('✅ Finance records seeded');

  // ─── Invoices ────────────────────────────────────────────────────────────
  await prisma.invoice.createMany({
    data: [
      {
        invoiceNumber: 'INV-001',
        clientId: client1.id,
        projectId: project1.id,
        issueDate: new Date('2025-03-01'),
        dueDate: new Date('2025-03-15'),
        subtotal: 750000,
        tax: 135000,
        discount: 0,
        totalAmount: 885000,
        amountPaid: 885000,
        status: 'Paid',
        notes: '30% kickoff payment',
      },
      {
        invoiceNumber: 'INV-002',
        clientId: client1.id,
        projectId: project1.id,
        issueDate: new Date('2026-06-01'),
        dueDate: new Date('2026-06-15'),
        subtotal: 1000000,
        tax: 180000,
        discount: 0,
        totalAmount: 1180000,
        amountPaid: 1180000,
        status: 'Paid',
        notes: '40% milestone payment',
      },
      {
        invoiceNumber: 'INV-003',
        clientId: client1.id,
        projectId: project1.id,
        issueDate: new Date('2026-09-01'),
        dueDate: new Date('2026-09-30'),
        subtotal: 750000,
        tax: 135000,
        discount: 0,
        totalAmount: 885000,
        amountPaid: 0,
        status: 'Overdue',
        notes: 'Final 30% payment - OVERDUE',
      },
      {
        invoiceNumber: 'INV-004',
        clientId: client2.id,
        projectId: project2.id,
        issueDate: new Date('2026-08-01'),
        dueDate: new Date('2026-08-15'),
        subtotal: 900000,
        tax: 162000,
        discount: 0,
        totalAmount: 1062000,
        amountPaid: 1062000,
        status: 'Paid',
      },
      {
        invoiceNumber: 'INV-005',
        clientId: client2.id,
        issueDate: new Date('2026-09-01'),
        dueDate: new Date('2026-09-30'),
        subtotal: 150000,
        tax: 27000,
        discount: 0,
        totalAmount: 177000,
        amountPaid: 0,
        status: 'Sent',
        notes: 'Monthly retainer September 2026',
      },
      {
        invoiceNumber: 'INV-006',
        clientId: client3.id,
        projectId: project3.id,
        issueDate: new Date('2026-09-15'),
        dueDate: new Date('2026-09-30'),
        subtotal: 300000,
        tax: 54000,
        discount: 0,
        totalAmount: 354000,
        amountPaid: 354000,
        status: 'Paid',
        notes: 'Initial payment 25%',
      },
    ],
  });

  console.log('✅ Invoices seeded');

  // ─── Expenses ─────────────────────────────────────────────────────────────
  await prisma.expenseRecord.createMany({
    data: [
      {
        expenseCode: 'EXP-001',
        date: new Date('2026-09-01'),
        type: 'Infrastructure',
        category: 'Infrastructure_Cloud',
        description: 'AWS EC2 + S3 + RDS - Monthly',
        vendor: 'Amazon Web Services',
        amount: 45000,
        frequency: 'Monthly',
        monthlyCost: 45000,
        renewalDate: new Date('2026-10-01'),
        nextDue: new Date('2026-10-01'),
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        ownerId: superAdmin.id,
      },
      {
        expenseCode: 'EXP-002',
        date: new Date('2026-08-01'),
        type: 'Tooling',
        category: 'Software_Licenses',
        description: 'GitHub Teams License',
        vendor: 'GitHub',
        amount: 8000,
        frequency: 'Monthly',
        monthlyCost: 8000,
        renewalDate: new Date('2026-10-01'),
        nextDue: new Date('2026-10-01'),
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        ownerId: superAdmin.id,
      },
      {
        expenseCode: 'EXP-003',
        date: new Date('2026-01-01'),
        type: 'Tooling',
        category: 'Software_Licenses',
        description: 'Figma Professional - Annual',
        vendor: 'Figma',
        amount: 25000,
        frequency: 'Annual',
        monthlyCost: 2083,
        renewalDate: new Date('2027-01-01'),
        nextDue: new Date('2027-01-01'),
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        ownerId: superAdmin.id,
      },
      {
        expenseCode: 'EXP-004',
        date: new Date('2026-09-15'),
        type: 'Contractor',
        category: 'Contractor_Agency',
        description: 'UI/UX Design Contractor - September',
        vendor: 'Freelancer Network',
        amount: 60000,
        frequency: 'Monthly',
        monthlyCost: 60000,
        paymentStatus: 'Pending',
        paymentMethod: 'NEFT',
        ownerId: superAdmin.id,
        projectId: project3.id,
      },
      {
        expenseCode: 'EXP-005',
        date: new Date('2026-09-20'),
        type: 'Operational',
        category: 'Operations_Office',
        description: 'Google Workspace Business',
        vendor: 'Google',
        amount: 12000,
        frequency: 'Annual',
        monthlyCost: 1000,
        renewalDate: new Date('2027-09-20'),
        nextDue: new Date('2027-09-20'),
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        ownerId: superAdmin.id,
      },
      {
        expenseCode: 'EXP-006',
        date: new Date('2026-09-01'),
        type: 'Tooling',
        category: 'Software_Licenses',
        description: 'Linear.app - Project Management',
        vendor: 'Linear',
        amount: 3500,
        frequency: 'Monthly',
        monthlyCost: 3500,
        renewalDate: new Date('2026-10-01'),
        nextDue: new Date('2026-10-01'),
        paymentStatus: 'Scheduled',
        paymentMethod: 'Credit Card',
        ownerId: superAdmin.id,
      },
    ],
  });

  console.log('✅ Expenses seeded');

  // ─── Assets ──────────────────────────────────────────────────────────────
  const in25Days = new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000);
  const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  const lastYear = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Already expired

  await prisma.assetRecord.createMany({
    data: [
      {
        assetCode: 'AST-001',
        assetType: 'Domain',
        assetName: 'boaive.com',
        domainOrAccountName: 'boaive.com',
        ownerType: 'Boaive_Internal',
        provider: 'GoDaddy',
        purchaseDate: new Date('2023-01-01'),
        renewalDate: in90Days,
        cost: 1500,
        billingFrequency: 'Annual',
        status: 'Active',
        accountReference: 'Password Manager → Boaive → GoDaddy',
        purpose: 'Primary company domain',
      },
      {
        assetCode: 'AST-002',
        assetType: 'SSL_Certificate',
        assetName: 'boaive.com SSL',
        domainOrAccountName: '*.boaive.com',
        ownerType: 'Boaive_Internal',
        provider: 'Let\'s Encrypt',
        purchaseDate: new Date('2026-07-01'),
        renewalDate: in25Days, // Renew Soon
        cost: 0,
        billingFrequency: 'Annual',
        status: 'Active',
        purpose: 'Wildcard SSL for all Boaive properties',
      },
      {
        assetCode: 'AST-003',
        assetType: 'Domain',
        assetName: 'nexacore.in',
        domainOrAccountName: 'nexacore.in',
        ownerType: 'Client_Owned',
        clientId: client1.id,
        provider: 'Namecheap',
        purchaseDate: new Date('2024-01-15'),
        renewalDate: lastYear, // Expired
        cost: 900,
        billingFrequency: 'Annual',
        status: 'Active',
        accountReference: 'Password Manager → Clients → NexaCore',
        purpose: 'Client primary domain',
      },
      {
        assetCode: 'AST-004',
        assetType: 'Cloud_Infrastructure',
        assetName: 'NexaCore AWS Production',
        domainOrAccountName: 'nexacore-prod',
        ownerType: 'Client_Owned',
        clientId: client1.id,
        projectId: project1.id,
        provider: 'Amazon Web Services',
        purchaseDate: new Date('2025-02-15'),
        cost: 45000,
        billingFrequency: 'Monthly',
        status: 'Active',
        accountReference: 'Password Manager → Clients → NexaCore → AWS',
        purpose: 'Production infrastructure for NexaCore portal',
      },
      {
        assetCode: 'AST-005',
        assetType: 'SaaS_Subscription',
        assetName: 'Vercel Pro - Boaive',
        domainOrAccountName: 'boaive-org',
        ownerType: 'Boaive_Internal',
        provider: 'Vercel',
        purchaseDate: new Date('2025-06-01'),
        renewalDate: new Date('2027-06-01'),
        cost: 20000,
        billingFrequency: 'Annual',
        status: 'Active',
        accountReference: 'Password Manager → Boaive → Vercel',
        purpose: 'Frontend deployment platform',
      },
      {
        assetCode: 'AST-006',
        assetType: 'Database_Instance',
        assetName: 'Veda Analytics PostgreSQL',
        domainOrAccountName: 'veda-pg-prod',
        ownerType: 'Client_Owned',
        clientId: client2.id,
        projectId: project2.id,
        provider: 'Supabase',
        purchaseDate: new Date('2025-04-01'),
        cost: 25000,
        billingFrequency: 'Monthly',
        status: 'Active',
        accountReference: 'Password Manager → Clients → Veda → Supabase',
        purpose: 'Production database for analytics platform',
      },
    ],
  });

  console.log('✅ Assets seeded');

  // ─── Content ─────────────────────────────────────────────────────────────
  await prisma.contentRecord.createMany({
    data: [
      {
        contentCode: 'CNT-001',
        title: 'How We Reduced NexaCore\'s Load Time by 60%',
        contentType: 'Case_Study',
        platform: 'LinkedIn',
        status: 'Published',
        ideaDate: new Date('2026-07-01'),
        draftDate: new Date('2026-08-10'),
        scheduledDate: new Date('2026-09-01'),
        publishedDate: new Date('2026-09-01'),
        url: 'https://linkedin.com/boaive/nexacore-case-study',
        clientId: client1.id,
        projectId: project1.id,
        contentPillar: 'Product_Case_Study',
        cta: 'Book a free consultation',
        author: 'Aarav Sharma',
      },
      {
        contentCode: 'CNT-002',
        title: 'Building Production-Grade ML Pipelines with Prefect',
        contentType: 'Technical_Blog',
        platform: 'Blog',
        status: 'Draft',
        ideaDate: new Date('2026-08-15'),
        draftDate: new Date('2026-09-20'),
        scheduledDate: new Date('2026-10-10'),
        clientId: client2.id,
        contentPillar: 'Engineering_Excellence',
        cta: 'Follow us for more engineering content',
        author: 'Priya Iyer',
      },
      {
        contentCode: 'CNT-003',
        title: '5 Lessons from Shipping 10 SaaS Products',
        contentType: 'Social_Thread',
        platform: 'Twitter_X',
        status: 'Scheduled',
        ideaDate: new Date('2026-09-01'),
        scheduledDate: new Date('2026-10-05'),
        contentPillar: 'Operations_Insights',
        author: 'Aarav Sharma',
      },
      {
        contentCode: 'CNT-004',
        title: 'Boaive Monthly Newsletter - October 2026',
        contentType: 'Newsletter',
        platform: 'Newsletter',
        status: 'Draft',
        ideaDate: new Date('2026-09-25'),
        scheduledDate: new Date('2026-10-01'),
        contentPillar: 'Engineering_Excellence',
        author: 'Ananya Verma',
      },
      {
        contentCode: 'CNT-005',
        title: 'Open Source: Our React Component Library',
        contentType: 'Technical_Blog',
        platform: 'Blog',
        status: 'Idea',
        ideaDate: new Date('2026-09-28'),
        contentPillar: 'Open_Source',
        author: 'Rohan Mehta',
      },
    ],
  });

  console.log('✅ Content seeded');
  console.log('\n🎉 Seed complete!');
  console.log('📧 Super Admin: admin@boaive.com');
  console.log('🔑 Password: Admin@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
