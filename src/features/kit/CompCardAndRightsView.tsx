import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Send,
  Copy,
  Check,
  Edit3,
  Mail,
  ExternalLink,
  X,
} from 'lucide-react';
import { useWorkspace } from '../../store/workspaceStore';
import { InboundMessage, TalentRole } from '../../types/crm';
import {
  buildGmailComposeUrl,
  buildMailtoUrl,
} from '../../services/aiLeadService';

interface CompCardAndRightsViewProps {
  onNavigateToday: () => void;
}

export const CompCardAndRightsView: React.FC<CompCardAndRightsViewProps> = ({
  onNavigateToday,
}) => {
  const {
    workspace,
    ownerProfile,
    usageLicenses,
    formatMoney,
    renewUsageLicense,
    addInboundMessage,
    updateOwnerProfile,
  } = useWorkspace();

  const [copiedKit, setCopiedKit] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Editable Profile & Rate State
  const [editDisplayName, setEditDisplayName] = useState(ownerProfile.displayName);
  const [editHandle, setEditHandle] = useState(ownerProfile.handle);
  const [editHeadline, setEditHeadline] = useState(ownerProfile.headline);
  const [editHeight, setEditHeight] = useState(ownerProfile.compCard.height);
  const [editHair, setEditHair] = useState(ownerProfile.compCard.hair);
  const [editEyes, setEditEyes] = useState(ownerProfile.compCard.eyes);
  const [editWardrobe, setEditWardrobe] = useState(ownerProfile.compCard.wardrobeSizes);
  const [editLocation, setEditLocation] = useState(ownerProfile.compCard.location);
  const [editUnion, setEditUnion] = useState(ownerProfile.compCard.unionStatus);
  const [editSingleUgcUsd, setEditSingleUgcUsd] = useState(
    ownerProfile.rateCard.ugcSingleVideoUsd
  );
  const [editBundleUgcUsd, setEditBundleUgcUsd] = useState(
    ownerProfile.rateCard.ugcThreeBundleUsd
  );
  const [editActorHalfUsd, setEditActorHalfUsd] = useState(
    ownerProfile.rateCard.actorHalfDayUsd
  );
  const [editActorFullUsd, setEditActorFullUsd] = useState(
    ownerProfile.rateCard.actorFullDayUsd
  );
  const [editModelDayUsd, setEditModelDayUsd] = useState(
    ownerProfile.rateCard.modelLookbookDayUsd
  );
  const [editExclusivityUsd, setEditExclusivityUsd] = useState(
    ownerProfile.rateCard.exclusivityMonthlyUsd
  );

  // Public Booking Simulator State
  const [simBrandName, setSimBrandName] = useState('');
  const [simSenderName, setSimSenderName] = useState('');
  const [simSenderEmail, setSimSenderEmail] = useState('');
  const [simRole, setSimRole] = useState<TalentRole>('ACTOR');
  const [simBudgetUsd, setSimBudgetUsd] = useState(2500);
  const [simBrief, setSimBrief] = useState('');
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const openEditModal = () => {
    setEditDisplayName(ownerProfile.displayName);
    setEditHandle(ownerProfile.handle);
    setEditHeadline(ownerProfile.headline);
    setEditHeight(ownerProfile.compCard.height);
    setEditHair(ownerProfile.compCard.hair);
    setEditEyes(ownerProfile.compCard.eyes);
    setEditWardrobe(ownerProfile.compCard.wardrobeSizes);
    setEditLocation(ownerProfile.compCard.location);
    setEditUnion(ownerProfile.compCard.unionStatus);
    setEditSingleUgcUsd(ownerProfile.rateCard.ugcSingleVideoUsd);
    setEditBundleUgcUsd(ownerProfile.rateCard.ugcThreeBundleUsd);
    setEditActorHalfUsd(ownerProfile.rateCard.actorHalfDayUsd);
    setEditActorFullUsd(ownerProfile.rateCard.actorFullDayUsd);
    setEditModelDayUsd(ownerProfile.rateCard.modelLookbookDayUsd);
    setEditExclusivityUsd(ownerProfile.rateCard.exclusivityMonthlyUsd);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateOwnerProfile({
      displayName: editDisplayName.trim() || ownerProfile.displayName,
      handle: editHandle.trim() || ownerProfile.handle,
      headline: editHeadline.trim() || ownerProfile.headline,
      compCard: {
        height: editHeight.trim(),
        hair: editHair.trim(),
        eyes: editEyes.trim(),
        wardrobeSizes: editWardrobe.trim(),
        location: editLocation.trim(),
        unionStatus: editUnion.trim(),
      },
      rateCard: {
        ...ownerProfile.rateCard,
        ugcSingleVideoUsd: Number(editSingleUgcUsd) || 450,
        ugcThreeBundleUsd: Number(editBundleUgcUsd) || 1200,
        actorHalfDayUsd: Number(editActorHalfUsd) || 950,
        actorFullDayUsd: Number(editActorFullUsd) || 1800,
        modelLookbookDayUsd: Number(editModelDayUsd) || 1600,
        exclusivityMonthlyUsd: Number(editExclusivityUsd) || 800,
      },
    });
    setIsEditingProfile(false);
  };

  const handleCopyCompCardSummary = () => {
    const summary = `${ownerProfile.displayName} (${ownerProfile.handle})
${ownerProfile.headline}

COMP CARD SPECS:
• Height: ${ownerProfile.compCard.height}
• Hair / Eyes: ${ownerProfile.compCard.hair} / ${ownerProfile.compCard.eyes}
• Wardrobe: ${ownerProfile.compCard.wardrobeSizes}
• Base Locations: ${ownerProfile.compCard.location}
• Status: ${ownerProfile.compCard.unionStatus}

STANDARD RATE CARD:
• Single UGC Ad Concept: $${ownerProfile.rateCard.ugcSingleVideoUsd.toLocaleString()}
• 3-Video UGC Ad Bundle: $${ownerProfile.rateCard.ugcThreeBundleUsd.toLocaleString()}
• Actor Half-Day Principal: $${ownerProfile.rateCard.actorHalfDayUsd.toLocaleString()}
• Actor Full-Day Principal: $${ownerProfile.rateCard.actorFullDayUsd.toLocaleString()}
• Model Lookbook Day: $${ownerProfile.rateCard.modelLookbookDayUsd.toLocaleString()}
• Category Exclusivity: +$${ownerProfile.rateCard.exclusivityMonthlyUsd.toLocaleString()}/mo`;

    navigator.clipboard.writeText(summary);
    setCopiedKit(true);
    setTimeout(() => setCopiedKit(false), 1800);
  };

  const handleSimulatePublicBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simBrandName.trim()) return;

    const msg: InboundMessage = {
      id: `inb-portal-${Date.now()}`,
      workspaceId: workspace.id,
      brandName: simBrandName.trim(),
      industryNiche: 'Direct Portal Inquiry',
      region: 'GLOBAL',
      channel: 'BOOKING_PORTAL',
      category:
        simRole === 'ACTOR'
          ? 'CASTING_CALL'
          : simRole === 'MODEL'
          ? 'MODEL_BOOKING'
          : 'UGC_BRIEF',
      senderName: simSenderName || 'Casting & Brand Producer',
      senderTitle: 'Brand Partnerships Lead',
      senderHandleOrEmail:
        simSenderEmail ||
        `booking@${simBrandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      subject: `Direct Media Kit Booking: ${simBrandName} (${simRole.replace('_', ' ')})`,
      rawMessage:
        simBrief ||
        `Submitted via Public Comp Card & Media Kit: Requesting ${simRole} booking at $${simBudgetUsd.toLocaleString()} budget.`,
      aiSummary: `Direct booking inquiry via your Media Kit Portal from ${simBrandName} ($${simBudgetUsd.toLocaleString()}).`,
      detectedBudgetUsd: Number(simBudgetUsd) || 2000,
      nativeCurrency: workspace.baseCurrency,
      nativeBudgetAmount:
        workspace.baseCurrency === 'KRW'
          ? (Number(simBudgetUsd) || 2000) * workspace.usdToKrwRate
          : Number(simBudgetUsd) || 2000,
      goalAlignmentScore: 95,
      goalAlignmentReason: `Direct portal booking at $${Number(
        simBudgetUsd
      ).toLocaleString()} advances your monthly revenue target.`,
      urgency: 'HIGH_TODAY',
      requiresActionToday: true,
      status: 'UNREAD_TODAY',
      receivedAt: 'Today, Just now',
      targetTalentRole: simRole,
    };

    addInboundMessage(msg, true);
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      onNavigateToday();
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Digital Comp Card & Rate Card Header */}
      <div className="p-6 rounded-2xl surface-card space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={ownerProfile.avatarUrl}
              alt={ownerProfile.displayName}
              className="w-20 h-20 rounded-2xl object-cover border border-white/15 shadow-md"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-md badge-emerald">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Comp Card & Rate Sheet
                </span>
                <span className="text-xs text-zinc-400">
                  {ownerProfile.handle}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
                {ownerProfile.displayName}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 max-w-2xl">
                {ownerProfile.headline}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                {ownerProfile.languages.map((lang) => (
                  <span
                    key={lang}
                    className="text-[11px] px-2 py-0.5 rounded-md badge-sky"
                  >
                    Language: {lang}
                  </span>
                ))}
                <span className="text-[11px] px-2 py-0.5 rounded-md badge-violet">
                  {ownerProfile.compCard.unionStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleCopyCompCardSummary}
              className="px-3.5 py-2 rounded-xl btn-secondary-glass text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedKit ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Comp Card Text</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy Comp Card & Rates</span>
                </>
              )}
            </button>
            <button
              onClick={openEditModal}
              className="px-3.5 py-2 rounded-xl btn-primary-accent text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile & Rates</span>
            </button>
          </div>
        </div>

        {/* Physical Comp Card Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.07] text-xs">
          <div className="p-3.5 rounded-xl surface-inset">
            <span className="text-[11px] text-zinc-500 block">Height</span>
            <span className="text-zinc-100 font-medium mt-0.5 block">
              {ownerProfile.compCard.height}
            </span>
          </div>
          <div className="p-3.5 rounded-xl surface-inset">
            <span className="text-[11px] text-zinc-500 block">Hair / Eyes</span>
            <span className="text-zinc-100 font-medium mt-0.5 block">
              {ownerProfile.compCard.hair} / {ownerProfile.compCard.eyes}
            </span>
          </div>
          <div className="p-3.5 rounded-xl surface-inset">
            <span className="text-[11px] text-zinc-500 block">Wardrobe & Sizing</span>
            <span className="text-zinc-100 font-medium mt-0.5 block">
              {ownerProfile.compCard.wardrobeSizes}
            </span>
          </div>
          <div className="p-3.5 rounded-xl surface-inset">
            <span className="text-[11px] text-zinc-500 block">Base Locations</span>
            <span className="text-zinc-100 font-medium mt-0.5 block">
              {ownerProfile.compCard.location}
            </span>
          </div>
        </div>

        {/* Standard Rate Card Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          <div className="p-3.5 rounded-xl surface-inset">
            <span className="text-[11px] text-zinc-400 block">Single UGC Ad</span>
            <span className="text-sm font-semibold text-zinc-100 tabular-nums mt-0.5 block">
              {formatMoney(ownerProfile.rateCard.ugcSingleVideoUsd)}
            </span>
          </div>
          <div className="p-3.5 rounded-xl surface-card-featured">
            <span className="text-[11px] text-indigo-300 block">3-Video Bundle</span>
            <span className="text-sm font-semibold text-zinc-100 tabular-nums mt-0.5 block">
              {formatMoney(ownerProfile.rateCard.ugcThreeBundleUsd)}
            </span>
          </div>
          <div className="p-3.5 rounded-xl surface-inset">
            <span className="text-[11px] text-zinc-400 block">Actor Half-Day</span>
            <span className="text-sm font-semibold text-zinc-100 tabular-nums mt-0.5 block">
              {formatMoney(ownerProfile.rateCard.actorHalfDayUsd)}
            </span>
          </div>
          <div className="p-3.5 rounded-xl surface-inset">
            <span className="text-[11px] text-zinc-400 block">Actor Full-Day</span>
            <span className="text-sm font-semibold text-zinc-100 tabular-nums mt-0.5 block">
              {formatMoney(ownerProfile.rateCard.actorFullDayUsd)}
            </span>
          </div>
          <div className="p-3.5 rounded-xl surface-inset">
            <span className="text-[11px] text-zinc-400 block">Model Lookbook Day</span>
            <span className="text-sm font-semibold text-zinc-100 tabular-nums mt-0.5 block">
              {formatMoney(ownerProfile.rateCard.modelLookbookDayUsd)}
            </span>
          </div>
          <div className="p-3.5 rounded-xl surface-inset">
            <span className="text-[11px] text-zinc-400 block">Exclusivity / Mo</span>
            <span className="text-sm font-semibold text-emerald-300 tabular-nums mt-0.5 block">
              +{formatMoney(ownerProfile.rateCard.exclusivityMonthlyUsd)}
            </span>
          </div>
        </div>
      </div>

      {/* Two Columns: Left = Usage Rights & Whitelisting Vault, Right = Inbound Booking Portal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Usage Rights, Whitelisting & Exclusivity Vault */}
        <div className="lg:col-span-7 p-6 rounded-2xl surface-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Ad Usage Rights, Whitelisting & Exclusivity Vault</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Track 30/60/90-day paid ad usage licenses so brands pay renewal fees when your likeness stays live in their paid ads.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {usageLicenses.map((lic) => {
              const renewalSubject = `Ad Usage Rights Renewal Notice: ${lic.campaignTitle} (${lic.brandName})`;
              const renewalBody = `Hi ${lic.brandName} Team,\n\nQuick heads up that the paid ad usage license (${lic.usageType.replace(
                /_/g,
                ' '
              )}) for "${lic.campaignTitle}" is scheduled to expire on ${
                lic.expiresOn
              } (${lic.daysRemaining} days remaining).\n\nIf you plan to keep these creatives running in paid media or whitelisting for another 60 days, the renewal rate is $${lic.renewalFeeUsd.toLocaleString()} USD. Please let me know if I should send over the 60-day extension invoice or if your media team will be rotating the ads off by ${
                lic.expiresOn
              }.\n\nBest,\n${ownerProfile.displayName}`;

              return (
                <div
                  key={lic.id}
                  className="p-4 rounded-xl surface-card-interactive flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-zinc-100">
                        {lic.brandName}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-md tabular-nums ${
                          lic.status === 'EXPIRING_SOON'
                            ? 'badge-amber'
                            : 'badge-emerald'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            lic.status === 'EXPIRING_SOON'
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                        {lic.status === 'EXPIRING_SOON'
                          ? `Expires in ${lic.daysRemaining}d`
                          : `Active (${lic.daysRemaining}d left)`}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300">{lic.campaignTitle}</p>
                    <p className="text-[11px] text-zinc-500 tabular-nums">
                      License: {lic.usageType.replace(/_/g, ' ')} • Expires: {lic.expiresOn}
                    </p>
                    {lic.exclusivityCategory && (
                      <p className="text-[11px] text-indigo-300">
                        Exclusivity Clause: {lic.exclusivityCategory}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:items-end justify-between gap-2 shrink-0">
                    <span className="text-sm font-semibold text-zinc-100 tabular-nums">
                      +{formatMoney(lic.renewalFeeUsd)} / 60d
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <a
                        href={buildMailtoUrl('', renewalSubject, renewalBody)}
                        className="px-2.5 py-1.5 rounded-xl btn-secondary-glass text-[11px] font-medium flex items-center gap-1 transition"
                        title="Email Renewal Notice via Mail App"
                      >
                        <Mail className="w-3 h-3 text-zinc-400" />
                        <span>Email Notice</span>
                      </a>
                      <a
                        href={buildGmailComposeUrl('', renewalSubject, renewalBody)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-xl btn-secondary-glass text-[11px] font-medium flex items-center gap-1 transition"
                        title="Open Renewal Notice in Gmail"
                      >
                        <span>Gmail</span>
                        <ExternalLink className="w-3 h-3 text-zinc-400" />
                      </a>
                      {lic.status === 'EXPIRING_SOON' ? (
                        <button
                          onClick={() => renewUsageLicense(lic.id)}
                          className="px-2.5 py-1.5 rounded-xl btn-primary-accent font-semibold text-[11px] transition cursor-pointer"
                        >
                          Extend +60d
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 flex items-center gap-1 px-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Licensed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Public Inbound Booking Form Simulator */}
        <div className="lg:col-span-5 p-6 rounded-2xl surface-card space-y-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-md badge-sky">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Inbound Intake Form
            </span>
            <h3 className="text-base font-semibold text-zinc-100 mt-2">
              Direct Booking & Sponsorship Intake
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Log or simulate a brand inquiry from your public Media Kit link—sending it directly into your <strong>Today Inbox</strong>.
            </p>
          </div>

          {bookingSubmitted ? (
            <div className="p-6 rounded-xl surface-inset text-center space-y-2">
              <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-zinc-100">
                Inquiry Added to Your Today Inbox
              </p>
              <p className="text-xs text-zinc-400">
                Opening Today view...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSimulatePublicBooking} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Brand / Agency Name</label>
                <input
                  type="text"
                  value={simBrandName}
                  onChange={(e) => setSimBrandName(e.target.value)}
                  placeholder="e.g., Dyson, Olive Young, TubeScience"
                  className="w-full px-3 py-2 rounded-xl input-modern"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Booking Role</label>
                  <select
                    value={simRole}
                    onChange={(e) => setSimRole(e.target.value as TalentRole)}
                    className="w-full px-3 py-2 rounded-xl input-modern"
                  >
                    <option value="ACTOR">On-Camera Actor</option>
                    <option value="MODEL">Commercial Model</option>
                    <option value="UGC_CREATOR">UGC Ad Creator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Proposed Budget (USD)</label>
                  <input
                    type="number"
                    value={simBudgetUsd}
                    onChange={(e) => setSimBudgetUsd(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl input-modern tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={simSenderName}
                    onChange={(e) => setSimSenderName(e.target.value)}
                    placeholder="e.g., Claire Song"
                    className="w-full px-3 py-2 rounded-xl input-modern"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Work Email</label>
                  <input
                    type="email"
                    value={simSenderEmail}
                    onChange={(e) => setSimSenderEmail(e.target.value)}
                    placeholder="claire@brand.com"
                    className="w-full px-3 py-2 rounded-xl input-modern"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Campaign / Shoot Brief</label>
                <textarea
                  rows={2}
                  value={simBrief}
                  onChange={(e) => setSimBrief(e.target.value)}
                  placeholder="Describe shoot dates, UGC deliverables, or usage rights..."
                  className="w-full px-3 py-2 rounded-xl input-modern"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl btn-primary-accent font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Inquiry to Today Inbox</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Edit Comp Card & Rates Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-100">
                Edit Comp Card Specs & Standard Rates
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-zinc-400 hover:text-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Display / Stage Name</label>
                  <input
                    type="text"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl input-modern"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Social Handle</label>
                  <input
                    type="text"
                    value={editHandle}
                    onChange={(e) => setEditHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl input-modern"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Bio / Headline</label>
                <input
                  type="text"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl input-modern"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Height</label>
                  <input
                    type="text"
                    value={editHeight}
                    onChange={(e) => setEditHeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl input-modern"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Hair</label>
                  <input
                    type="text"
                    value={editHair}
                    onChange={(e) => setEditHair(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl input-modern"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Eyes</label>
                  <input
                    type="text"
                    value={editEyes}
                    onChange={(e) => setEditEyes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl input-modern"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Wardrobe Sizes</label>
                  <input
                    type="text"
                    value={editWardrobe}
                    onChange={(e) => setEditWardrobe(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl input-modern"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Base Locations</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl input-modern"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Union / Rep Status</label>
                  <input
                    type="text"
                    value={editUnion}
                    onChange={(e) => setEditUnion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl input-modern"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.07]">
                <span className="text-xs font-semibold text-zinc-200 block mb-2">
                  Base Rate Card (USD)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Single UGC Video ($)</label>
                    <input
                      type="number"
                      value={editSingleUgcUsd}
                      onChange={(e) => setEditSingleUgcUsd(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl input-modern tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">3-Video Bundle ($)</label>
                    <input
                      type="number"
                      value={editBundleUgcUsd}
                      onChange={(e) => setEditBundleUgcUsd(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl input-modern tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Actor Half-Day ($)</label>
                    <input
                      type="number"
                      value={editActorHalfUsd}
                      onChange={(e) => setEditActorHalfUsd(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl input-modern tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Actor Full-Day ($)</label>
                    <input
                      type="number"
                      value={editActorFullUsd}
                      onChange={(e) => setEditActorFullUsd(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl input-modern tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Model Lookbook ($)</label>
                    <input
                      type="number"
                      value={editModelDayUsd}
                      onChange={(e) => setEditModelDayUsd(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl input-modern tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Exclusivity / Mo ($)</label>
                    <input
                      type="number"
                      value={editExclusivityUsd}
                      onChange={(e) => setEditExclusivityUsd(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl input-modern tabular-nums"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl btn-secondary-glass cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl btn-primary-accent font-semibold cursor-pointer"
                >
                  Save Comp Card & Rates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
