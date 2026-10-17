import React, { useState } from 'react';
import {
  Inbox,
  Compass,
  Kanban,
  FileSignature,
  ShieldCheck,
  Users,
  Plus,
  Building2,
  UserCheck,
  RotateCcw,
  X,
  CheckCircle2,
  Settings,
  Download,
  Trash2,
} from 'lucide-react';
import { useWorkspace } from '../../store/workspaceStore';
import { parseSmartInboundPaste } from '../../services/aiLeadService';
import { InboundChannel } from '../../types/crm';

export type NavTabId = 'today' | 'leads' | 'pipeline' | 'proposals' | 'kit' | 'agency';

interface AppShellProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  onOpenProposalForCompany: (companyId: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onSelectTab,
  children,
}) => {
  const {
    workspace,
    ownerProfile,
    inboundMessages,
    companies,
    usageLicenses,
    creatorGoal,
    setWorkspaceMode,
    setBaseCurrency,
    formatMoney,
    addInboundMessage,
    updateOwnerProfile,
    updateCreatorGoal,
    clearToBlankWorkspace,
    exportCompaniesCsv,
    resetDemoData,
  } = useWorkspace();

  const [isSmartPasteOpen, setIsSmartPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [pasteBrandHint, setPasteBrandHint] = useState('');
  const [pasteChannel, setPasteChannel] = useState<InboundChannel>('EMAIL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile & Goal Settings Modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editName, setEditName] = useState(ownerProfile.displayName);
  const [editHandle, setEditHandle] = useState(ownerProfile.handle);
  const [editHeadline, setEditHeadline] = useState(ownerProfile.headline);
  const [editLocation, setEditLocation] = useState(ownerProfile.compCard.location);
  const [editSingleRate, setEditSingleRate] = useState(
    String(ownerProfile.rateCard.ugcSingleVideoUsd)
  );
  const [editGoalTarget, setEditGoalTarget] = useState(String(creatorGoal.targetRevenueUsd));
  const [editMinFloor, setEditMinFloor] = useState(String(creatorGoal.minProjectRateUsd));

  const openSettingsModal = () => {
    setEditName(ownerProfile.displayName);
    setEditHandle(ownerProfile.handle);
    setEditHeadline(ownerProfile.headline);
    setEditLocation(ownerProfile.compCard.location);
    setEditSingleRate(String(ownerProfile.rateCard.ugcSingleVideoUsd));
    setEditGoalTarget(String(creatorGoal.targetRevenueUsd));
    setEditMinFloor(String(creatorGoal.minProjectRateUsd));
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const singleUsd = Math.max(50, Number(editSingleRate) || 450);
    updateOwnerProfile({
      displayName: editName.trim() || ownerProfile.displayName,
      handle: editHandle.trim() || ownerProfile.handle,
      headline: editHeadline.trim() || ownerProfile.headline,
      compCard: {
        ...ownerProfile.compCard,
        location: editLocation.trim() || ownerProfile.compCard.location,
      },
      rateCard: {
        ...ownerProfile.rateCard,
        ugcSingleVideoUsd: singleUsd,
        ugcThreeBundleUsd: Math.round(singleUsd * 2.65),
      },
    });
    updateCreatorGoal({
      targetRevenueUsd: Math.max(500, Number(editGoalTarget) || 12000),
      minProjectRateUsd: Math.max(50, Number(editMinFloor) || 450),
    });
    setIsSettingsOpen(false);
    setToastMessage('Updated your profile, rates, and monthly revenue goal.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const unreadTodayCount = inboundMessages.filter((m) => m.status === 'UNREAD_TODAY').length;
  const expiringRightsCount = usageLicenses.filter((l) => l.status === 'EXPIRING_SOON').length;
  const goalPct =
    creatorGoal.targetRevenueUsd > 0
      ? Math.min(100, Math.round((creatorGoal.currentBookedUsd / creatorGoal.targetRevenueUsd) * 100))
      : 0;

  const navItems: {
    id: NavTabId;
    label: string;
    shortLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeTone?: string;
    dotColor?: string;
  }[] = [
    {
      id: 'today',
      label: 'Today & Inbox',
      shortLabel: 'Today',
      icon: Inbox,
      badge: unreadTodayCount > 0 ? unreadTodayCount : undefined,
      badgeTone: 'badge-amber',
      dotColor: 'bg-amber-400',
    },
    {
      id: 'leads',
      label: 'Lead Gen Hub',
      shortLabel: 'Find Leads',
      icon: Compass,
      badge: '4 Channels',
      badgeTone: 'badge-emerald',
      dotColor: 'bg-emerald-400',
    },
    {
      id: 'pipeline',
      label: 'Contacted & Pipeline',
      shortLabel: 'Pipeline',
      icon: Kanban,
      badge: companies.length,
      badgeTone: 'badge-indigo',
    },
    {
      id: 'proposals',
      label: 'Proposals & Rates',
      shortLabel: 'Proposals',
      icon: FileSignature,
    },
    {
      id: 'kit',
      label: 'Comp Card & Rights',
      shortLabel: 'Comp & Rights',
      icon: ShieldCheck,
      badge: expiringRightsCount > 0 ? expiringRightsCount : undefined,
      badgeTone: 'badge-amber',
      dotColor: 'bg-amber-400',
    },
    {
      id: 'agency',
      label: 'Agency Roster',
      shortLabel: 'Roster',
      icon: Users,
      badge: workspace.mode === 'AGENCY' ? 'Active' : undefined,
      badgeTone: 'badge-violet',
      dotColor: 'bg-violet-400',
    },
  ];

  const handleSmartInboundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteText.trim()) return;
    const parsed = parseSmartInboundPaste({
      rawText: pasteText,
      brandNameHint: pasteBrandHint,
      channel: pasteChannel,
      workspaceId: workspace.id,
      goal: creatorGoal,
      usdToKrwRate: workspace.usdToKrwRate,
    });
    addInboundMessage(parsed, true);
    setPasteText('');
    setPasteBrandHint('');
    setIsSmartPasteOpen(false);
    setToastMessage(
      `Added "${parsed.brandName}" (${parsed.goalAlignmentScore}% Fit) to Today Inbox & Pipeline.`
    );
    setTimeout(() => setToastMessage(null), 4000);
    onSelectTab('today');
  };

  return (
    <div className="min-h-screen ambient-canvas text-zinc-100 flex flex-col lg:flex-row">
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-white/[0.075] bg-[#0B0C13]/90 backdrop-blur-xl shrink-0 select-none">
        {/* Brand Identity */}
        <div className="p-4 border-b border-white/[0.075]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src="/vanguard-icon.svg" alt="" className="w-7 h-7 rounded-lg shadow-md shadow-indigo-500/25" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold tracking-tight text-sm text-zinc-50">
                    Vanguard
                  </span>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                      workspace.mode === 'SOLO' ? 'badge-indigo' : 'badge-violet'
                    }`}
                  >
                    {workspace.mode === 'SOLO' ? 'Solo' : 'Agency'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">Actor • Model • UGC CRM</p>
              </div>
            </div>
            <button
              onClick={openSettingsModal}
              title="Edit Profile, Rates & Workspace Data"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Solo vs Agency Mode Switcher */}
          <div className="mt-3.5 grid grid-cols-2 gap-1 p-1 surface-inset rounded-lg text-xs">
            <button
              onClick={() => setWorkspaceMode('SOLO')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-medium transition-all ${
                workspace.mode === 'SOLO'
                  ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/35 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Solo Studio</span>
            </button>
            <button
              onClick={() => {
                setWorkspaceMode('AGENCY');
                onSelectTab('agency');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-medium transition-all ${
                workspace.mode === 'AGENCY'
                  ? 'bg-violet-500/20 text-violet-200 border border-violet-500/35 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Agency Mode</span>
            </button>
          </div>
        </div>

        {/* Primary Action: Log Inbound */}
        <div className="px-3 pt-3.5">
          <button
            onClick={() => setIsSmartPasteOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg btn-primary-accent text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Inbound DM / Email</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2.5 py-3.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-500/[0.12] text-white border border-indigo-500/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-indigo-400" />
                )}
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-indigo-400' : 'text-zinc-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md tabular-nums ${
                      item.badgeTone || 'badge-neutral'
                    }`}
                  >
                    {item.dotColor && (
                      <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`} />
                    )}
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Dimensional Goal Tracker Card */}
        <div className="p-3.5 m-3 rounded-xl surface-card">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-zinc-300 font-medium truncate">{creatorGoal.periodLabel}</span>
            <span className="text-emerald-300 font-semibold tabular-nums">{goalPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-950/90 rounded-full overflow-hidden border border-white/[0.05]">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${goalPct}%` }}
            />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xs font-semibold text-zinc-100 tabular-nums">
              {formatMoney(creatorGoal.currentBookedUsd)}
            </span>
            <span className="text-[11px] text-zinc-400 tabular-nums">
              of {formatMoney(creatorGoal.targetRevenueUsd)}
            </span>
          </div>
        </div>

        {/* Talent Profile Footer */}
        <div className="p-3.5 border-t border-white/[0.075] flex items-center justify-between gap-2">
          <button
            onClick={openSettingsModal}
            className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-90 transition-opacity"
          >
            <img
              src={ownerProfile.avatarUrl}
              alt={ownerProfile.displayName}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-400/35"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-zinc-100 truncate">
                {ownerProfile.displayName}
              </p>
              <p className="text-[11px] text-zinc-400 truncate">{ownerProfile.handle}</p>
            </div>
          </button>
          <button
            onClick={openSettingsModal}
            title="Workspace & Profile Settings"
            className="px-2 py-1 rounded-md text-[11px] btn-secondary-glass"
          >
            Edit
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 surface-glass border-b border-white/[0.075] px-4 lg:px-8 py-3 flex items-center justify-between gap-3">
          {/* Mobile Brand */}
          <div className="flex items-center gap-2 lg:hidden">
            <img src="/vanguard-icon.svg" alt="" className="w-7 h-7 rounded-lg shadow-sm shadow-indigo-500/30" />
            <span className="font-semibold text-sm text-zinc-100">Vanguard</span>
          </div>

          {/* Desktop Context Info */}
          <div className="hidden lg:flex items-center gap-2.5 text-xs text-zinc-400">
            <span className="text-zinc-100 font-medium">{ownerProfile.displayName}</span>
            <span className="text-zinc-700">•</span>
            <span>
              Base UGC Rate:{' '}
              <strong className="text-emerald-300 font-semibold tabular-nums">
                {formatMoney(ownerProfile.rateCard.ugcSingleVideoUsd)}
              </strong>
            </span>
            <span className="text-zinc-700">•</span>
            <div className="flex items-center gap-1.5">
              {ownerProfile.roles.map((r, idx) => (
                <span
                  key={r}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                    idx === 0
                      ? 'badge-indigo'
                      : idx === 1
                      ? 'badge-violet'
                      : 'badge-sky'
                  }`}
                >
                  {r.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Currency Switcher ($ USD / ₩ KRW) */}
            <div className="flex items-center surface-inset rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setBaseCurrency('USD')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  workspace.baseCurrency === 'USD'
                    ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/35'
                    : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                $ USD
              </button>
              <button
                onClick={() => setBaseCurrency('KRW')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  workspace.baseCurrency === 'KRW'
                    ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/35'
                    : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                ₩ KRW
              </button>
            </div>

            <button
              onClick={exportCompaniesCsv}
              title="Export CRM Pipeline to CSV"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg btn-secondary-glass text-xs"
            >
              <Download className="w-3.5 h-3.5 text-indigo-300" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={openSettingsModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg btn-secondary-glass text-xs"
            >
              <Settings className="w-3.5 h-3.5 text-zinc-300" />
              <span className="hidden sm:inline">My Profile & Data</span>
            </button>

            <button
              onClick={() => setIsSmartPasteOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-primary-accent font-medium text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Inbound</span>
            </button>
          </div>
        </header>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="mx-4 lg:mx-8 mt-4 p-3 rounded-xl surface-card border-emerald-500/30 text-zinc-100 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-zinc-400 hover:text-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Active View Content */}
        <main className="flex-1 px-4 lg:px-8 py-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 surface-glass border-t border-white/[0.08] px-2 py-1.5 grid grid-cols-6 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors ${
                isActive
                  ? 'text-indigo-200 bg-indigo-500/15 border border-indigo-500/30'
                  : 'text-zinc-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] mt-1 font-medium truncate max-w-full px-1">
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Smart Inbound Log Modal */}
      {isSmartPasteOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-zinc-100">
                Log Inbound DM, Email, or Casting Inquiry
              </h3>
              <button
                onClick={() => setIsSmartPasteOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Paste any raw email, Instagram DM, KakaoTalk message, or casting brief. Vanguard extracts the company, budget, role type, and adds it to your Today inbox and CRM pipeline.
            </p>
            <form onSubmit={handleSmartInboundSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1 font-medium">
                    Company / Agency Name
                  </label>
                  <input
                    type="text"
                    value={pasteBrandHint}
                    onChange={(e) => setPasteBrandHint(e.target.value)}
                    placeholder="e.g., Sulwhasoo, TubeScience, Notion"
                    className="w-full px-3 py-2 rounded-lg input-modern text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1 font-medium">
                    Inbound Channel
                  </label>
                  <select
                    value={pasteChannel}
                    onChange={(e) => setPasteChannel(e.target.value as InboundChannel)}
                    className="w-full px-3 py-2 rounded-lg input-modern text-xs"
                  >
                    <option value="EMAIL">Email Inquiry</option>
                    <option value="IG_DM">Instagram DM</option>
                    <option value="TIKTOK">TikTok Creator Inbox</option>
                    <option value="KAKAOTALK">KakaoTalk / Agency Line</option>
                    <option value="CASTING_BOARD">Casting Call / Backstage</option>
                    <option value="BOOKING_PORTAL">Public Media Kit Portal</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-zinc-300 font-medium">
                    Raw Message / Brief Content
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setPasteBrandHint('Laneige Global Studio');
                      setPasteChannel('EMAIL');
                      setPasteText(
                        'Hi! We are casting a bilingual on-camera actor/creator for our Water Bank Cream Q4 campaign in US & Korea. Looking for 3 spoken-word UGC videos + 1 half-day commercial studio shoot with 60 days Meta whitelisting. Budget is ₩3,800,000 ($2,750 USD). Can you send a proposal today?'
                      );
                    }}
                    className="text-[11px] text-indigo-300 hover:text-indigo-200 hover:underline"
                  >
                    Fill Sample Email
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="Paste the brand or agency message here..."
                  className="w-full px-3 py-2 rounded-lg input-modern text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSmartPasteOpen(false)}
                  className="px-3.5 py-2 rounded-lg btn-secondary-glass text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg btn-primary-accent font-medium text-xs"
                >
                  Add to Today Inbox & CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile, Goal & Workspace Data Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card rounded-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="text-base font-semibold text-zinc-100">
                  Studio Profile, Rates & Workspace Data
                </h3>
                <p className="text-xs text-zinc-400">
                  Customize your name, handle, rates, and monthly revenue goal—or clear demo data to start fresh.
                </p>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Your Name / Studio Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg input-modern text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Social Handle</label>
                  <input
                    type="text"
                    value={editHandle}
                    onChange={(e) => setEditHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg input-modern text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Role & Bio Headline</label>
                <input
                  type="text"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg input-modern text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">
                    Base Single UGC Rate ($ USD)
                  </label>
                  <input
                    type="number"
                    value={editSingleRate}
                    onChange={(e) => setEditSingleRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg input-modern text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">
                    Monthly Goal Target ($ USD)
                  </label>
                  <input
                    type="number"
                    value={editGoalTarget}
                    onChange={(e) => setEditGoalTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg input-modern text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">
                    Min Project Floor ($ USD)
                  </label>
                  <input
                    type="number"
                    value={editMinFloor}
                    onChange={(e) => setEditMinFloor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg input-modern text-xs tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Base Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg input-modern text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-3.5 py-2 rounded-lg btn-secondary-glass text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg btn-primary-accent text-xs font-medium"
                >
                  Save Profile & Goal
                </button>
              </div>
            </form>

            {/* Real Workspace Data Management */}
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <div className="text-xs font-medium text-zinc-300">Workspace Data Controls</div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clearToBlankWorkspace();
                    setIsSettingsOpen(false);
                    setToastMessage(
                      'Cleared all demo messages & companies. Your workspace is now a clean slate!'
                    );
                    setTimeout(() => setToastMessage(null), 4000);
                  }}
                  className="px-3 py-2 rounded-lg badge-rose hover:opacity-90 text-xs flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Start Fresh (Clear Demo Data)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetDemoData();
                    setIsSettingsOpen(false);
                    setToastMessage('Restored default sample data.');
                    setTimeout(() => setToastMessage(null), 3500);
                  }}
                  className="px-3 py-2 rounded-lg btn-secondary-glass text-xs flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Sample Data</span>
                </button>

                <button
                  type="button"
                  onClick={exportCompaniesCsv}
                  className="px-3 py-2 rounded-lg btn-secondary-glass text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Pipeline CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
