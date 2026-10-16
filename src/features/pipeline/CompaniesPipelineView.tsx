import React, { useState } from 'react';
import {
  Kanban,
  Table,
  Plus,
  FileSignature,
  Send,
  Mail,
  ExternalLink,
  X,
  Trash2,
  Download,
  Users,
  Play,
  Search,
} from 'lucide-react';
import { useWorkspace } from '../../store/workspaceStore';
import { BrandCompany, LeadEntityType, OutreachStatus, RegionCode } from '../../types/crm';
import {
  buildMailtoUrl,
  buildGmailComposeUrl,
  buildLinkedInPeopleSearchUrl,
  buildMetaAdLibraryUrl,
} from '../../services/aiLeadService';

interface CompaniesPipelineViewProps {
  onBuildProposalForCompany: (companyId: string) => void;
}

const PIPELINE_COLUMNS: {
  status: OutreachStatus;
  title: string;
  dotColor: string;
  badgeClass: string;
}[] = [
  { status: 'SCOUTED', title: '1. Scouted', dotColor: 'bg-zinc-400', badgeClass: 'badge-neutral' },
  { status: 'CONTACTED', title: '2. Contacted', dotColor: 'bg-sky-400', badgeClass: 'badge-sky' },
  { status: 'INBOUND', title: '3. Inbound', dotColor: 'bg-indigo-400', badgeClass: 'badge-indigo' },
  { status: 'IN_CONVERSATION', title: '4. In Conversation', dotColor: 'bg-amber-400', badgeClass: 'badge-amber' },
  { status: 'PROPOSAL_SENT', title: '5. Proposal Sent', dotColor: 'bg-violet-400', badgeClass: 'badge-violet' },
  { status: 'BOOKED', title: '6. Booked', dotColor: 'bg-emerald-400', badgeClass: 'badge-emerald' },
  { status: 'DELIVERED', title: '7. Delivered', dotColor: 'bg-emerald-400', badgeClass: 'badge-emerald' },
];

