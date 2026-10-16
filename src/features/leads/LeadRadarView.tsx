import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Mail,
  Building2,
  Briefcase,
  Layers,
  BookOpen,
  Users,
  Play,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useWorkspace } from '../../store/workspaceStore';
import {
  DiscoveredBrandCandidate,
  discoverAndEnrichBrands,
  filterAndDiscoverAgencies,
  UGC_MONETIZATION_PLAYBOOKS,
  convertCandidateToCompany,
  convertAgencyToCompany,
  buildMetaAdLibraryUrl,
  buildTikTokCreativeCenterUrl,
  buildLinkedInPeopleSearchUrl,
  buildMailtoUrl,
  buildGmailComposeUrl,
} from '../../services/aiLeadService';
import {
  UgcAgencyLead,
  UgcAgencyType,
  PlatformApplicationStatus,
  TalentRole,
} from '../../types/crm';

interface LeadRadarViewProps {
  onBuildProposalForCompany: (companyId: string, roleHint?: TalentRole) => void;
}

type LeadHubTab = 'AGENCIES' | 'BRANDS' | 'PLATFORMS' | 'PLAYBOOKS';

interface PitchModalState {
  entityType: 'AGENCY' | 'BRAND';
  targetName: string;
  recipientEmail: string;
  recipientRole: string;
  subject: string;
  body: string;
  onSaveAndLog: (subject: string, body: string, recipientEmail: string) => void;
}

const AGENCY_TYPE_LABELS: Record<UgcAgencyType | 'ALL', string> = {
  ALL: 'All Agency Types',
  PERFORMANCE_AD_AGENCY: 'Performance Ad Agencies',
  TIKTOK_SHOP_PARTNER: 'TikTok Shop & Creator Partners',
  KBEAUTY_GLOBAL_PR: 'K-Beauty & Global PR Agencies',
  CREATOR_SEEDING_AGENCY: 'Creator Seeding Agencies',
  COMMERCIAL_CASTING_AGENCY: 'Commercial Casting Agencies',
};

const PLATFORM_STATUS_OPTIONS: {
  value: PlatformApplicationStatus;
  label: string;
  dotColor: string;
}[] = [
  { value: 'NOT_STARTED', label: 'Not Started', dotColor: 'bg-zinc-500' },
  { value: 'APPLIED', label: 'Applied / Pending', dotColor: 'bg-amber-400' },
  { value: 'ACTIVE_PROFILE', label: 'Active Profile', dotColor: 'bg-sky-400' },
  { value: 'EARNING', label: 'Booking & Earning', dotColor: 'bg-emerald-400' },
];

