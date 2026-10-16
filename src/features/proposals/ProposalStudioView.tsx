import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Copy,
  Eye,
  Mail,
  ExternalLink,
  Check,
} from 'lucide-react';
import { useWorkspace } from '../../store/workspaceStore';
import { generateGoalAlignedProposal } from '../../services/proposalGeneratorService';
import { buildMailtoUrl, buildGmailComposeUrl } from '../../services/aiLeadService';
import {
  BrandCompany,
  CurrencyCode,
  LocaleCode,
  ProposalPackage,
  TalentRole,
} from '../../types/crm';

interface ProposalStudioViewProps {
  initialCompanyId?: string | null;
  initialRoleHint?: TalentRole;
}

const FALLBACK_COMPANY: BrandCompany = {
  id: 'comp-custom-proposal',
  workspaceId: 'ws-vanguard-01',
  name: 'Custom Brand Client',
  entityType: 'BRAND',
  industryNiche: 'K-Beauty & Skincare',
  region: 'US',
  websiteUrl: 'https://brand.com',
  outreachStatus: 'IN_CONVERSATION',
  brandFitScore: 95,
  activeAdSignals: ['Custom proposal package'],
  whyItFitsYourGoal: 'Direct custom proposal aligned with your monthly revenue target.',
  contacts: [
    {
      id: 'ct-custom',
      name: 'Brand Partnerships Team',
      roleTitle: 'Creative Strategy Lead',
      email: 'partnerships@brand.com',
      preferredLanguage: 'en-US',
    },
  ],
  estimatedDealValueUsd: 1800,
  nativeCurrency: 'USD',
  nativeEstimatedValue: 1800,
  assignedTalentIds: ['talent-owner-01'],
  lastContactedAt: 'Today',
  notes: '',
  pitchHistory: [],
};