export const CompaniesPipelineView: React.FC<CompaniesPipelineViewProps> = ({
  onBuildProposalForCompany,
}) => {
  const {
    workspace,
    ownerProfile,
    companies,
    formatMoney,
    addCompany,
    updateCompany,
    deleteCompany,
    updateCompanyStatus,
    logCompanyOutreach,
    exportCompaniesCsv,
  } = useWorkspace();

  const [viewMode, setViewMode] = useState<'TABLE' | 'KANBAN'>('TABLE');
  const [entityFilter, setEntityFilter] = useState<'ALL' | LeadEntityType>('ALL');
  const [regionFilter, setRegionFilter] = useState<RegionCode | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Quick Outreach Log state inside drawer
  const [outreachSubject, setOutreachSubject] = useState('');
  const [outreachSnippet, setOutreachSnippet] = useState('');

  // Add new company/agency modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newEntityType, setNewEntityType] = useState<LeadEntityType>('BRAND');
  const [newCompName, setNewCompName] = useState('');
  const [newCompNiche, setNewCompNiche] = useState('K-Beauty & Skincare');
  const [newCompRegion, setNewCompRegion] = useState<RegionCode>('US');
  const [newCompContact, setNewCompContact] = useState('');
  const [newCompEmail, setNewCompEmail] = useState('');
  const [newCompValueUsd, setNewCompValueUsd] = useState(1800);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) || null;

  const filteredCompanies = companies.filter((c) => {
    const typeMatch =
      entityFilter === 'ALL' || (c.entityType || 'BRAND') === entityFilter;
    const regMatch = regionFilter === 'ALL' || c.region === regionFilter;
    const q = searchQuery.trim().toLowerCase();
    const searchMatch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.industryNiche.toLowerCase().includes(q) ||
      (c.contacts[0]?.name || '').toLowerCase().includes(q) ||
      (c.contacts[0]?.email || '').toLowerCase().includes(q);
    return typeMatch && regMatch && searchMatch;
  });

  const handleAddCustomCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim()) return;
    const created: BrandCompany = {
      id: `comp-${Date.now()}`,
      workspaceId: workspace.id,
      name: newCompName.trim(),
      entityType: newEntityType,
      industryNiche: newCompNiche,
      region: newCompRegion,
      websiteUrl: `https://${newCompName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      outreachStatus: 'CONTACTED',
      brandFitScore: 92,
      activeAdSignals: [
        newEntityType === 'AGENCY'
          ? 'Added to UGC agency roster outreach tracker'
          : 'Added to outbound brand pitch tracker',
      ],
      whyItFitsYourGoal: 'Matches target vertical and exceeds minimum project floor.',
      contacts: [
        {
          id: `ct-${Date.now()}`,
          name:
            newCompContact ||
            (newEntityType === 'AGENCY' ? 'Talent Casting Producer' : 'Brand Partnerships Lead'),
          roleTitle:
            newEntityType === 'AGENCY'
              ? 'Creator Casting & Production'
              : 'Creative Strategy & Partnerships',
          email:
            newCompEmail ||
            `partnerships@${newCompName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          preferredLanguage: newCompRegion === 'KR' ? 'ko-KR' : 'en-US',
        },
      ],
      estimatedDealValueUsd: Number(newCompValueUsd) || 1500,
      nativeCurrency: newCompRegion === 'KR' ? 'KRW' : 'USD',
      nativeEstimatedValue:
        newCompRegion === 'KR'
          ? (Number(newCompValueUsd) || 1500) * workspace.usdToKrwRate
          : Number(newCompValueUsd) || 1500,
      assignedTalentIds: [ownerProfile.id],
      lastContactedAt: 'Today',
      nextFollowUpAt: 'In 3 days',
      notes: 'Added manually to CRM pipeline.',
      pitchHistory: [],
    };
    addCompany(created);
    setNewCompName('');
    setNewCompContact('');
    setNewCompEmail('');
    setIsAddOpen(false);
    setSelectedCompanyId(created.id);
  };

  const totalPipelineUsd = filteredCompanies.reduce(
    (sum, c) => sum + (c.estimatedDealValueUsd || 0),
    0
  );

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md badge-indigo text-[11px] font-medium">
              CRM Pipeline
            </span>
            <span className="text-xs text-zinc-400 tabular-nums">
              {filteredCompanies.length} Active Accounts •{' '}
              <strong className="text-zinc-200">{formatMoney(totalPipelineUsd)}</strong> Total Value
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Contacted Companies & UGC Agencies Pipeline
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Click any row or card to inspect history, send a real email, or log a follow-up touchpoint.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Table vs Kanban Switcher */}
          <div className="flex surface-inset rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'TABLE'
                  ? 'bg-white/[0.09] text-zinc-100 border border-white/10 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-indigo-400" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'KANBAN'
                  ? 'bg-white/[0.09] text-zinc-100 border border-white/10 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Kanban className="w-3.5 h-3.5 text-violet-400" />
              <span>Board</span>
            </button>
          </div>

          <button
            onClick={exportCompaniesCsv}
            className="px-3 py-1.5 rounded-xl btn-secondary-glass text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-1.5 rounded-xl btn-primary-accent text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Brand / Agency</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 rounded-xl surface-inset text-xs">
            {(
              [
                { id: 'ALL', label: `All (${companies.length})` },
                {
                  id: 'AGENCY',
                  label: `Agencies (${companies.filter((c) => c.entityType === 'AGENCY').length})`,
                },
                {
                  id: 'BRAND',
                  label: `Brands (${companies.filter((c) => (c.entityType || 'BRAND') === 'BRAND').length})`,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setEntityFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  entityFilter === tab.id
                    ? 'bg-white/[0.09] text-zinc-100 border border-white/10 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="inline-flex p-1 rounded-xl surface-inset text-xs">
            {(['ALL', 'US', 'KR', 'GLOBAL'] as const).map((reg) => (
              <button
                key={reg}
                onClick={() => setRegionFilter(reg)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  regionFilter === reg
                    ? 'bg-white/[0.09] text-zinc-100 border border-white/10 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, email, or niche..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl input-modern text-xs"
          />
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'TABLE' && (
        <div className="surface-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.07] text-[11px] font-medium text-zinc-400 bg-white/[0.02]">
                  <th className="py-3 px-4">Company / Agency</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 text-right">Est. Value</th>
                  <th className="py-3 px-4">Last Touch</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs">
                {filteredCompanies.map((comp) => {
                  const contact = comp.contacts[0];
                  return (
                    <tr
                      key={comp.id}
                      onClick={() => setSelectedCompanyId(comp.id)}
                      className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-100">{comp.name}</div>
                        <div className="text-[11px] text-zinc-400">
                          {comp.industryNiche} • {comp.region}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${
                            comp.entityType === 'AGENCY' ? 'badge-violet' : 'badge-sky'
                          }`}
                        >
                          {comp.entityType === 'AGENCY' ? 'Agency' : 'Brand'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={comp.outreachStatus}
                          onChange={(e) =>
                            updateCompanyStatus(comp.id, e.target.value as OutreachStatus)
                          }
                          className="px-2.5 py-1 rounded-lg input-modern text-xs"
                        >
                          {PIPELINE_COLUMNS.map((col) => (
                            <option key={col.status} value={col.status}>
                              {col.title}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-zinc-200">{contact?.name || '—'}</div>
                        <div className="text-[11px] text-zinc-500">{contact?.email || ''}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-zinc-100 tabular-nums">
                        {formatMoney(comp.estimatedDealValueUsd)}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">{comp.lastContactedAt || '—'}</td>
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1.5">
                          {contact?.email && (
                            <a
                              href={buildMailtoUrl(
                                contact.email,
                                `${comp.name} x ${ownerProfile.displayName} UGC / On-Camera Collaboration`,
                                `Hi ${contact.name || 'Team'},\n\nFollowing up regarding on-camera acting and UGC ad production for ${comp.name}.\n\nBest,\n${ownerProfile.displayName}`
                              )}
                              title="Send Email"
                              className="p-1.5 rounded-lg btn-secondary-glass"
                            >
                              <Mail className="w-3.5 h-3.5 text-zinc-300" />
                            </a>
                          )}
                          <button
                            onClick={() => onBuildProposalForCompany(comp.id)}
                            title="Open Proposal"
                            className="px-2.5 py-1 rounded-lg btn-secondary-glass text-[11px] font-medium cursor-pointer"
                          >
                            Proposal
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'KANBAN' && (
        <div className="flex gap-3.5 overflow-x-auto pb-4">
          {PIPELINE_COLUMNS.map((col) => {
            const colCompanies = filteredCompanies.filter((c) => c.outreachStatus === col.status);
            const colSum = colCompanies.reduce((s, c) => s + c.estimatedDealValueUsd, 0);

            return (
              <div
                key={col.status}
                className="w-72 shrink-0 surface-card rounded-2xl p-3.5 flex flex-col"
              >
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.07]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                    <span className="text-xs font-semibold text-zinc-200">{col.title}</span>
                    <span className="text-[11px] text-zinc-500 tabular-nums">
                      ({colCompanies.length})
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium tabular-nums ${col.badgeClass}`}>
                    {formatMoney(colSum)}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {colCompanies.map((comp) => (
                    <div
                      key={comp.id}
                      onClick={() => setSelectedCompanyId(comp.id)}
                      className="p-3.5 rounded-xl surface-card-interactive cursor-pointer space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium mb-1 ${
                              comp.entityType === 'AGENCY' ? 'badge-violet' : 'badge-sky'
                            }`}
                          >
                            {comp.entityType === 'AGENCY' ? 'AGENCY' : comp.region} •{' '}
                            {comp.industryNiche}
                          </span>
                          <h4 className="text-xs font-semibold text-zinc-100">
                            {comp.name}
                          </h4>
                        </div>
                        <span className="text-xs font-semibold text-zinc-100 tabular-nums">
                          {formatMoney(comp.estimatedDealValueUsd)}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2">{comp.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SLIDE-OVER DETAIL & EDIT DRAWER */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
          <div className="surface-card border-l border-white/10 w-full max-w-xl h-full overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                      selectedCompany.entityType === 'AGENCY' ? 'badge-violet' : 'badge-sky'
                    }`}
                  >
                    {selectedCompany.entityType === 'AGENCY' ? 'UGC Agency' : 'Brand'}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {selectedCompany.industryNiche} • {selectedCompany.region}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-zinc-100 mt-1">
                  {selectedCompany.name}
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    deleteCompany(selectedCompany.id);
                    setSelectedCompanyId(null);
                  }}
                  title="Delete from Pipeline"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/[0.05] cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedCompanyId(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Pipeline Stage</label>
                <select
                  value={selectedCompany.outreachStatus}
                  onChange={(e) =>
                    updateCompanyStatus(selectedCompany.id, e.target.value as OutreachStatus)
                  }
                  className="w-full px-3 py-2 rounded-xl input-modern text-xs"
                >
                  {PIPELINE_COLUMNS.map((c) => (
                    <option key={c.status} value={c.status}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Estimated Value ($ USD)
                </label>
                <input
                  type="number"
                  value={selectedCompany.estimatedDealValueUsd}
                  onChange={(e) =>
                    updateCompany(selectedCompany.id, {
                      estimatedDealValueUsd: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl input-modern text-xs tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={selectedCompany.contacts[0]?.name || ''}
                  onChange={(e) => {
                    const first = selectedCompany.contacts[0] || {
                      id: 'ct-edit',
                      name: '',
                      roleTitle: 'Partnerships',
                      email: '',
                      preferredLanguage: 'en-US' as const,
                    };
                    updateCompany(selectedCompany.id, {
                      contacts: [{ ...first, name: e.target.value }],
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl input-modern text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={selectedCompany.contacts[0]?.email || ''}
                  onChange={(e) => {
                    const first = selectedCompany.contacts[0] || {
                      id: 'ct-edit',
                      name: '',
                      roleTitle: 'Partnerships',
                      email: '',
                      preferredLanguage: 'en-US' as const,
                    };
                    updateCompany(selectedCompany.id, {
                      contacts: [{ ...first, email: e.target.value }],
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl input-modern text-xs"
                />
              </div>
            </div>

            {/* Notes Editor */}
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Deal & Outreach Notes</label>
              <textarea
                rows={3}
                value={selectedCompany.notes}
                onChange={(e) =>
                  updateCompany(selectedCompany.id, { notes: e.target.value })
                }
                className="w-full p-3 rounded-xl input-modern text-xs"
              />
            </div>

            {/* Real External Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => {
                  const id = selectedCompany.id;
                  setSelectedCompanyId(null);
                  onBuildProposalForCompany(id);
                }}
                className="px-3.5 py-2 rounded-xl btn-primary-accent text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <FileSignature className="w-3.5 h-3.5" />
                <span>Build Proposal</span>
              </button>

              {selectedCompany.contacts[0]?.email && (
                <>
                  <a
                    href={buildMailtoUrl(
                      selectedCompany.contacts[0].email,
                      `${selectedCompany.name} x ${ownerProfile.displayName} UGC / On-Camera Concepts`,
                      `Hi ${selectedCompany.contacts[0].name || 'Team'},\n\nFollowing up with a few custom hook ideas for ${selectedCompany.name}.\n\nBest,\n${ownerProfile.displayName}`
                    )}
                    className="px-3 py-2 rounded-xl btn-secondary-glass text-xs flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Open in Mail</span>
                  </a>

                  <a
                    href={buildGmailComposeUrl(
                      selectedCompany.contacts[0].email,
                      `${selectedCompany.name} x ${ownerProfile.displayName} UGC / On-Camera Concepts`,
                      `Hi ${selectedCompany.contacts[0].name || 'Team'},\n\nFollowing up with a few custom hook ideas for ${selectedCompany.name}.\n\nBest,\n${ownerProfile.displayName}`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl btn-secondary-glass text-xs flex items-center gap-1.5"
                  >
                    <span>Gmail</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>
                </>
              )}

              <a
                href={buildLinkedInPeopleSearchUrl(
                  selectedCompany.name,
                  selectedCompany.contacts[0]?.roleTitle || 'Creative Strategist'
                )}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl btn-secondary-glass text-xs flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span>LinkedIn</span>
              </a>

              <a
                href={buildMetaAdLibraryUrl(selectedCompany.name)}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl btn-secondary-glass text-xs flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 text-zinc-400" />
                <span>Meta Ads</span>
              </a>
            </div>

            {/* Log Outbound Touch */}
            <div className="pt-4 border-t border-white/[0.07] space-y-2.5">
              <div className="text-xs font-semibold text-zinc-200">Log New Pitch / Follow-Up</div>
              <input
                type="text"
                value={outreachSubject}
                onChange={(e) => setOutreachSubject(e.target.value)}
                placeholder="Subject or touchpoint summary..."
                className="w-full px-3 py-2 rounded-xl input-modern text-xs"
              />
              <textarea
                rows={2}
                value={outreachSnippet}
                onChange={(e) => setOutreachSnippet(e.target.value)}
                placeholder="Notes or hook pitched..."
                className="w-full p-2.5 rounded-xl input-modern text-xs"
              />
              <button
                onClick={() => {
                  if (!outreachSubject.trim()) return;
                  logCompanyOutreach(
                    selectedCompany.id,
                    outreachSubject.trim(),
                    outreachSnippet.trim() || 'Logged outreach touchpoint.'
                  );
                  setOutreachSubject('');
                  setOutreachSnippet('');
                }}
                className="px-3.5 py-1.5 rounded-xl btn-secondary-glass text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3 h-3 text-indigo-400" />
                <span>Log Touchpoint</span>
              </button>
            </div>

            {/* Pitch History */}
            <div className="pt-4 border-t border-white/[0.07] space-y-2">
              <div className="text-xs font-semibold text-zinc-200">
                Activity History ({selectedCompany.pitchHistory.length})
              </div>
              {selectedCompany.pitchHistory.map((ph) => (
                <div
                  key={ph.id}
                  className="p-3 rounded-xl surface-inset text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="px-1.5 py-0.5 rounded badge-neutral text-[10px]">
                      {ph.direction} • {ph.channel}
                    </span>
                    <span>{ph.date}</span>
                  </div>
                  <div className="font-medium text-zinc-200">{ph.subject}</div>
                  <div className="text-zinc-400">{ph.snippet}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Brand / Agency Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-100">
                Add Brand or UGC Agency to Pipeline
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomCompany} className="space-y-3">
              <div className="grid grid-cols-2 gap-1.5 p-1 surface-inset rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setNewEntityType('BRAND')}
                  className={`py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    newEntityType === 'BRAND'
                      ? 'bg-white/[0.09] text-zinc-100 border border-white/10 shadow-xs'
                      : 'text-zinc-400 border border-transparent'
                  }`}
                >
                  Direct Brand
                </button>
                <button
                  type="button"
                  onClick={() => setNewEntityType('AGENCY')}
                  className={`py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    newEntityType === 'AGENCY'
                      ? 'bg-white/[0.09] text-zinc-100 border border-white/10 shadow-xs'
                      : 'text-zinc-400 border border-transparent'
                  }`}
                >
                  UGC / Ad Agency
                </button>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  {newEntityType === 'AGENCY' ? 'Agency Name' : 'Brand / Company Name'}
                </label>
                <input
                  type="text"
                  required
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  placeholder={
                    newEntityType === 'AGENCY' ? 'e.g., TubeScience, Vidsy' : 'e.g., Glossier, Anua'
                  }
                  className="w-full px-3 py-2 rounded-xl input-modern text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Vertical / Niche</label>
                  <input
                    type="text"
                    value={newCompNiche}
                    onChange={(e) => setNewCompNiche(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl input-modern text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Region</label>
                  <select
                    value={newCompRegion}
                    onChange={(e) => setNewCompRegion(e.target.value as RegionCode)}
                    className="w-full px-3 py-2 rounded-xl input-modern text-xs"
                  >
                    <option value="US">US</option>
                    <option value="KR">KR</option>
                    <option value="GLOBAL">GLOBAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={newCompContact}
                    onChange={(e) => setNewCompContact(e.target.value)}
                    placeholder="e.g., Sarah Jenkins"
                    className="w-full px-3 py-2 rounded-xl input-modern text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={newCompEmail}
                    onChange={(e) => setNewCompEmail(e.target.value)}
                    placeholder="casting@agency.com"
                    className="w-full px-3 py-2 rounded-xl input-modern text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Estimated Package Value ($ USD)
                </label>
                <input
                  type="number"
                  value={newCompValueUsd}
                  onChange={(e) => setNewCompValueUsd(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl input-modern text-xs tabular-nums"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3.5 py-2 rounded-xl btn-secondary-glass text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl btn-primary-accent text-xs font-medium cursor-pointer"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