export const LeadRadarView: React.FC<LeadRadarViewProps> = ({
  onBuildProposalForCompany,
}) => {
  const {
    workspace,
    ownerProfile,
    creatorGoal,
    companies,
    ugcPlatforms,
    addCompany,
    logCompanyOutreach,
    updatePlatformStatus,
    formatMoney,
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<LeadHubTab>('AGENCIES');

  // Tab 1: Agencies State
  const [agencyQuery, setAgencyQuery] = useState('');
  const [agencyTypeFilter, setAgencyTypeFilter] = useState<UgcAgencyType | 'ALL'>('ALL');
  const [agencyRegionFilter, setAgencyRegionFilter] = useState<
    'ALL' | 'US' | 'KR' | 'GLOBAL'
  >('ALL');

  // Tab 2: Brands State
  const [brandQuery, setBrandQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('ALL');
  const [brandRegionFilter, setBrandRegionFilter] = useState<
    'ALL' | 'US' | 'KR' | 'GLOBAL'
  >('ALL');
  const [brandCandidates, setBrandCandidates] = useState<DiscoveredBrandCandidate[]>(
    []
  );
  const [isScanningBrands, setIsScanningBrands] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(
    () => localStorage.getItem('vanguard_gemini_api_key') || ''
  );

  // Pitch Composer Modal State
  const [pitchModal, setPitchModal] = useState<PitchModalState | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const agencies = filterAndDiscoverAgencies({
    query: agencyQuery,
    agencyType: agencyTypeFilter,
    region: agencyRegionFilter,
    role: 'ALL',
  });

  const runBrandDiscovery = async (
    q = brandQuery,
    niche = selectedNiche,
    reg = brandRegionFilter
  ) => {
    setIsScanningBrands(true);
    try {
      const results = await discoverAndEnrichBrands({
        query: q,
        niche,
        region: reg,
        role: 'ALL',
        goal: creatorGoal,
        apiKey: geminiApiKey,
      });
      setBrandCandidates(results);
    } finally {
      setIsScanningBrands(false);
    }
  };

  useEffect(() => {
    runBrandDiscovery('', 'ALL', 'ALL');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSavedInCrm = (name: string) =>
    companies.some(
      (c) =>
        c.name.toLowerCase() === name.toLowerCase() ||
        c.name.toLowerCase().includes(name.toLowerCase())
    );

  const handleSaveAgencyToPipeline = (
    agency: UgcAgencyLead,
    markContacted = false
  ) => {
    const existing = companies.find((c) =>
      c.name.toLowerCase().includes(agency.name.toLowerCase())
    );
    if (existing) {
      return existing;
    }
    const newComp = convertAgencyToCompany(agency, workspace.id, ownerProfile.id);
    if (markContacted) {
      newComp.outreachStatus = 'CONTACTED';
      newComp.lastContactedAt = 'Today, Just now';
    }
    addCompany(newComp);
    return newComp;
  };

  const handleSaveBrandToPipeline = (
    candidate: DiscoveredBrandCandidate,
    markContacted = false
  ) => {
    const existing = companies.find(
      (c) => c.name.toLowerCase() === candidate.name.toLowerCase()
    );
    if (existing) {
      return existing;
    }
    const newComp = convertCandidateToCompany(
      candidate,
      workspace.id,
      ownerProfile.id
    );
    if (markContacted) {
      newComp.outreachStatus = 'CONTACTED';
      newComp.lastContactedAt = 'Today, Just now';
    }
    addCompany(newComp);
    return newComp;
  };

  const openAgencyPitchModal = (agency: UgcAgencyLead) => {
    const personalizedBody = agency.suggestedPitchBody
      .replace(/\[Your Name\]/g, ownerProfile.displayName)
      .replace(/\[Your Portfolio Link\]/g, `https://vanguard.studio/${ownerProfile.handle.replace('@', '')}`);

    setPitchModal({
      entityType: 'AGENCY',
      targetName: agency.name,
      recipientEmail: agency.contactEmailOrPortal,
      recipientRole: agency.contactRoleTitle,
      subject: agency.suggestedPitchSubject,
      body: personalizedBody,
      onSaveAndLog: (subj, bodyText, email) => {
        const comp = handleSaveAgencyToPipeline(
          { ...agency, contactEmailOrPortal: email || agency.contactEmailOrPortal },
          true
        );
        logCompanyOutreach(comp.id, subj, bodyText.slice(0, 140) + '...', 'EMAIL');
      },
    });
  };

  const openBrandPitchModal = (candidate: DiscoveredBrandCandidate) => {
    const subj = `3 On-Camera UGC Ad Hooks for ${candidate.name} (${candidate.industryNiche})`;
    const body = `Hi ${candidate.decisionMaker.name || 'Creative Strategy Team'},\n\nI’m an on-camera actor, commercial model, and direct-response UGC creator (${ownerProfile.languages.join(
      '/'
    )} bilingual). I noticed ${
      candidate.name
    } is scaling paid social video and put together a concept specifically for your current funnel:\n\n• Hook Concept: ${
      candidate.suggestedPitchHook
    }\n• Deliverables: 3 modular opening hooks (0–3s) + studio-lit 4K product demo + 60-day paid ad whitelisting\n\nWould you be open to me sending over my 60-second reel and a 3-video test package breakdown?\n\nBest,\n${
      ownerProfile.displayName
    }\n${ownerProfile.handle} • ${ownerProfile.compCard.location}`;

    setPitchModal({
      entityType: 'BRAND',
      targetName: candidate.name,
      recipientEmail: candidate.decisionMaker.email,
      recipientRole: candidate.decisionMaker.roleTitle,
      subject: subj,
      body,
      onSaveAndLog: (finalSubj, finalBody, email) => {
        const comp = handleSaveBrandToPipeline(
          {
            ...candidate,
            decisionMaker: {
              ...candidate.decisionMaker,
              email: email || candidate.decisionMaker.email,
            },
          },
          true
        );
        logCompanyOutreach(
          comp.id,
          finalSubj,
          finalBody.slice(0, 140) + '...',
          'EMAIL'
        );
      },
    });
  };

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const activePlatformsCount = ugcPlatforms.filter(
    (p) => p.status === 'ACTIVE_PROFILE' || p.status === 'EARNING'
  ).length;

  const getAgencyBadgeTone = (type: UgcAgencyType) => {
    switch (type) {
      case 'PERFORMANCE_AD_AGENCY':
        return 'badge-indigo';
      case 'TIKTOK_SHOP_PARTNER':
        return 'badge-emerald';
      case 'KBEAUTY_GLOBAL_PR':
        return 'badge-violet';
      case 'CREATOR_SEEDING_AGENCY':
        return 'badge-sky';
      case 'COMMERCIAL_CASTING_AGENCY':
        return 'badge-amber';
      default:
        return 'badge-indigo';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-1.5">
            <span className="badge-indigo px-2 py-0.5 rounded-md text-[11px]">
              Lead Generation & Sourcing Hub
            </span>
            <span className="text-zinc-700">•</span>
            <span className="tabular-nums text-emerald-300 font-medium">
              Target Floor: {formatMoney(creatorGoal.minProjectRateUsd)}+
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-50">
            Find UGC Agencies, Brands & Paid Casting Channels
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Apply to performance agency rosters for recurring monthly briefs, pitch brands running paid video ads, and track your active UGC platforms.
          </p>
        </div>

        {/* Summary Metrics Strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="surface-card rounded-xl px-3.5 py-2.5">
            <div className="text-[11px] text-zinc-400">Curated UGC Agencies</div>
            <div className="text-sm font-semibold text-indigo-300 tabular-nums">
              {agencies.length} Roster Leads
            </div>
          </div>
          <div className="surface-card rounded-xl px-3.5 py-2.5">
            <div className="text-[11px] text-zinc-400">Active UGC Platforms</div>
            <div className="text-sm font-semibold text-emerald-300 tabular-nums">
              {activePlatformsCount} / {ugcPlatforms.length} Active
            </div>
          </div>
        </div>
      </div>

      {/* 4-Channel Segmented Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap p-1 rounded-xl surface-inset gap-1">
          <button
            onClick={() => setActiveTab('AGENCIES')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'AGENCIES'
                ? 'btn-primary-accent'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>1. Agencies to Contact</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] tabular-nums ${
                activeTab === 'AGENCIES'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'bg-white/[0.06] text-zinc-400'
              }`}
            >
              10+
            </span>
          </button>

          <button
            onClick={() => setActiveTab('BRANDS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'BRANDS'
                ? 'btn-primary-accent'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>2. Brands & Companies</span>
          </button>

          <button
            onClick={() => setActiveTab('PLATFORMS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'PLATFORMS'
                ? 'btn-primary-accent'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. UGC Platforms & Casting</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] tabular-nums ${
                activeTab === 'PLATFORMS'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'bg-white/[0.06] text-zinc-400'
              }`}
            >
              {ugcPlatforms.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('PLAYBOOKS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'PLAYBOOKS'
                ? 'btn-primary-accent'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>4. Ways to Make UGC Money</span>
          </button>
        </div>

        {activeTab === 'BRANDS' && (
          <button
            onClick={() => setShowApiConfig(!showApiConfig)}
            className="px-3 py-1.5 rounded-lg btn-secondary-glass text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-300" />
            <span>
              {geminiApiKey
                ? 'Live Gemini Search: Active'
                : 'Connect Gemini API (Optional)'}
            </span>
          </button>
        )}
      </div>

      {/* =====================================================================
          TAB 1: AGENCIES TO CONTACT FOR UGC & ON-CAMERA CASTING
         ===================================================================== */}
      {activeTab === 'AGENCIES' && (
        <div className="space-y-4">
          <div className="surface-card rounded-2xl p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/[0.07]">
              <div>
                <h2 className="text-sm font-semibold text-zinc-50">
                  Performance Creative & UGC Agencies (Recurring Roster Deals)
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Getting accepted onto 3–5 performance ad agency rosters gives you recurring monthly casting briefs across dozens of DTC brands without constant cold outreach.
                </p>
              </div>
              <div className="text-xs text-zinc-400 shrink-0">
                Use <span className="text-indigo-300 font-medium">Pitch Roster</span> or{' '}
                <span className="text-zinc-200 font-medium">Roster Page</span> on any card below.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={agencyQuery}
                  onChange={(e) => setAgencyQuery(e.target.value)}
                  placeholder="Search agencies (e.g., TubeScience, MuteSix, TikTok, K-Beauty) or type any agency name..."
                  className="w-full pl-9 pr-4 py-2 input-modern rounded-lg text-sm"
                />
              </div>

              <div className="md:col-span-4">
                <select
                  value={agencyTypeFilter}
                  onChange={(e) =>
                    setAgencyTypeFilter(e.target.value as UgcAgencyType | 'ALL')
                  }
                  className="w-full px-3 py-2 input-modern rounded-lg text-sm"
                >
                  {(
                    [
                      'ALL',
                      'PERFORMANCE_AD_AGENCY',
                      'TIKTOK_SHOP_PARTNER',
                      'KBEAUTY_GLOBAL_PR',
                      'CREATOR_SEEDING_AGENCY',
                      'COMMERCIAL_CASTING_AGENCY',
                    ] as const
                  ).map((type) => (
                    <option key={type} value={type}>
                      {AGENCY_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex surface-inset rounded-lg p-0.5">
                {(['ALL', 'US', 'KR', 'GLOBAL'] as const).map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setAgencyRegionFilter(reg)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      agencyRegionFilter === reg
                        ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/35'
                        : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Agencies List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {agencies.map((agency) => {
              const saved = isSavedInCrm(agency.name);
              const linkedInUrl = buildLinkedInPeopleSearchUrl(
                agency.name,
                agency.contactRoleTitle
              );

              return (
                <div
                  key={agency.id}
                  className="surface-card-interactive rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${getAgencyBadgeTone(
                              agency.agencyType
                            )}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {AGENCY_TYPE_LABELS[agency.agencyType]}
                          </span>
                          <span className="badge-neutral px-1.5 py-0.5 rounded text-[11px]">
                            {agency.region}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {agency.headquarters}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-zinc-50 mt-2">
                          {agency.name}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[11px] text-zinc-400">Typical Creator Pay</div>
                        <div className="text-xs font-semibold text-emerald-300 tabular-nums mt-0.5">
                          {agency.typicalPayRangeUsd}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                      {agency.howToGetBooked}
                    </p>

                    <div className="space-y-2 py-3 border-y border-white/[0.07] text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-zinc-400 shrink-0">Clients / Brands:</span>
                        <span className="text-zinc-200 text-right">
                          {agency.notableClientBrands.join(' • ')}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-zinc-400 shrink-0">Casting Contact:</span>
                        <span className="text-indigo-200 font-medium text-right">
                          {agency.contactRoleTitle} ({agency.contactEmailOrPortal})
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-zinc-400 shrink-0">Roles Cast:</span>
                        <span className="text-zinc-300 text-right">
                          {agency.hiresRoles.map((r) => r.replace('_', ' ')).join(' • ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-4 mt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <a
                        href={agency.rosterApplicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg btn-secondary-glass text-xs font-medium flex items-center gap-1.5"
                      >
                        <span>Roster Page</span>
                        <ExternalLink className="w-3 h-3 text-zinc-400" />
                      </a>
                      <a
                        href={linkedInUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg btn-secondary-glass text-xs font-medium flex items-center gap-1.5"
                        title="Find Casting Producer on LinkedIn"
                      >
                        <Users className="w-3 h-3 text-indigo-300" />
                        <span>Find Producer</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openAgencyPitchModal(agency)}
                        className="px-3 py-1.5 rounded-lg btn-primary-accent text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Pitch Roster</span>
                      </button>

                      {saved ? (
                        <span className="px-2.5 py-1.5 rounded-lg badge-emerald text-xs font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>In CRM</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSaveAgencyToPipeline(agency)}
                          className="px-2.5 py-1.5 rounded-lg btn-secondary-glass text-xs font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: BRANDS & COMPANIES SCALING PAID VIDEO ADS
         ===================================================================== */}
      {activeTab === 'BRANDS' && (
        <div className="space-y-4">
          {showApiConfig && (
            <div className="surface-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-zinc-400">
                <span className="text-indigo-300 font-medium">
                  Optional Live Google Search Grounding:
                </span>{' '}
                Paste a Gemini API Key (`gemini-2.5-flash`) to synthesize live ad signals for any company on the web, or leave blank to use the built-in brand intelligence engine.
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => {
                    setGeminiApiKey(e.target.value);
                    localStorage.setItem('vanguard_gemini_api_key', e.target.value);
                  }}
                  placeholder="AIzaSy..."
                  className="w-full sm:w-64 px-3 py-1.5 input-modern rounded-lg text-xs"
                />
                <button
                  onClick={() => setShowApiConfig(false)}
                  className="px-3 py-1.5 rounded-lg btn-secondary-glass text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Brand Search & Filter Bar */}
          <div className="surface-card rounded-2xl p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={brandQuery}
                  onChange={(e) => setBrandQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runBrandDiscovery()}
                  placeholder="Type any brand name (e.g., Rhode, Dyson, COSRX, Notion) or keyword..."
                  className="w-full pl-9 pr-4 py-2 input-modern rounded-lg text-sm"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedNiche}
                  onChange={(e) => {
                    setSelectedNiche(e.target.value);
                    runBrandDiscovery(brandQuery, e.target.value, brandRegionFilter);
                  }}
                  className="w-full px-3 py-2 input-modern rounded-lg text-sm"
                >
                  <option value="ALL">All Target Niches</option>
                  {creatorGoal.targetNiches.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3 flex gap-2">
                <div className="flex surface-inset rounded-lg p-0.5 flex-1">
                  {(['ALL', 'US', 'KR', 'GLOBAL'] as const).map((reg) => (
                    <button
                      key={reg}
                      onClick={() => {
                        setBrandRegionFilter(reg);
                        runBrandDiscovery(brandQuery, selectedNiche, reg);
                      }}
                      className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                        brandRegionFilter === reg
                          ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/35'
                          : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                      }`}
                    >
                      {reg}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => runBrandDiscovery()}
                  disabled={isScanningBrands}
                  className="px-4 py-2 rounded-lg btn-primary-accent text-xs font-medium shrink-0 cursor-pointer"
                >
                  {isScanningBrands ? 'Scanning...' : 'Search'}
                </button>
              </div>
            </div>
          </div>

          {/* Brand Candidate Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {brandCandidates.map((cand) => {
              const saved = isSavedInCrm(cand.name);
              return (
                <div
                  key={cand.id}
                  className="surface-card-interactive rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium tabular-nums ${
                              cand.brandFitScore >= 90 ? 'badge-emerald' : 'badge-indigo'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {cand.brandFitScore}% Fit
                          </span>
                          <span className="badge-violet px-2 py-0.5 rounded-md text-[11px] font-medium">
                            {cand.industryNiche}
                          </span>
                          <span className="badge-neutral px-1.5 py-0.5 rounded text-[11px]">
                            {cand.region}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-zinc-50 mt-2">
                          {cand.name}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[11px] text-zinc-400">Est. Package</div>
                        <div className="text-sm font-semibold text-emerald-300 tabular-nums">
                          {formatMoney(cand.estimatedDealValueUsd)}
                        </div>
                      </div>
                    </div>

                    {/* Active Ad Signals */}
                    <div className="space-y-1.5 mb-3">
                      {cand.activeAdSignals.map((sig: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs text-zinc-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                          <span>{sig}</span>
                        </div>
                      ))}
                    </div>

                    {/* Contact + Pitch Angle */}
                    <div className="py-3 border-y border-white/[0.07] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-zinc-400">Decision Maker:</span>
                        <span className="text-indigo-200 font-medium text-right">
                          {cand.decisionMaker.name} — {cand.decisionMaker.roleTitle} (
                          {cand.decisionMaker.email})
                        </span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed pt-1">
                        <span className="text-indigo-300 font-medium">Pitch Hook:</span>{' '}
                        {cand.suggestedPitchHook}
                      </p>
                    </div>
                  </div>

                  {/* Verification & Outreach Toolbar */}
                  <div className="pt-4 mt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <a
                        href={buildMetaAdLibraryUrl(cand.name, cand.region)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg btn-secondary-glass text-[11px] font-medium flex items-center gap-1"
                        title="Verify active video ads in Meta Ad Library"
                      >
                        <Play className="w-3 h-3 text-indigo-300" />
                        <span>Meta Ads</span>
                      </a>
                      <a
                        href={buildTikTokCreativeCenterUrl(cand.name)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg btn-secondary-glass text-[11px] font-medium flex items-center gap-1"
                        title="Check TikTok Creative Center Top Ads"
                      >
                        <span>TikTok Ads</span>
                        <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
                      </a>
                      <a
                        href={buildLinkedInPeopleSearchUrl(
                          cand.name,
                          cand.decisionMaker.roleTitle
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg btn-secondary-glass text-[11px] font-medium flex items-center gap-1"
                        title="Find Creative Strategist on LinkedIn"
                      >
                        <Users className="w-3 h-3 text-sky-300" />
                        <span>People</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openBrandPitchModal(cand)}
                        className="px-3 py-1.5 rounded-lg btn-primary-accent text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Pitch Brand</span>
                      </button>

                      <button
                        onClick={() => {
                          const comp = handleSaveBrandToPipeline(cand);
                          onBuildProposalForCompany(comp.id, cand.recommendedRole);
                        }}
                        className="px-2.5 py-1.5 rounded-lg btn-secondary-glass text-xs font-medium cursor-pointer"
                      >
                        Proposal
                      </button>

                      {saved ? (
                        <span className="px-2.5 py-1.5 rounded-lg badge-emerald text-xs font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Saved</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSaveBrandToPipeline(cand)}
                          className="px-2.5 py-1.5 rounded-lg btn-secondary-glass text-xs font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: UGC PLATFORMS, MARKETPLACES & CASTING BOARDS
         ===================================================================== */}
      {activeTab === 'PLATFORMS' && (
        <div className="space-y-4">
          <div className="surface-card rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-50">
                Inbound UGC Marketplaces & Actor/Model Casting Boards
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Track which platforms you have joined. Having an active profile on Insense, Cohley, Collabstr, and Backstage brings daily inbound briefs while you pitch agencies and brands.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400 shrink-0">
              <span>Active Profiles:</span>
              <span className="px-2.5 py-1 rounded-md badge-emerald font-semibold tabular-nums">
                {activePlatformsCount} of {ugcPlatforms.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {ugcPlatforms.map((platform) => {
              const currentStatusObj =
                PLATFORM_STATUS_OPTIONS.find((s) => s.value === platform.status) ||
                PLATFORM_STATUS_OPTIONS[0];

              return (
                <div
                  key={platform.id}
                  className="surface-card-interactive rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium badge-violet">
                          {platform.category.replace(/_/g, ' ')}
                        </span>
                        <h3 className="text-base font-semibold text-zinc-50 mt-2">
                          {platform.name}
                        </h3>
                      </div>

                      <div className="text-right">
                        <div className="text-[11px] text-zinc-400">Typical Pay Range</div>
                        <div className="text-xs font-semibold text-emerald-300 tabular-nums mt-0.5">
                          {platform.typicalPayRange}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {platform.bestForRoles.map((role) => (
                        <span
                          key={role}
                          className="text-[11px] px-2 py-0.5 rounded-md badge-indigo"
                        >
                          {role.replace('_', ' ')}
                        </span>
                      ))}
                      <span className="text-[11px] px-2 py-0.5 rounded-md badge-neutral">
                        Barrier: {platform.barrierToEntry}
                      </span>
                    </div>

                    <div className="py-3 border-y border-white/[0.07] space-y-1.5 text-xs">
                      <div className="text-zinc-300">
                        <span className="text-indigo-300 font-medium">How It Works:</span>{' '}
                        {platform.howItWorks}
                      </div>
                      <div className="text-zinc-300">
                        <span className="text-emerald-300 font-medium">Pro Tip:</span>{' '}
                        {platform.proTipToWin}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${currentStatusObj.dotColor}`}
                      />
                      <select
                        value={platform.status}
                        onChange={(e) =>
                          updatePlatformStatus(
                            platform.id,
                            e.target.value as PlatformApplicationStatus
                          )
                        }
                        className="px-2.5 py-1.5 input-modern rounded-lg text-xs"
                      >
                        {PLATFORM_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            Status: {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <a
                      href={platform.creatorSignupUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg btn-primary-accent text-xs font-medium flex items-center gap-1.5"
                    >
                      <span>Open {platform.name}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: WAYS TO MAKE UGC MONEY (ACTIONABLE PLAYBOOKS & TEMPLATES)
         ===================================================================== */}
      {activeTab === 'PLAYBOOKS' && (
        <div className="space-y-4">
          <div className="surface-card rounded-2xl p-4">
            <h2 className="text-sm font-semibold text-zinc-50">
              Proven UGC & On-Camera Revenue Systems
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Four high-margin ways actors, models, and creators make $3,000–$12,000+/month with UGC—complete with step-by-step execution checklists and ready-to-send outreach scripts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {UGC_MONETIZATION_PLAYBOOKS.map((pb) => (
              <div
                key={pb.id}
                className="surface-card rounded-2xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium badge-indigo">
                        {pb.difficulty}
                      </span>
                      <h3 className="text-base font-semibold text-zinc-50 mt-2">
                        {pb.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">{pb.subtitle}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] text-zinc-400">Earning Potential</div>
                      <div className="text-xs font-semibold text-emerald-300 tabular-nums mt-0.5">
                        {pb.earningPotential}
                      </div>
                    </div>
                  </div>

                  {/* Execution Steps */}
                  <div className="surface-inset rounded-xl p-3.5 space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                      Step-by-Step Execution
                    </div>
                    {pb.stepByStep.map((step: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-zinc-200"
                      >
                        <span className="w-4 h-4 rounded-full bg-indigo-500/25 border border-indigo-400/35 text-indigo-200 text-[10px] font-semibold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Outreach Script Box */}
                  <div className="surface-inset rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-zinc-400">
                        Subject:{' '}
                        <span className="text-zinc-100">{pb.emailOrDmSubject}</span>
                      </span>
                      <button
                        onClick={() =>
                          copyText(
                            pb.id,
                            `Subject: ${pb.emailOrDmSubject}\n\n${pb.emailOrDmTemplate}`
                          )
                        }
                        className="px-2.5 py-1 rounded-lg btn-secondary-glass text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === pb.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-indigo-300" />
                            <span>Copy Script</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {pb.emailOrDmTemplate}
                    </pre>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <a
                    href={buildMailtoUrl('', pb.emailOrDmSubject, pb.emailOrDmTemplate)}
                    className="px-3 py-1.5 rounded-lg btn-primary-accent text-xs font-medium flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Template in Mail App</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          PITCH COMPOSER MODAL (REAL MAILTO / GMAIL / COPY / CRM LOGGING)
         ===================================================================== */}
      {pitchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card rounded-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium badge-indigo">
                  {pitchModal.entityType === 'AGENCY'
                    ? 'Agency Roster Pitch'
                    : 'Direct Brand Pitch'}
                </span>
                <h3 className="text-lg font-semibold text-zinc-50 mt-1.5">
                  Pitch {pitchModal.targetName}
                </h3>
                <p className="text-xs text-zinc-400">
                  Target Role: {pitchModal.recipientRole} • Sends from your real email client or copies to clipboard.
                </p>
              </div>
              <button
                onClick={() => setPitchModal(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={pitchModal.recipientEmail}
                    onChange={(e) =>
                      setPitchModal({ ...pitchModal, recipientEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 input-modern rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Decision Maker Lookup
                  </label>
                  <a
                    href={buildLinkedInPeopleSearchUrl(
                      pitchModal.targetName,
                      pitchModal.recipientRole
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full px-3 py-2 btn-secondary-glass rounded-lg text-xs flex items-center justify-between"
                  >
                    <span>Find {pitchModal.recipientRole} on LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-300" />
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={pitchModal.subject}
                  onChange={(e) =>
                    setPitchModal({ ...pitchModal, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 input-modern rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Pitch Message Body
                </label>
                <textarea
                  rows={8}
                  value={pitchModal.body}
                  onChange={(e) =>
                    setPitchModal({ ...pitchModal, body: e.target.value })
                  }
                  className="w-full px-3 py-2 input-modern rounded-lg text-xs leading-relaxed"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/[0.08]">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={buildMailtoUrl(
                    pitchModal.recipientEmail,
                    pitchModal.subject,
                    pitchModal.body
                  )}
                  onClick={() => {
                    pitchModal.onSaveAndLog(
                      pitchModal.subject,
                      pitchModal.body,
                      pitchModal.recipientEmail
                    );
                  }}
                  className="px-3.5 py-2 rounded-lg btn-primary-accent text-xs font-semibold flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open in Mail App</span>
                </a>

                <a
                  href={buildGmailComposeUrl(
                    pitchModal.recipientEmail,
                    pitchModal.subject,
                    pitchModal.body
                  )}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    pitchModal.onSaveAndLog(
                      pitchModal.subject,
                      pitchModal.body,
                      pitchModal.recipientEmail
                    );
                  }}
                  className="px-3.5 py-2 rounded-lg btn-secondary-glass text-xs font-medium flex items-center gap-1.5"
                >
                  <span>Compose in Gmail</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>

                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      'modal-pitch',
                      `To: ${pitchModal.recipientEmail}\nSubject: ${pitchModal.subject}\n\n${pitchModal.body}`
                    )
                  }
                  className="px-3 py-2 rounded-lg btn-secondary-glass text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'modal-pitch' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Copy Pitch</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  pitchModal.onSaveAndLog(
                    pitchModal.subject,
                    pitchModal.body,
                    pitchModal.recipientEmail
                  );
                  setPitchModal(null);
                }}
                className="px-3.5 py-2 rounded-lg badge-emerald hover:opacity-90 text-xs font-medium cursor-pointer"
              >
                Save & Log to CRM Pipeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
