import React, { useState } from 'react';
import {
  FileSignature,
  CheckCircle2,
  ArrowUpRight,
  Mail,
  Send,
  ExternalLink,
  Trash2,
  Compass,
  Clock,
} from 'lucide-react';
import { useWorkspace } from '../../store/workspaceStore';
import { InboundCategory, InboundMessage, TalentRole } from '../../types/crm';
import { NavTabId } from '../../components/layout/AppShell';
import { buildMailtoUrl, buildGmailComposeUrl } from '../../services/aiLeadService';

interface TodayDashboardProps {
  onNavigateTab: (tab: NavTabId) => void;
  onBuildProposalForCompany: (companyId: string, roleHint?: TalentRole) => void;
}

export const TodayDashboard: React.FC<TodayDashboardProps> = ({
  onNavigateTab,
  onBuildProposalForCompany,
}) => {
  const {
    ownerProfile,
    inboundMessages,
    companies,
    creatorGoal,
    usageLicenses,
    formatMoney,
    updateInboundStatus,
    deleteInboundMessage,
    renewUsageLicense,
    logCompanyOutreach,
    updateCreatorGoal,
  } = useWorkspace();

  const [selectedCategory, setSelectedCategory] = useState<InboundCategory | 'ALL'>('ALL');
  const [expandedInboundId, setExpandedInboundId] = useState<string | null>(
    inboundMessages[0]?.id || null
  );
  const [followUpSentIds, setFollowUpSentIds] = useState<string[]>([]);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalTargetInput, setGoalTargetInput] = useState(String(creatorGoal.targetRevenueUsd));

  const filteredInbound = inboundMessages.filter(
    (m) => selectedCategory === 'ALL' || m.category === selectedCategory
  );

  const remainingRevenueGapUsd = Math.max(
    0,
    creatorGoal.targetRevenueUsd - creatorGoal.currentBookedUsd
  );
  const goalPct =
    creatorGoal.targetRevenueUsd > 0
      ? Math.min(100, Math.round((creatorGoal.currentBookedUsd / creatorGoal.targetRevenueUsd) * 100))
      : 0;

  const followUpCompanies = companies.filter(
    (c) => c.outreachStatus === 'PROPOSAL_SENT' || c.outreachStatus === 'CONTACTED'
  );

  const expiringLicenses = usageLicenses.filter((l) => l.status === 'EXPIRING_SOON');

  const totalInboundValueUsd = inboundMessages.reduce(
    (sum, m) => sum + (m.detectedBudgetUsd || 0),
    0
  );

  const getRoleLabel = (role: TalentRole) => {
    if (role === 'ACTOR') return 'On-Camera Actor';
    if (role === 'MODEL') return 'Commercial Model';
    return 'UGC Creator';
  };

  const getRoleBadgeClass = (role: TalentRole) => {
    if (role === 'ACTOR') return 'badge-violet';
    if (role === 'MODEL') return 'badge-sky';
    return 'badge-indigo';
  };

  const handleLaunchProposalFromInbound = (msg: InboundMessage) => {
    updateInboundStatus(msg.id, 'PROPOSAL_DRAFTED');
    const targetComp =
      companies.find(
        (c) =>
          c.id === msg.brandCompanyId ||
          c.name.toLowerCase() === msg.brandName.toLowerCase()
      ) || companies[0];
    if (targetComp) {
      onBuildProposalForCompany(targetComp.id, msg.targetTalentRole);
    } else {
      onNavigateTab('proposals');
    }
  };

  const buildInboundReplyBody = (msg: InboundMessage) => {
    return `Hi ${msg.senderName},\n\nThanks so much for reaching out regarding ${msg.brandName}! I’m available this week and would love to lock in concepts.\n\nBased on your brief, I’ve prepared a tailored package breakdown with turnaround times and paid usage options.\n\nBest,\n${ownerProfile.displayName}\n${ownerProfile.handle}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Summary Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 7 Cols: Daily Command Overview */}
        <div className="lg:col-span-7 surface-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md badge-emerald text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Daily Studio Briefing
              </span>
              <span className="text-xs text-zinc-400 tabular-nums">
                {inboundMessages.length} Inbound •{' '}
                <strong className="text-indigo-300 font-medium">
                  {formatMoney(totalInboundValueUsd)}
                </strong>{' '}
                Opportunity
              </span>
            </div>

            <h1 className="text-xl font-semibold tracking-tight text-zinc-50 mt-2">
              Who Contacted You Today & Active Deal Queue
            </h1>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Review today’s inbound brand and casting inquiries, reply directly via your email client, or find new UGC agencies and brands to pitch.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 mt-4 border-t border-white/[0.07]">
            <div className="p-3 rounded-xl surface-inset">
              <div className="text-[11px] text-zinc-400">Inbound Today</div>
              <div className="text-lg font-semibold text-indigo-300 tabular-nums mt-0.5">
                {inboundMessages.length}
              </div>
              <div className="text-[11px] text-zinc-400 tabular-nums">
                {formatMoney(totalInboundValueUsd)} potential
              </div>
            </div>
            <div className="p-3 rounded-xl surface-inset">
              <div className="text-[11px] text-zinc-400">Companies & Agencies</div>
              <div className="text-lg font-semibold text-sky-300 tabular-nums mt-0.5">
                {companies.length}
              </div>
              <div className="text-[11px] text-zinc-400 tabular-nums">
                {followUpCompanies.length} awaiting follow-up
              </div>
            </div>
            <div className="p-3 rounded-xl surface-inset">
              <div className="text-[11px] text-zinc-400">Expiring Ad Rights</div>
              <div className="text-lg font-semibold text-amber-300 tabular-nums mt-0.5">
                {expiringLicenses.length}
              </div>
              <div className="text-[11px] text-zinc-400 tabular-nums">
                {formatMoney(
                  expiringLicenses.reduce((acc, l) => acc + l.renewalFeeUsd, 0)
                )}{' '}
                renewal upside
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Monthly Goal Tracker */}
        <div className="lg:col-span-5 surface-card-featured rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-md badge-indigo text-[11px] font-medium">
                {creatorGoal.periodLabel}
              </span>
              <button
                onClick={() => {
                  setGoalTargetInput(String(creatorGoal.targetRevenueUsd));
                  setIsEditingGoal(!isEditingGoal);
                }}
                className="text-xs text-indigo-300 hover:text-indigo-200 underline"
              >
                {isEditingGoal ? 'Cancel' : 'Edit Target'}
              </button>
            </div>

            {isEditingGoal ? (
              <div className="flex items-center gap-2 my-2">
                <input
                  type="number"
                  value={goalTargetInput}
                  onChange={(e) => setGoalTargetInput(e.target.value)}
                  className="px-3 py-1.5 input-modern rounded-lg text-xs tabular-nums w-36"
                />
                <button
                  onClick={() => {
                    updateCreatorGoal({
                      targetRevenueUsd: Math.max(500, Number(goalTargetInput) || 12000),
                    });
                    setIsEditingGoal(false);
                  }}
                  className="px-3 py-1.5 rounded-lg btn-primary-accent text-xs font-medium"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <span className="text-2xl font-semibold text-white tabular-nums">
                    {formatMoney(creatorGoal.currentBookedUsd)}
                  </span>
                  <span className="text-xs text-zinc-400 ml-1.5 tabular-nums">
                    of {formatMoney(creatorGoal.targetRevenueUsd)} goal
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md badge-emerald text-xs font-semibold tabular-nums">
                  {goalPct}%
                </span>
              </div>
            )}

            <div className="w-full h-2 bg-zinc-950/80 rounded-full overflow-hidden mt-3 border border-white/[0.06]">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${goalPct}%` }}
              />
            </div>

            <p className="text-xs text-zinc-400 mt-2.5">
              Gap remaining:{' '}
              <span className="text-indigo-200 font-medium tabular-nums">
                {formatMoney(remainingRevenueGapUsd)}
              </span>{' '}
              • Min rate floor:{' '}
              <span className="text-emerald-300 font-medium tabular-nums">
                {formatMoney(creatorGoal.minProjectRateUsd)}
              </span>
            </p>
          </div>

          <div className="space-y-2 pt-3 mt-3 border-t border-white/[0.08]">
            {creatorGoal.milestones.map((ms) => (
              <div key={ms.id} className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">{ms.label}</span>
                <span className="font-medium text-indigo-200 tabular-nums">
                  {ms.current} / {ms.target}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Who Contacted Me Today */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-50">
                Inbound Inquiries & Sponsorship Offers
              </h2>
              <p className="text-xs text-zinc-400">
                Sorted by Goal Alignment Score. Click any inquiry to reply by email or build a 3-tier proposal.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 surface-inset p-1 rounded-xl">
              {(
                [
                  { id: 'ALL', label: 'All' },
                  { id: 'SPONSORSHIP', label: 'Sponsorships' },
                  { id: 'UGC_BRIEF', label: 'UGC Briefs' },
                  { id: 'MODEL_BOOKING', label: 'Casting' },
                  { id: 'FOLLOW_UP', label: 'Replies' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === tab.id
                      ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/35 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredInbound.length === 0 ? (
            <div className="surface-card rounded-2xl p-8 text-center space-y-3">
              <p className="text-sm font-medium text-zinc-200">
                No inbound inquiries in this view yet.
              </p>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Click "Log Inbound" in the top bar to paste any email or DM, or head to the Lead Gen Hub to pitch UGC agencies and brands.
              </p>
              <div className="flex justify-center gap-2 pt-1">
                <button
                  onClick={() => onNavigateTab('leads')}
                  className="px-3.5 py-2 rounded-lg btn-primary-accent text-xs font-medium flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Open Lead Gen Hub (Agencies & Brands)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="surface-card rounded-2xl divide-y divide-white/[0.07] overflow-hidden">
              {filteredInbound.map((msg) => {
                const isExpanded = expandedInboundId === msg.id;
                const replySubj = msg.subject.startsWith('Re:')
                  ? msg.subject
                  : `Re: ${msg.subject}`;
                const replyBody = buildInboundReplyBody(msg);

                return (
                  <div
                    key={msg.id}
                    className={`p-4 sm:p-5 transition-colors ${
                      isExpanded ? 'bg-indigo-500/[0.04]' : 'hover:bg-white/[0.025]'
                    }`}
                  >
                    {/* Summary Row */}
                    <div
                      onClick={() => setExpandedInboundId(isExpanded ? null : msg.id)}
                      className="cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                              msg.goalAlignmentScore >= 90 ? 'badge-emerald' : 'badge-indigo'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                msg.status === 'UNREAD_TODAY'
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                              }`}
                            />
                            {msg.goalAlignmentScore}% Fit
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${getRoleBadgeClass(
                              msg.targetTalentRole
                            )}`}
                          >
                            {getRoleLabel(msg.targetTalentRole)}
                          </span>
                          {msg.status === 'UNREAD_TODAY' && (
                            <span className="px-1.5 py-0.5 rounded-md badge-amber text-[10px] font-medium">
                              New Today
                            </span>
                          )}
                          <span className="text-xs text-zinc-400">
                            {msg.channel.replace('_', ' ')} • {msg.receivedAt}
                          </span>
                        </div>

                        <h3 className="text-sm font-semibold text-zinc-50">
                          {msg.brandName} —{' '}
                          <span className="font-normal text-zinc-300">{msg.subject}</span>
                        </h3>
                        <p className="text-xs text-zinc-400">{msg.aiSummary}</p>
                      </div>

                      <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1">
                        <div className="text-sm font-semibold text-emerald-300 tabular-nums">
                          {formatMoney(msg.detectedBudgetUsd)}
                        </div>
                        <div className="text-[11px] text-zinc-400">{msg.senderName}</div>
                      </div>
                    </div>

                    {/* Expanded Details & Real Actions */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/[0.07] space-y-3">
                        <div className="surface-inset rounded-xl p-3.5 text-xs space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-zinc-400 pb-1.5 border-b border-white/[0.06]">
                            <span>
                              From: <strong className="text-zinc-100">{msg.senderName}</strong> (
                              {msg.senderTitle}) •{' '}
                              <span className="text-indigo-300">{msg.senderHandleOrEmail}</span>
                            </span>
                            <span className="badge-neutral px-2 py-0.5 rounded text-[11px]">
                              {msg.industryNiche}
                            </span>
                          </div>
                          <p className="text-zinc-200 leading-relaxed pt-1">{msg.rawMessage}</p>
                        </div>

                        <div className="text-xs text-zinc-400">
                          <span className="text-indigo-300 font-medium">Goal Fit:</span>{' '}
                          {msg.goalAlignmentReason}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => handleLaunchProposalFromInbound(msg)}
                              className="px-3 py-1.5 rounded-lg btn-primary-accent text-xs font-medium flex items-center gap-1.5"
                            >
                              <FileSignature className="w-3.5 h-3.5" />
                              <span>Build Proposal</span>
                            </button>

                            <a
                              href={buildMailtoUrl(
                                msg.senderHandleOrEmail.includes('@') &&
                                  !msg.senderHandleOrEmail.startsWith('@')
                                  ? msg.senderHandleOrEmail
                                  : '',
                                replySubj,
                                replyBody
                              )}
                              onClick={() => updateInboundStatus(msg.id, 'REPLIED')}
                              className="px-3 py-1.5 rounded-lg btn-secondary-glass text-xs font-medium flex items-center gap-1.5"
                            >
                              <Mail className="w-3.5 h-3.5 text-indigo-300" />
                              <span>Reply in Mail</span>
                            </a>

                            <a
                              href={buildGmailComposeUrl(
                                msg.senderHandleOrEmail.includes('@') &&
                                  !msg.senderHandleOrEmail.startsWith('@')
                                  ? msg.senderHandleOrEmail
                                  : '',
                                replySubj,
                                replyBody
                              )}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => updateInboundStatus(msg.id, 'REPLIED')}
                              className="px-3 py-1.5 rounded-lg btn-secondary-glass text-xs font-medium flex items-center gap-1.5"
                            >
                              <span>Gmail</span>
                              <ExternalLink className="w-3 h-3 text-zinc-400" />
                            </a>
                          </div>

                          <button
                            onClick={() => deleteInboundMessage(msg.id)}
                            title="Delete Inquiry"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 4 Cols: Lead Gen Shortcut, Follow-Up Queue & Usage Renewals */}
        <div className="lg:col-span-4 space-y-4">
          {/* Lead Gen Action Card */}
          <div className="surface-card-featured rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">
                Need More UGC Deals This Week?
              </span>
              <Compass className="w-4 h-4 text-indigo-300" />
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Apply to 10+ performance creative agencies (TubeScience, MuteSix, House of Marketers), pitch DTC brands, or join paid UGC platforms.
            </p>
            <button
              onClick={() => onNavigateTab('leads')}
              className="w-full py-2 px-3 rounded-lg btn-primary-accent text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <span>Open Lead Gen Hub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Outbound Follow-Up Queue */}
          <div className="surface-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>Follow-Up Queue ({followUpCompanies.length})</span>
              </h3>
              <button
                onClick={() => onNavigateTab('pipeline')}
                className="text-[11px] text-indigo-300 hover:text-indigo-200"
              >
                Full Pipeline
              </button>
            </div>

            <div className="divide-y divide-white/[0.07]">
              {followUpCompanies.slice(0, 4).map((comp) => {
                const isSent = followUpSentIds.includes(comp.id);
                const contactEmail = comp.contacts[0]?.email || '';
                const bumpSubject = `Quick follow-up: ${comp.name} x ${ownerProfile.displayName} UGC / On-Camera Concepts`;
                const bumpBody = `Hi ${comp.contacts[0]?.name || 'Team'},\n\nFloating this to the top of your inbox in case you're locking in creative testing for this month. Happy to film a quick custom 10-second audition hook if helpful!\n\nBest,\n${ownerProfile.displayName}`;

                return (
                  <div key={comp.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-100 truncate">{comp.name}</span>
                      <span className="text-emerald-300 font-semibold tabular-nums">
                        {formatMoney(comp.estimatedDealValueUsd)}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">{comp.notes}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                          comp.entityType === 'AGENCY' ? 'badge-violet' : 'badge-sky'
                        }`}
                      >
                        {comp.entityType === 'AGENCY'
                          ? 'AGENCY'
                          : comp.outreachStatus.replace('_', ' ')}
                      </span>
                      {isSent ? (
                        <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Follow-up logged
                        </span>
                      ) : (
                        <a
                          href={buildMailtoUrl(contactEmail, bumpSubject, bumpBody)}
                          onClick={() => {
                            logCompanyOutreach(
                              comp.id,
                              bumpSubject,
                              'Sent polite follow-up check-in on creative brief.',
                              'EMAIL'
                            );
                            setFollowUpSentIds((prev) => [...prev, comp.id]);
                          }}
                          className="text-[11px] font-medium text-indigo-300 hover:text-indigo-200 hover:underline flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Follow-Up</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expiring Ad Usage Rights */}
          {expiringLicenses.length > 0 && (
            <div className="surface-card rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-zinc-100">
                  Expiring Ad Usage Licenses
                </h3>
                <button
                  onClick={() => onNavigateTab('kit')}
                  className="text-[11px] text-indigo-300 hover:text-indigo-200"
                >
                  Manage Rights
                </button>
              </div>
              <div className="divide-y divide-white/[0.07]">
                {expiringLicenses.map((lic) => (
                  <div key={lic.id} className="py-2.5 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-100">{lic.brandName}</span>
                      <span className="badge-amber px-1.5 py-0.5 rounded-md text-[10px] font-medium tabular-nums">
                        {lic.daysRemaining}d left
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-300 tabular-nums">
                        Renewal:{' '}
                        <strong className="text-emerald-300">
                          {formatMoney(lic.renewalFeeUsd)}
                        </strong>
                      </span>
                      <button
                        onClick={() => renewUsageLicense(lic.id)}
                        className="px-2.5 py-1 rounded-lg btn-secondary-glass text-[11px] font-medium"
                      >
                        Collect +60d Renewal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