export const ProposalStudioView: React.FC<ProposalStudioViewProps> = ({
  initialCompanyId,
  initialRoleHint,
}) => {
  const {
    workspace,
    ownerProfile,
    talentProfiles,
    companies,
    proposals,
    creatorGoal,
    addOrUpdateProposal,
    acceptProposalTier,
    logCompanyOutreach,
  } = useWorkspace();

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    initialCompanyId || companies[0]?.id || FALLBACK_COMPANY.id
  );
  const [selectedTalentId, setSelectedTalentId] = useState<string>(ownerProfile.id);
  const [targetRole, setTargetRole] = useState<TalentRole>(initialRoleHint || 'UGC_CREATOR');
  const [locale, setLocale] = useState<LocaleCode>('en-US');
  const [currency, setCurrency] = useState<CurrencyCode>(workspace.baseCurrency);
  const [includeKrTaxNote, setIncludeKrTaxNote] = useState<boolean>(false);
  const [previewClientMode, setPreviewClientMode] = useState<boolean>(false);
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  const selectedCompany =
    companies.find((c) => c.id === selectedCompanyId) || companies[0] || FALLBACK_COMPANY;
  const selectedTalent =
    talentProfiles.find((t) => t.id === selectedTalentId) || ownerProfile;

  const [activeProposal, setActiveProposal] = useState<ProposalPackage>(() => {
    const existing = proposals.find((p) => p.brandCompanyId === selectedCompany.id);
    if (existing) return existing;
    return generateGoalAlignedProposal({
      company: selectedCompany,
      talent: selectedTalent,
      goal: creatorGoal,
      locale,
      currency,
      targetRole,
      usdToKrwRate: workspace.usdToKrwRate,
      includeKoreanWithholdingTaxNote: includeKrTaxNote,
    });
  });

  useEffect(() => {
    if (initialCompanyId) {
      setSelectedCompanyId(initialCompanyId);
    }
    if (initialRoleHint) {
      setTargetRole(initialRoleHint);
    }
  }, [initialCompanyId, initialRoleHint]);

  useEffect(() => {
    const generated = generateGoalAlignedProposal({
      company: selectedCompany,
      talent: selectedTalent,
      goal: creatorGoal,
      locale,
      currency,
      targetRole,
      usdToKrwRate: workspace.usdToKrwRate,
      includeKoreanWithholdingTaxNote: includeKrTaxNote,
    });
    setActiveProposal(generated);
  }, [
    selectedCompanyId,
    selectedTalentId,
    targetRole,
    locale,
    currency,
    includeKrTaxNote,
    selectedCompany,
    selectedTalent,
    creatorGoal,
    workspace.usdToKrwRate,
  ]);

  const formatTierPrice = (priceUsd: number, priceKrw: number) => {
    if (currency === 'KRW') {
      return `₩${priceKrw.toLocaleString('ko-KR')}`;
    }
    return `$${priceUsd.toLocaleString('en-US')}`;
  };

  const handleCopyFullProposal = () => {
    const tierLines = activeProposal.tiers
      .map(
        (t) =>
          `• ${t.name} (${formatTierPrice(t.priceUsd, t.priceKrw)}): ${t.deliverables.join(', ')} [${t.usageRightsSummary}]`
      )
      .join('\n');
    const text = `Subject: ${activeProposal.pitchEmailSubject}\n\n${activeProposal.pitchMessageBody}\n\n--- PACKAGE OPTIONS ---\n${tierLines}`;
    navigator.clipboard.writeText(text);
    setCopiedNotice('Copied full proposal & 3-tier pricing breakdown to clipboard.');
    setTimeout(() => setCopiedNotice(null), 3000);
  };

  const fullEmailBodyWithTiers = `${activeProposal.pitchMessageBody}\n\nPackage Options:\n${activeProposal.tiers
    .map(
      (t) =>
        `- ${t.name} (${formatTierPrice(t.priceUsd, t.priceKrw)}): ${t.deliverables.join(', ')}`
    )
    .join('\n')}`;

  const recipientEmail = selectedCompany.contacts[0]?.email || '';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md badge-indigo text-[11px] font-medium">
              3-Tier Pricing Studio
            </span>
            <span className="text-xs text-zinc-400">
              Anchor-priced packages calibrated to your monthly revenue goal
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Proposal & Rate Card Studio
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Generate a 3-tier proposal (Test Pack, Recommended Bundle, Monthly Retainer) and send it directly via Mail or Gmail.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPreviewClientMode(!previewClientMode)}
            className="px-3 py-1.5 rounded-xl btn-secondary-glass text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>{previewClientMode ? 'Exit Client Preview' : 'Client View'}</span>
          </button>

          <button
            onClick={handleCopyFullProposal}
            className="px-3 py-1.5 rounded-xl btn-secondary-glass text-xs flex items-center gap-1.5 cursor-pointer"
          >
            {copiedNotice ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
            )}
            <span>Copy Proposal Text</span>
          </button>

          <a
            href={buildMailtoUrl(
              recipientEmail,
              activeProposal.pitchEmailSubject,
              fullEmailBodyWithTiers
            )}
            onClick={() => {
              addOrUpdateProposal({ ...activeProposal, status: 'SENT' });
              logCompanyOutreach(
                selectedCompany.id,
                activeProposal.pitchEmailSubject,
                'Sent 3-tier proposal via email.'
              );
            }}
            className="px-3.5 py-1.5 rounded-xl btn-primary-accent text-xs font-medium flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send in Mail App</span>
          </a>

          <a
            href={buildGmailComposeUrl(
              recipientEmail,
              activeProposal.pitchEmailSubject,
              fullEmailBodyWithTiers
            )}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              addOrUpdateProposal({ ...activeProposal, status: 'SENT' });
              logCompanyOutreach(
                selectedCompany.id,
                activeProposal.pitchEmailSubject,
                'Sent 3-tier proposal via Gmail.'
              );
            }}
            className="px-3 py-1.5 rounded-xl btn-secondary-glass text-xs flex items-center gap-1.5"
          >
            <span>Open in Gmail</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>

      {copiedNotice && (
        <div className="p-3 rounded-xl badge-emerald text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copiedNotice}</span>
        </div>
      )}

      {/* Configuration Bar (Hidden in Client Preview Mode) */}
      {!previewClientMode && (
        <div className="surface-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Target Company / Agency</label>
            <select
              value={selectedCompany.id}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl input-modern text-xs"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.region})
                </option>
              ))}
              {companies.length === 0 && (
                <option value={FALLBACK_COMPANY.id}>{FALLBACK_COMPANY.name}</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Talent / Creator</label>
            <select
              value={selectedTalentId}
              onChange={(e) => setSelectedTalentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl input-modern text-xs"
            >
              {talentProfiles.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.displayName} ({t.handle})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Primary Role Mode</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as TalentRole)}
              className="w-full px-3 py-2 rounded-xl input-modern text-xs"
            >
              <option value="UGC_CREATOR">UGC Ad Creator</option>
              <option value="ACTOR">On-Camera Actor</option>
              <option value="MODEL">Commercial Model</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Proposal Language</label>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as LocaleCode)}
              className="w-full px-3 py-2 rounded-xl input-modern text-xs"
            >
              <option value="en-US">English (Global / US)</option>
              <option value="ko-KR">Korean (한국어 브랜드 제안서)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Currency & Tax</label>
            <div className="flex items-center gap-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="flex-1 px-2.5 py-2 rounded-xl input-modern text-xs"
              >
                <option value="USD">$ USD</option>
                <option value="KRW">₩ KRW</option>
              </select>
              <button
                type="button"
                onClick={() => setIncludeKrTaxNote(!includeKrTaxNote)}
                className={`px-2.5 py-2 rounded-xl text-[11px] font-medium cursor-pointer transition-all ${
                  includeKrTaxNote ? 'badge-indigo' : 'btn-secondary-glass text-zinc-400'
                }`}
                title="Include Korean 3.3% Withholding Tax Note"
              >
                3.3% Tax
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Document Header */}
      <div className="surface-card rounded-2xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="px-2 py-0.5 rounded badge-sky text-[11px] font-medium">
                Prepared for {activeProposal.brandName}
              </span>
              <span>•</span>
              <span>By {selectedTalent.displayName}</span>
            </div>
            <h2 className="text-lg font-semibold text-zinc-100 mt-1.5">
              {activeProposal.title}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">{activeProposal.campaignObjective}</p>
          </div>

          <div className="text-left md:text-right shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md badge-emerald text-xs font-medium tabular-nums">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {activeProposal.goalAlignmentScore}% Goal Match
            </span>
          </div>
        </div>

        {/* 3-Tier Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
          {activeProposal.tiers.map((tier) => {
            const isSelected = activeProposal.selectedTierId === tier.id;
            return (
              <div
                key={tier.id}
                className={`rounded-2xl p-5 flex flex-col justify-between transition-all ${
                  tier.isRecommended ? 'surface-card-featured' : 'surface-inset'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded badge-neutral text-[10px] font-medium uppercase tracking-wider">
                      {tier.tierCode.replace(/_/g, ' ')}
                    </span>
                    {tier.isRecommended && (
                      <span className="px-2 py-0.5 rounded-md badge-indigo text-[10px] font-semibold">
                        Recommended Anchor
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">{tier.name}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{tier.subtitle}</p>
                  </div>

                  <div className="py-2.5 border-y border-white/[0.07]">
                    <div className="text-2xl font-semibold text-zinc-100 tabular-nums">
                      {formatTierPrice(tier.priceUsd, tier.priceKrw)}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      {tier.usageRightsSummary} • {tier.turnaroundDays}-day turnaround
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-300">
                    {tier.deliverables.map((del, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            tier.isRecommended ? 'text-indigo-400' : 'text-emerald-400'
                          }`}
                        />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-4 border-t border-white/[0.07] space-y-2">
                  {!previewClientMode && (
                    <div className="text-[11px] text-zinc-400">{tier.goalImpactSummary}</div>
                  )}
                  <button
                    onClick={() => {
                      addOrUpdateProposal(activeProposal);
                      acceptProposalTier(activeProposal.id, tier.id);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected || tier.isRecommended
                        ? 'btn-primary-accent'
                        : 'btn-secondary-glass'
                    }`}
                  >
                    {activeProposal.status === 'ACCEPTED' && isSelected
                      ? 'Booked & Added to Revenue'
                      : 'Approve & Book This Tier'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Proposed Creative Hooks & Pitch Email */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-4 border-t border-white/[0.07]">
          <div className="lg:col-span-5 space-y-2.5">
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Proposed Ad Hooks Included
            </h3>
            {activeProposal.creativeHooksProposed.map((hk, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl surface-inset space-y-1 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-zinc-100">{hk.hookTitle}</div>
                  <span className="px-1.5 py-0.5 rounded badge-violet text-[10px]">
                    Hook #{i + 1}
                  </span>
                </div>
                <div className="text-zinc-400">{hk.visualDirection}</div>
                <div className="text-zinc-200 italic pt-1">{hk.spokenLine}</div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 space-y-2.5">
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Cover Pitch Email (Editable)
            </h3>
            <input
              type="text"
              value={activeProposal.pitchEmailSubject}
              onChange={(e) =>
                setActiveProposal({ ...activeProposal, pitchEmailSubject: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl input-modern text-xs"
            />
            <textarea
              rows={8}
              value={activeProposal.pitchMessageBody}
              onChange={(e) =>
                setActiveProposal({ ...activeProposal, pitchMessageBody: e.target.value })
              }
              className="w-full p-3 rounded-xl input-modern text-xs leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
