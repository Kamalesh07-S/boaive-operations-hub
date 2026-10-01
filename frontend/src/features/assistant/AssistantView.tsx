// Boaive Operations Hub - Operations AI Assistant

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Zap,
  CornerDownLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { assistantService, initialAssistantMessages, suggestedPrompts } from '../../services/assistantService';
import { AssistantMessage, AssistantActionCard } from '../../types';

export const AssistantView: React.FC = () => {
  const { addTask, navigateAndFocus } = useApp();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<AssistantMessage[]>(initialAssistantMessages);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: AssistantMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await assistantService.processQuery(textToSend);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an issue analyzing operational telemetry. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAction = async (msgId: string, actionCard: AssistantActionCard) => {
    if (actionCard.type === 'create_tasks') {
      await addTask({
        task: 'Security Token Rotation Escalation SLA',
        project: 'Nexus Healthcare Telemedicine Portal',
        projectId: 'PRJ-001',
        client: 'Nexus Healthcare Systems',
        category: 'Security',
        status: 'In Progress',
        priority: 'Urgent',
        assignedTo: 'Aarav Sharma',
        dueDate: '2026-10-01',
        notes: 'Auto-generated SLA remediation task by Boaive Operations Assistant.',
      });

      showToast('Operations tasks created and assigned to leads', 'success', 'Assistant Action');
    } else if (actionCard.type === 'view_overdue') {
      navigateAndFocus('finance', actionCard.data?.invoiceId || 'FIN-001');
      return;
    } else {
      showToast('Action confirmed and logged to audit trail', 'info', 'Assistant Workflow');
    }

    // Mark card as executed
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === msgId && msg.actionCard
          ? { ...msg, actionCard: { ...msg.actionCard, executed: true } }
          : msg
      )
    );
  };

  const handleClearHistory = () => {
    setMessages(initialAssistantMessages);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: '16px' }}>
      {/* Assistant Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.35)',
            }}
          >
            <Sparkles size={20} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Boaive Operations Intelligence Assistant
              </h2>
              <span className="badge badge-purple">Active Telemetry</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Context-aware insights across pipeline velocity, delivery risks, accounts receivable & DevOps renewals
            </p>
          </div>
        </div>

        <button onClick={handleClearHistory} className="btn btn-ghost btn-sm" title="Clear Conversation">
          <RefreshCw size={13} />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Chat Messages Log Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '14px',
              maxWidth: '850px',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              width: msg.role === 'user' ? 'auto' : '100%',
            }}
          >
            {/* Avatar */}
            {msg.role === 'assistant' && (
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Sparkles size={16} />
              </div>
            )}

            {/* Bubble Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: msg.role === 'user' ? 'var(--brand-primary)' : 'var(--bg-elevated)',
                  color: msg.role === 'user' ? '#ffffff' : 'var(--text-primary)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.content}
              </div>

              {/* Action Card if available */}
              {msg.actionCard && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '14px 18px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--brand-accent)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    maxWidth: '600px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Zap size={14} color="var(--brand-accent)" />
                      <span>{msg.actionCard.title}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {msg.actionCard.description}
                    </div>
                  </div>

                  {msg.actionCard.executed ? (
                    <span className="badge badge-success">
                      <CheckCircle2 size={13} />
                      <span>Executed</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleExecuteAction(msg.id, msg.actionCard!)}
                      className="btn btn-primary btn-sm"
                    >
                      <span>Execute</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              )}

              {/* Follow-up Suggested Prompts */}
              {msg.suggestedPrompts && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                  {msg.suggestedPrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => handleSendMessage(p)}
                      className="btn btn-ghost btn-sm"
                      style={{
                        fontSize: '11px',
                        backgroundColor: 'var(--bg-subtle-hover)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-full)',
                        padding: '4px 10px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span>"{p}"</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-subtle-hover)',
                  border: '1px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '8px 0' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Sparkles size={16} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
              <span>Analyzing Boaive operational context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '2px 4px', flexShrink: 0 }}>
        {suggestedPrompts.slice(0, 4).map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '11px', whiteSpace: 'nowrap', borderRadius: 'var(--radius-full)', padding: '5px 12px' }}
          >
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '8px 14px',
          flexShrink: 0,
        }}
      >
        <Sparkles size={18} color="var(--brand-accent)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Ask anything about Boaive clients, overdue bills, sprint deadlines, or revenue..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '13px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
          }}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputQuery.trim() || loading}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 14px', borderRadius: 'var(--radius-lg)' }}
        >
          <span>Send</span>
          <Send size={13} />
        </button>
      </div>
    </div>
  );
};
