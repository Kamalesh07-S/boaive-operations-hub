// Boaive Operations Hub - Minimal Assistive Query Modal

import React, { useState } from 'react';
import { MessageSquare, Send, X, CornerDownLeft, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

export const MinimalAssistantModal: React.FC = () => {
  const { assistantModalOpen, setAssistantModalOpen, tasks, finance, projects, leads } = useApp();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  if (!assistantModalOpen) return null;

  const quickPrompts = [
    'What needs attention today?',
    'Show overdue tasks.',
    'Which clients have pending payments?',
    'Which projects are due this week?',
  ];

  const handleQuery = (text: string) => {
    setQuery(text);
    const q = text.toLowerCase();

    if (q.includes('attention') || q.includes('today')) {
      const overdueT = tasks.filter((t) => t.status === 'Overdue');
      const overdueF = finance.filter((f) => f.paymentStatus === 'Overdue');
      setResponse(
        `Operational Attention Summary:\n• ${overdueT.length} overdue tasks (${overdueT.map((t) => t.task).join(', ')})\n• ₹25,000 overdue invoice (Apex FinTech Global)\n• Project "Website Redesign" deadline in 4 days (04 Oct 2026)\n• SSL certificate api.boaive.com expiring in 6 days.`
      );
    } else if (q.includes('task') || q.includes('overdue')) {
      const overdueT = tasks.filter((t) => t.status === 'Overdue');
      setResponse(
        `Overdue Tasks (${overdueT.length}):\n${overdueT.map((t) => `• [${t.priority}] ${t.task} (${t.project}) - Assigned to ${t.assignedTo}`).join('\n')}`
      );
    } else if (q.includes('payment') || q.includes('pending')) {
      const pendingF = finance.filter((f) => f.paymentStatus !== 'Paid');
      setResponse(
        `Pending Receivables:\n${pendingF.map((f) => `• ${f.client}: ₹${f.amount.toLocaleString('en-IN')} (${f.paymentStatus}) - ${f.description}`).join('\n')}`
      );
    } else if (q.includes('project') || q.includes('due') || q.includes('deadline')) {
      const dueP = projects.filter((p) => p.status !== 'Completed');
      setResponse(
        `Active Project Deadlines:\n${dueP.map((p) => `• ${p.projectName} (${p.client}) - Due ${p.deadline} [${p.progress}% done]`).join('\n')}`
      );
    } else {
      setResponse(
        `System Status:\n• 14 Clients | 9 Active Sprints | ₹4.2L Monthly Revenue\n• 2 Overdue Tasks requiring escalation.`
      );
    }
  };

  return (
    <Modal
      isOpen={assistantModalOpen}
      onClose={() => {
        setAssistantModalOpen(false);
        setResponse(null);
      }}
      title="Operations Assistant"
      subtitle="Quick conversational lookup across active Boaive spreadsheets"
      footer={
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            setAssistantModalOpen(false);
            setResponse(null);
          }}
        >
          Close
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Quick prompt chips */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
            Suggested Inquiries
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleQuery(p)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '11px' }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Ask a question about operational state..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleQuery(query);
            }}
          />
          <button onClick={() => handleQuery(query)} className="btn btn-primary btn-sm">
            <Send size={13} />
          </button>
        </div>

        {/* Response Box */}
        {response && (
          <div
            style={{
              padding: '14px',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {response}
          </div>
        )}
      </div>
    </Modal>
  );
};
