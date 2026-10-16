import React, { useState } from 'react';
import {
  UserPlus,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  X,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { useWorkspace } from '../../store/workspaceStore';
import { TalentProfile, TalentRole } from '../../types/crm';
import {
  buildGmailComposeUrl,
  buildMailtoUrl,
} from '../../services/aiLeadService';

interface AgencyRosterViewProps {
  onOpenProposalForTalent: (companyId: string, roleHint?: TalentRole) => void;
}

export const AgencyRosterView: React.FC<AgencyRosterViewProps> = ({
  onOpenProposalForTalent,
}) => {
  const {
    workspace,
    talentProfiles,
    agencyBriefs,
    companies,
    formatMoney,
    addTalentToRoster,
    toggleTalentInAgencyBrief,
    pitchAgencyBriefRoster,
    setWorkspaceMode,
  } = useWorkspace();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newHandle, setNewHandle] = useState('');
  const [newRole, setNewRole] = useState<TalentRole>('ACTOR');
  const [newLocation, setNewLocation] = useState('Seoul & Los Angeles');
  const [newRateUsd, setNewRateUsd] = useState(400);
  const [newCommissionPct, setNewCommissionPct] = useState(20);

  const totalAgencyBriefBudgetUsd = agencyBriefs.reduce(
    (s, b) => s + b.budgetUsd,
    0
  );
  const projectedAgencyCommissionUsd = agencyBriefs.reduce(
    (s, b) => s + Math.round(b.budgetUsd * (b.agencyCommissionPct / 100)),
    0
  );

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newTalent: TalentProfile = {
      id: `talent-roster-${Date.now()}`,
      workspaceId: workspace.id,
      isOwner: false,
      displayName: newName.trim(),
      handle: newHandle.trim() || `@${newName.toLowerCase().replace(/\s+/g, '.')}`,
      avatarUrl:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
      headline: `${newRole.replace('_', ' ')} • Signed to ${workspace.agencyName}`,
      roles: [newRole, 'UGC_CREATOR'],
      languages: ['EN', 'KO'],
      niches: ['K-Beauty & Skincare', 'Luxury Lifestyle', 'AI & Consumer Tech'],
      compCard: {
        height: '177 cm / 5\'9.5"',
        hair: 'Dark Brown',
        eyes: 'Brown',
        wardrobeSizes: 'Top M / Shoe 265mm',
        location: newLocation,
        unionStatus: 'Agency Represented Global Talent',
      },
      rateCard: {
        ugcSingleVideoUsd: Number(newRateUsd) || 400,
        ugcThreeBundleUsd: Math.round((Number(newRateUsd) || 400) * 2.6),
        actorHalfDayUsd: 950,
        actorFullDayUsd: 1750,
        modelLookbookDayUsd: 1500,
        whitelisting30DayPct: 30,
        exclusivityMonthlyUsd: 700,
      },
      portfolioHighlights: [],
      commissionSplitPct: Number(newCommissionPct) || 20,
      availabilityStatus: 'AVAILABLE',
    };
    addTalentToRoster(newTalent);
    setWorkspaceMode('AGENCY');
    setNewName('');
    setNewHandle('');
    setIsInviteOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Phase 2 Agency Command Banner */}
      <div className="p-6 rounded-2xl surface-card-featured flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full badge-indigo text-[11px] font-medium">
              <Building2 className="w-3.5 h-3.5 text-indigo-300" />
              <span>Agency Roster & Brand Matchmaker</span>
            </span>
            <span className="px-2 py-0.5 rounded-md badge-neutral text-[11px] font-medium tabular-nums">
              {talentProfiles.length} Roster Talent Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
            {workspace.agencyName} — Roster & Multi-Creator Briefs
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Scale from solo talent into the owner of your own agency. Onboard actors, models, and UGC creators onto your roster, pitch multi-creator packages to brands, and earn a {workspace.defaultAgencyCommissionPct}% management cut.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative">
          <div className="p-3.5 rounded-xl surface-inset text-right">
            <span className="text-[11px] text-zinc-500 block">
              Agency Brief Volume
            </span>
            <span className="text-base font-semibold text-zinc-100 tabular-nums">
              {formatMoney(totalAgencyBriefBudgetUsd)}
            </span>
            <span className="block text-[11px] text-emerald-300 font-medium tabular-nums mt-0.5">
              +{formatMoney(projectedAgencyCommissionUsd)} Agency Cut (20%)
            </span>
          </div>

          <button
            onClick={() => setIsInviteOpen(true)}
            className="px-4 py-2.5 rounded-lg btn-primary-accent font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Talent to Roster</span>
          </button>
        </div>
      </div>

      {/* Section 1: Brand <-> Talent Matchmaking Briefs */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">
            Multi-Talent Brand Brief Matchmaking
          </h2>
          <p className="text-xs text-zinc-400">
            Select actors, models, and creators from your roster below to assemble a multi-talent pitch deck for each brand campaign.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {agencyBriefs.map((brief) => {
            const agencyCutUsd = Math.round(
              brief.budgetUsd * (brief.agencyCommissionPct / 100)
            );
            const netToTalentPoolUsd = brief.budgetUsd - agencyCutUsd;
            const matchedTalentNames = talentProfiles
              .filter((t) => brief.matchedTalentIds.includes(t.id))
              .map((t) => `${t.displayName} (${t.roles[0].replace('_', ' ')})`)
              .join(', ');

            const deckSubject = `${workspace.agencyName} Roster Submission: ${brief.campaignTitle} (${brief.brandName})`;
            const deckBody = `Hi ${brief.brandName} Team,\n\nFollowing up on your "${brief.campaignTitle}" brief ($${brief.budgetUsd.toLocaleString()} USD total campaign budget).\n\nWe have shortlisted ${brief.matchedTalentIds.length} vetted talent from our ${workspace.agencyName} roster for this shoot:\n• ${
              matchedTalentNames || 'Selected Roster Talent'
            }\n• Languages Covered: ${brief.requiredLanguages.join(', ')}\n\nPlease let us know if you would like us to lock in their availability and send over the consolidated production agreement.\n\nBest,\n${workspace.agencyName}`;

            const statusBadgeClass =
              brief.status === 'BOOKED'
                ? 'badge-emerald'
                : brief.status === 'ROSTER_PITCHED'
                ? 'badge-amber'
                : 'badge-sky';

            return (
              <div
                key={brief.id}
                className="p-5 rounded-2xl surface-card-interactive flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full font-medium ${statusBadgeClass}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            brief.status === 'BOOKED'
                              ? 'bg-emerald-400'
                              : brief.status === 'ROSTER_PITCHED'
                              ? 'bg-amber-400'
                              : 'bg-sky-400'
                          }`}
                        />
                        {brief.status.replace('_', ' ')}
                      </span>
                      <h3 className="text-base font-semibold text-zinc-100 mt-2">
                        {brief.brandName}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {brief.campaignTitle}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-zinc-500 block">
                        Total Campaign
                      </span>
                      <span className="text-base font-semibold text-zinc-100 tabular-nums">
                        {formatMoney(brief.budgetUsd)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {brief.briefSummary}
                  </p>

                  {/* Commission Split Box */}
                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl surface-inset text-xs">
                    <div>
                      <span className="text-[11px] text-zinc-500 block">
                        Your Agency Cut ({brief.agencyCommissionPct}%)
                      </span>
                      <span className="font-semibold text-emerald-300 text-sm tabular-nums">
                        {formatMoney(agencyCutUsd)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-500 block">
                        Talent Roster Pool ({100 - brief.agencyCommissionPct}%)
                      </span>
                      <span className="font-semibold text-zinc-200 text-sm tabular-nums">
                        {formatMoney(netToTalentPoolUsd)}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Talent Assignment Pills */}
                  <div>
                    <span className="text-[11px] text-zinc-500 block mb-2 tabular-nums">
                      Matched Roster Talent ({brief.matchedTalentIds.length} / {brief.creatorsNeededCount} Needed) — Click to Toggle:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {talentProfiles.map((talent) => {
                        const isMatched = brief.matchedTalentIds.includes(talent.id);
                        return (
                          <button
                            key={talent.id}
                            type="button"
                            onClick={() =>
                              toggleTalentInAgencyBrief(brief.id, talent.id)
                            }
                            className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 border transition cursor-pointer ${
                              isMatched
                                ? 'bg-indigo-500/15 border-indigo-400/40 text-indigo-100 font-medium shadow-xs'
                                : 'surface-inset text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            <img
                              src={talent.avatarUrl}
                              alt={talent.displayName}
                              className="w-4 h-4 rounded-full object-cover ring-1 ring-white/10"
                            />
                            <span>{talent.displayName}</span>
                            {isMatched && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={buildMailtoUrl('', deckSubject, deckBody)}
                      className="px-2.5 py-1.5 rounded-lg btn-secondary-glass text-[11px] font-medium flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Email Deck</span>
                    </a>
                    <a
                      href={buildGmailComposeUrl('', deckSubject, deckBody)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-lg btn-secondary-glass text-[11px] font-medium flex items-center gap-1"
                    >
                      <span>Gmail</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <button
                    onClick={() => pitchAgencyBriefRoster(brief.id)}
                    disabled={brief.status === 'BOOKED'}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      brief.status === 'BOOKED'
                        ? 'badge-emerald cursor-default'
                        : 'btn-primary-accent'
                    }`}
                  >
                    {brief.status === 'OPEN_MATCHING'
                      ? 'Mark Roster Deck Sent'
                      : brief.status === 'ROSTER_PITCHED'
                      ? `Approve & Book (${formatMoney(agencyCutUsd)} Cut)`
                      : 'Campaign Booked'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Roster Talent Directory */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-zinc-100">
          Represented Actors, Models & UGC Creators ({talentProfiles.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {talentProfiles.map((talent) => (
            <div
              key={talent.id}
              className="p-5 rounded-2xl surface-card-interactive flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={talent.avatarUrl}
                  alt={talent.displayName}
                  className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/15 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-zinc-100 truncate">
                      {talent.displayName}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full font-medium tabular-nums ${
                        talent.isOwner ? 'badge-indigo' : 'badge-emerald'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {talent.isOwner
                        ? 'Founder (100%)'
                        : `${talent.commissionSplitPct}% Agency Cut`}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">{talent.handle}</p>
                  <p className="text-xs text-zinc-400 mt-1">{talent.headline}</p>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {talent.roles.map((r) => (
                      <span
                        key={r}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                          r === 'ACTOR'
                            ? 'badge-indigo'
                            : r === 'MODEL'
                            ? 'badge-violet'
                            : 'badge-sky'
                        }`}
                      >
                        {r.replace('_', ' ')}
                      </span>
                    ))}
                    {talent.languages.map((l) => (
                      <span
                        key={l}
                        className="text-[11px] px-2 py-0.5 rounded-md badge-neutral"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl surface-inset text-xs">
                <div>
                  <span className="text-[11px] text-zinc-500 block">
                    Single UGC
                  </span>
                  <span className="font-semibold text-zinc-100 tabular-nums">
                    {formatMoney(talent.rateCard.ugcSingleVideoUsd)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 block">
                    Actor Full-Day
                  </span>
                  <span className="font-semibold text-zinc-100 tabular-nums">
                    {formatMoney(talent.rateCard.actorFullDayUsd)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 block">
                    Lookbook Day
                  </span>
                  <span className="font-semibold text-zinc-100 tabular-nums">
                    {formatMoney(talent.rateCard.modelLookbookDayUsd)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-zinc-500">{talent.compCard.location}</span>
                <button
                  onClick={() =>
                    onOpenProposalForTalent(
                      companies[0]?.id || 'comp-medicube',
                      talent.roles[0]
                    )
                  }
                  className="text-indigo-300 hover:text-indigo-200 flex items-center gap-1 font-medium cursor-pointer transition"
                >
                  <span>Build Proposal for {talent.displayName.split(' ')[0]}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Talent Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-100">
                Add Actor, Model or UGC Creator to Roster
              </h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleInviteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Full / Stage Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Ji-Wook Han or Chloe Bennett"
                  className="w-full px-3 py-2 rounded-lg input-modern"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Social Handle</label>
                  <input
                    type="text"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    placeholder="@jiwook.oncamera"
                    className="w-full px-3 py-2 rounded-lg input-modern"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Primary Specialty</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as TalentRole)}
                    className="w-full px-3 py-2 rounded-lg input-modern"
                  >
                    <option value="ACTOR">On-Camera Actor</option>
                    <option value="MODEL">Commercial Model</option>
                    <option value="UGC_CREATOR">UGC Ad Creator</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Base Video Rate ($ USD)</label>
                  <input
                    type="number"
                    value={newRateUsd}
                    onChange={(e) => setNewRateUsd(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg input-modern tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Agency Commission (%)</label>
                  <input
                    type="number"
                    value={newCommissionPct}
                    onChange={(e) => setNewCommissionPct(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg input-modern tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Base City / Region</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg input-modern"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-lg btn-secondary-glass cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg btn-primary-accent font-semibold cursor-pointer"
                >
                  Add Talent to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
