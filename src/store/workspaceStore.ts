import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Workspace,
  TalentProfile,
  CreatorGoal,
  BrandCompany,
  InboundMessage,
  ProposalPackage,
  UsageRightsLicense,
  AgencyBrandBrief,
  CurrencyCode,
  WorkspaceMode,
  OutreachStatus,
  UgcPlatformChannel,
  PlatformApplicationStatus,
} from '../types/crm';
import { INITIAL_UGC_PLATFORMS } from '../services/aiLeadService';

export const INITIAL_WORKSPACE: Workspace = {
  id: 'ws-vanguard-01',
  name: 'Vanguard Personal Studio',
  agencyName: 'Vanguard Talent & UGC Collective',
  mode: 'SOLO',
  baseCurrency: 'USD',
  usdToKrwRate: 1380,
  defaultAgencyCommissionPct: 20,
};

export const INITIAL_TALENT_PROFILES: TalentProfile[] = [
  {
    id: 'talent-owner-01',
    workspaceId: 'ws-vanguard-01',
    isOwner: true,
    displayName: 'Lead Talent (You)',
    handle: '@vanguard.talent',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    headline: 'Bilingual On-Camera Actor, Commercial Model & Direct-Response UGC Creator',
    roles: ['ACTOR', 'MODEL', 'UGC_CREATOR'],
    languages: ['EN', 'KO'],
    niches: ['K-Beauty & Skincare', 'AI & Consumer Tech', 'Luxury Lifestyle', 'Fitness & Wellness'],
    compCard: {
      height: '178 cm / 5\'10"',
      hair: 'Dark Espresso',
      eyes: 'Dark Brown',
      wardrobeSizes: 'Top M / Jacket 38R / Shoe 270mm (US 9)',
      location: 'Seoul & Los Angeles (Global Remote Studio)',
      unionStatus: 'SAG-AFTRA Fi-Core / Global Commercial Eligible',
    },
    rateCard: {
      ugcSingleVideoUsd: 450,
      ugcThreeBundleUsd: 1200,
      actorHalfDayUsd: 1100,
      actorFullDayUsd: 2000,
      modelLookbookDayUsd: 1600,
      whitelisting30DayPct: 30,
      exclusivityMonthlyUsd: 800,
    },
    portfolioHighlights: [
      {
        id: 'ph-1',
        title: 'Founder-Style Problem/Solution Ad (3.4x ROAS)',
        brand: 'Anua Global Skincare',
        roleType: 'UGC_CREATOR',
        metricOrResult: '3.4x Paid Social ROAS • 48% 3-Sec Hook Retention',
        thumbnailTag: 'Spoken-Word EN/KO Hook',
      },
      {
        id: 'ph-2',
        title: 'Hero Commercial Spot & Key Visual Campaign',
        brand: 'Samsung Galaxy AI Studio',
        roleType: 'ACTOR',
        metricOrResult: 'Global Digital Buyout • 4.2M Campaign Views',
        thumbnailTag: 'On-Camera Hero Lead',
      },
      {
        id: 'ph-3',
        title: 'Autumn/Winter Editorial Lookbook & Motion Reel',
        brand: 'Gentle Monster / Tamburins Concept',
        roleType: 'MODEL',
        metricOrResult: '12 Lookbook Stills + 3 Vertical Cinema Cuts',
        thumbnailTag: 'Editorial & Commercial Model',
      },
    ],
    commissionSplitPct: 0,
    availabilityStatus: 'AVAILABLE',
  },
  // Phase 2 Agency Roster Talent (Ready when switching to Agency Mode)
  {
    id: 'talent-roster-02',
    workspaceId: 'ws-vanguard-01',
    isOwner: false,
    displayName: 'Min-Jae Park',
    handle: '@minjae.frames',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    headline: 'Men’s Grooming, Tech & Athletic Commercial Model + UGC Creator',
    roles: ['MODEL', 'UGC_CREATOR'],
    languages: ['KO', 'EN'],
    niches: ['Men’s Skincare', 'Athletic Apparel', 'Consumer Electronics'],
    compCard: {
      height: '185 cm / 6\'1"',
      hair: 'Black',
      eyes: 'Brown',
      wardrobeSizes: 'Top L / Suit 40L / Shoe 280mm (US 10)',
      location: 'Seoul, KR',
      unionStatus: 'Independent Global Talent',
    },
    rateCard: {
      ugcSingleVideoUsd: 380,
      ugcThreeBundleUsd: 980,
      actorHalfDayUsd: 900,
      actorFullDayUsd: 1650,
      modelLookbookDayUsd: 1400,
      whitelisting30DayPct: 30,
      exclusivityMonthlyUsd: 600,
    },
    portfolioHighlights: [
      {
        id: 'ph-4',
        title: 'High-Energy Gym & Recovery Supplement Ad Pack',
        brand: 'HDEX Korea',
        roleType: 'UGC_CREATOR',
        metricOrResult: '2.9x TikTok Spark Conversion Rate',
        thumbnailTag: 'Fitness & Lifestyle UGC',
      },
    ],
    commissionSplitPct: 20,
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'talent-roster-03',
    workspaceId: 'ws-vanguard-01',
    isOwner: false,
    displayName: 'Elena Vance',
    handle: '@elenavance.act',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    headline: 'Comedic & Spokesperson Actor for FinTech, SaaS & Wellness Brands',
    roles: ['ACTOR', 'UGC_CREATOR'],
    languages: ['EN', 'ES'],
    niches: ['AI & SaaS Apps', 'FinTech', 'Clean Beauty'],
    compCard: {
      height: '170 cm / 5\'7"',
      hair: 'Honey Blonde',
      eyes: 'Green',
      wardrobeSizes: 'Dress US 4 / Top S / Shoe US 7.5',
      location: 'Los Angeles, US',
      unionStatus: 'Non-Union Commercial / Digital',
    },
    rateCard: {
      ugcSingleVideoUsd: 420,
      ugcThreeBundleUsd: 1100,
      actorHalfDayUsd: 950,
      actorFullDayUsd: 1800,
      modelLookbookDayUsd: 1300,
      whitelisting30DayPct: 30,
      exclusivityMonthlyUsd: 700,
    },
    portfolioHighlights: [
      {
        id: 'ph-5',
        title: 'Street-Interview & Sketch Style FinTech Ad Series',
        brand: 'Mercury / Ramp Style',
        roleType: 'ACTOR',
        metricOrResult: '-38% CPA on Meta Paid Acquisition',
        thumbnailTag: 'Spokesperson & Sketch Actor',
      },
    ],
    commissionSplitPct: 20,
    availabilityStatus: 'ON_SET',
  },
  {
    id: 'talent-roster-04',
    workspaceId: 'ws-vanguard-01',
    isOwner: false,
    displayName: 'Sora Takahashi',
    handle: '@sora.visuals',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    headline: 'Trilingual Luxury Fashion Model & Aesthetic ASMR/Unboxing Creator',
    roles: ['MODEL', 'UGC_CREATOR'],
    languages: ['JA', 'KO', 'EN'],
    niches: ['Luxury Fashion', 'K-Beauty & J-Beauty', 'Hospitality & Travel'],
    compCard: {
      height: '174 cm / 5\'8.5"',
      hair: 'Jet Black',
      eyes: 'Hazel Brown',
      wardrobeSizes: 'Dress US 2 / Top XS-S / Shoe 245mm',
      location: 'Tokyo & Seoul',
      unionStatus: 'APAC Commercial Eligible',
    },
    rateCard: {
      ugcSingleVideoUsd: 400,
      ugcThreeBundleUsd: 1050,
      actorHalfDayUsd: 1000,
      actorFullDayUsd: 1850,
      modelLookbookDayUsd: 1750,
      whitelisting30DayPct: 35,
      exclusivityMonthlyUsd: 750,
    },
    portfolioHighlights: [
      {
        id: 'ph-6',
        title: 'Sensory Texture & Glass-Skin Macro Reel',
        brand: 'Sulwhasoo / Shiseido Digital',
        roleType: 'MODEL',
        metricOrResult: '1.8M Organic + Paid Luxury Reach',
        thumbnailTag: 'High-Fashion Beauty Model',
      },
    ],
    commissionSplitPct: 20,
    availabilityStatus: 'AVAILABLE',
  },
];

export const INITIAL_CREATOR_GOAL: CreatorGoal = {
  id: 'goal-oct-2026',
  workspaceId: 'ws-vanguard-01',
  periodLabel: 'October 2026 Studio Goal',
  targetRevenueUsd: 12000,
  currentBookedUsd: 7450,
  minProjectRateUsd: 450,
  targetNiches: ['K-Beauty & Skincare', 'AI & Consumer Tech', 'Luxury Lifestyle', 'Fitness & Wellness'],
  preferredDealTypes: ['MONTHLY_RETAINER', 'COMMERCIAL_ACTING', 'UGC_AD_BUNDLE'],
  strategicFocusNote:
    'Prioritize 3-month UGC + Acting Retainers ($1,800+/mo) and bilingual US/KR brand campaigns with paid 60-day usage rights.',
  milestones: [
    { id: 'ms-1', label: 'Recurring Brand Retainers Signed', current: 2, target: 3, unit: 'retainers' },
    { id: 'ms-2', label: 'On-Camera Acting / Commercial Bookings', current: 1, target: 2, unit: 'shoots' },
    { id: 'ms-3', label: 'Outbound Brand Pitches Sent This Week', current: 11, target: 15, unit: 'pitches' },
  ],
};

export const INITIAL_INBOUND_MESSAGES: InboundMessage[] = [
  {
    id: 'inb-01',
    workspaceId: 'ws-vanguard-01',
    brandCompanyId: 'comp-medicube',
    brandName: 'APR Corp (Medicube Global)',
    industryNiche: 'K-Beauty & Skincare',
    region: 'KR',
    channel: 'EMAIL',
    category: 'SPONSORSHIP',
    senderName: 'Ji-Hoon Kim',
    senderTitle: 'Head of Global Paid Social (US & APAC)',
    senderHandleOrEmail: 'jh.kim@apr-in.com',
    subject: 'Q4 Booster Pro On-Camera Spokesperson + 4 UGC Ad Concepts (US/KR)',
    rawMessage:
      'Hi! We saw your recent bilingual on-camera commercial reel and UGC ad hooks. We are scaling our Age-R Booster Pro campaign for Black Friday in the US and Korea. Looking for an actor-level presenter who can deliver natural authority on camera for 3 core ads + 6 hook variations with 60 days Meta/TikTok whitelisting. Budget is around ₩3,300,000 (~$2,400 USD) with potential monthly retainer if ROAS hits benchmark. Can you share a proposal today?',
    aiSummary:
      'Medicube wants a 3-video Actor-led UGC bundle + 6 hooks with 60-day whitelisting for Black Friday. Budget ~$2,400 (₩3.3M) with monthly retainer upside.',
    detectedBudgetUsd: 2400,
    nativeCurrency: 'KRW',
    nativeBudgetAmount: 3312000,
    goalAlignmentScore: 98,
    goalAlignmentReason:
      '98% Match: Hits K-Beauty target niche, exceeds $450 floor by 5.3x, includes 60-day paid usage, and offers your #1 goal: a monthly retainer path.',
    urgency: 'HIGH_TODAY',
    requiresActionToday: true,
    status: 'UNREAD_TODAY',
    receivedAt: 'Today, 09:14 AM',
    targetTalentRole: 'ACTOR',
  },
  {
    id: 'inb-02',
    workspaceId: 'ws-vanguard-01',
    brandCompanyId: 'comp-arc-browser',
    brandName: 'The Browser Company (Arc / Dia AI)',
    industryNiche: 'AI & Consumer Tech',
    region: 'US',
    channel: 'IG_DM',
    category: 'UGC_BRIEF',
    senderName: 'Maya Lin',
    senderTitle: 'Creator Partnerships Lead',
    senderHandleOrEmail: '@mayalin.growth',
    subject: 'Paid Creator Sponsorship: "Day in the Life on Set with AI" Concept',
    rawMessage:
      'Hey! Loved your cinematic pacing. We are booking 5 actor/creator hybrids this week to shoot a 45-second storytelling piece showing how you prep scripts, self-tapes, and brand shoots using our new AI workflow. $1,500 flat for 1 hero video + 2 hook cuts + 30-day Spark Ads. Are you free to lock concepts today?',
    aiSummary:
      'Inbound IG DM for a 45s cinematic storytelling UGC sponsorship + 2 hook cuts + 30d Spark Ads at $1,500.',
    detectedBudgetUsd: 1500,
    nativeCurrency: 'USD',
    nativeBudgetAmount: 1500,
    goalAlignmentScore: 92,
    goalAlignmentReason:
      '92% Match: AI & Consumer Tech target vertical, $1,500 for a single hero concept + 2 hooks is 3.3x above your minimum project floor.',
    urgency: 'HIGH_TODAY',
    requiresActionToday: true,
    status: 'UNREAD_TODAY',
    receivedAt: 'Today, 10:28 AM',
    targetTalentRole: 'UGC_CREATOR',
  },
  {
    id: 'inb-03',
    workspaceId: 'ws-vanguard-01',
    brandCompanyId: 'comp-ader-error',
    brandName: 'ADER ERROR Studio',
    industryNiche: 'Luxury Lifestyle',
    region: 'KR',
    channel: 'BOOKING_PORTAL',
    category: 'MODEL_BOOKING',
    senderName: 'Soo-Min Cho',
    senderTitle: 'Casting & Visual Producer',
    senderHandleOrEmail: 'casting@adererror.com',
    subject: 'Seongsu Capsule Film & Lookbook Casting Inquiry (Full-Day Shoot)',
    rawMessage:
      'Submitted via Vanguard Booking Portal: Requesting availability for a 1-day on-location commercial modeling & motion film shoot in Seongsu-dong next Thursday. Deliverables: 15 lookbook stills + 2 vertical brand films (90-day global digital usage). Proposed day rate + usage: ₩2,760,000 ($2,000 USD). Please confirm comp card & availability.',
    aiSummary:
      'Full-day Seongsu-dong lookbook & motion film booking via your public portal. ₩2,760,000 ($2,000) with 90-day digital usage.',
    detectedBudgetUsd: 2000,
    nativeCurrency: 'KRW',
    nativeBudgetAmount: 2760000,
    goalAlignmentScore: 94,
    goalAlignmentReason:
      '94% Match: Advances your On-Camera/Commercial Shoot milestone (2/2) and closes 44% of your remaining October revenue gap in one day.',
    urgency: 'HIGH_TODAY',
    requiresActionToday: true,
    status: 'UNREAD_TODAY',
    receivedAt: 'Today, 11:05 AM',
    targetTalentRole: 'MODEL',
  },
  {
    id: 'inb-04',
    workspaceId: 'ws-vanguard-01',
    brandCompanyId: 'comp-ag1',
    brandName: 'Athletic Greens (AG1 Global)',
    industryNiche: 'Fitness & Wellness',
    region: 'GLOBAL',
    channel: 'EMAIL',
    category: 'FOLLOW_UP',
    senderName: 'Devon Brooks',
    senderTitle: 'Senior Performance Creative Strategist',
    senderHandleOrEmail: 'd.brooks@drinkag1.com',
    subject: 'Re: Travel Morning Routine UGC Pitch — Rate Card & Tier Options?',
    rawMessage:
      'Thanks for sending over those 3 hook concepts last week—our paid social team loved the "Jetlagged Actor 6AM Call Time" angle. Could you send over your formal proposal link with a 3-video test package vs. a 3-month retainer breakdown so I can get budget sign-off before Friday?',
    aiSummary:
      'Positive reply to your outbound pitch! AG1 wants a formal 3-tier proposal comparing a 3-video test pack vs. a 3-month retainer.',
    detectedBudgetUsd: 3200,
    nativeCurrency: 'USD',
    nativeBudgetAmount: 3200,
    goalAlignmentScore: 96,
    goalAlignmentReason:
      '96% Match: Outbound pitch converted to warm proposal request; strong candidate for your 3rd recurring monthly retainer.',
    urgency: 'HIGH_TODAY',
    requiresActionToday: true,
    status: 'TRIAGED',
    receivedAt: 'Today, 08:30 AM',
    targetTalentRole: 'UGC_CREATOR',
  },
];

export const INITIAL_COMPANIES: BrandCompany[] = [
  {
    id: 'comp-medicube',
    workspaceId: 'ws-vanguard-01',
    name: 'APR Corp (Medicube Global)',
    industryNiche: 'K-Beauty & Skincare',
    region: 'KR',
    websiteUrl: 'https://medicube.us',
    outreachStatus: 'INBOUND',
    brandFitScore: 98,
    activeAdSignals: [
      'Running 140+ active video ads on Meta Ad Library (US & KR)',
      'Heavy rotation of split-screen before/after & clinical authority hooks',
      'Scaling Q4 Black Friday creator whitelisting budget',
    ],
    whyItFitsYourGoal:
      'High-volume K-Beauty spender looking for bilingual on-camera actor presence; ideal for $2,400+/mo retainer.',
    contacts: [
      {
        id: 'ct-1',
        name: 'Ji-Hoon Kim',
        roleTitle: 'Head of Global Paid Social',
        email: 'jh.kim@apr-in.com',
        instagramOrLinkedin: 'linkedin.com/in/jihoonkim-growth',
        preferredLanguage: 'ko-KR',
      },
    ],
    estimatedDealValueUsd: 2400,
    nativeCurrency: 'KRW',
    nativeEstimatedValue: 3312000,
    assignedTalentIds: ['talent-owner-01'],
    lastContactedAt: '2026-10-16',
    nextFollowUpAt: '2026-10-16',
    notes: 'Inbound received this morning. Wants proposal today for Booster Pro Q4 campaign.',
    pitchHistory: [
      {
        id: 'ph-log-1',
        date: 'Today, 09:14 AM',
        direction: 'INBOUND',
        channel: 'EMAIL',
        subject: 'Q4 Booster Pro On-Camera Spokesperson + 4 UGC Ad Concepts',
        snippet: 'Looking for an actor-level presenter for 3 core ads + 6 hooks with 60d whitelisting...',
      },
    ],
  },
  {
    id: 'comp-ag1',
    workspaceId: 'ws-vanguard-01',
    name: 'Athletic Greens (AG1 Global)',
    industryNiche: 'Fitness & Wellness',
    region: 'GLOBAL',
    websiteUrl: 'https://drinkag1.com',
    outreachStatus: 'IN_CONVERSATION',
    brandFitScore: 96,
    activeAdSignals: [
      'Top 1% spend on Meta & YouTube Shorts creator performance ads',
      'Testing "High-Performer Morning Routine" & travel resilience hooks',
    ],
    whyItFitsYourGoal:
      'Your outbound cold pitch converted today! Asking for a 3-video test vs. 3-month retainer proposal.',
    contacts: [
      {
        id: 'ct-2',
        name: 'Devon Brooks',
        roleTitle: 'Senior Performance Creative Strategist',
        email: 'd.brooks@drinkag1.com',
        instagramOrLinkedin: 'linkedin.com/in/devonbrooks-creative',
        preferredLanguage: 'en-US',
      },
    ],
    estimatedDealValueUsd: 3200,
    nativeCurrency: 'USD',
    nativeEstimatedValue: 3200,
    assignedTalentIds: ['talent-owner-01'],
    lastContactedAt: '2026-10-16',
    nextFollowUpAt: '2026-10-17',
    notes: 'Loved the "Jetlagged Actor 6AM Call Time" angle. Send Goal-Aligned Proposal today.',
    pitchHistory: [
      {
        id: 'ph-log-2',
        date: 'Oct 11, 2026',
        direction: 'OUTBOUND',
        channel: 'EMAIL',
        subject: '3 Custom UGC Ad Hooks for AG1 Travel Packs (On-Set Actor Routine)',
        snippet: 'Pitched 3 high-retention morning call-time hooks tailored to AG1 travel pouches.',
      },
      {
        id: 'ph-log-3',
        date: 'Today, 08:30 AM',
        direction: 'INBOUND',
        channel: 'EMAIL',
        subject: 'Re: Travel Morning Routine UGC Pitch — Rate Card & Tier Options?',
        snippet: 'Could you send over your formal proposal link with a 3-video test vs 3-month retainer?',
      },
    ],
  },
  {
    id: 'comp-arc-browser',
    workspaceId: 'ws-vanguard-01',
    name: 'The Browser Company (Arc / Dia AI)',
    industryNiche: 'AI & Consumer Tech',
    region: 'US',
    websiteUrl: 'https://arc.net',
    outreachStatus: 'INBOUND',
    brandFitScore: 92,
    activeAdSignals: [
      'Sponsoring cinematic creator storytelling on TikTok Spark Ads & IG Reels',
      'Focus on authentic creative workflows rather than scripted tech specs',
    ],
    whyItFitsYourGoal: 'High-prestige AI brand paying $1,500 for a single storytelling asset + 2 hooks.',
    contacts: [
      {
        id: 'ct-3',
        name: 'Maya Lin',
        roleTitle: 'Creator Partnerships Lead',
        email: 'maya@thebrowser.company',
        instagramOrLinkedin: '@mayalin.growth',
        preferredLanguage: 'en-US',
      },
    ],
    estimatedDealValueUsd: 1500,
    nativeCurrency: 'USD',
    nativeEstimatedValue: 1500,
    assignedTalentIds: ['talent-owner-01'],
    lastContactedAt: '2026-10-16',
    nextFollowUpAt: '2026-10-16',
    notes: 'Inbound DM today. Send proposal with upsell option for 3-video bundle.',
    pitchHistory: [
      {
        id: 'ph-log-4',
        date: 'Today, 10:28 AM',
        direction: 'INBOUND',
        channel: 'IG_DM',
        subject: 'Paid Creator Sponsorship: "Day in the Life on Set with AI"',
        snippet: 'Booking 5 actor/creator hybrids this week for $1,500 flat + 30d Spark Ads.',
      },
    ],
  },
  {
    id: 'comp-ader-error',
    workspaceId: 'ws-vanguard-01',
    name: 'ADER ERROR Studio',
    industryNiche: 'Luxury Lifestyle',
    region: 'KR',
    websiteUrl: 'https://adererror.com',
    outreachStatus: 'INBOUND',
    brandFitScore: 94,
    activeAdSignals: [
      'Launching Seongsu-dong flagship capsule collection',
      'Hiring editorial models & motion actors for vertical cinema campaigns',
    ],
    whyItFitsYourGoal: 'High-ticket commercial modeling day rate ($2,000 / ₩2.76M) + 90-day digital usage.',
    contacts: [
      {
        id: 'ct-4',
        name: 'Soo-Min Cho',
        roleTitle: 'Casting & Visual Producer',
        email: 'casting@adererror.com',
        preferredLanguage: 'ko-KR',
      },
    ],
    estimatedDealValueUsd: 2000,
    nativeCurrency: 'KRW',
    nativeEstimatedValue: 2760000,
    assignedTalentIds: ['talent-owner-01'],
    lastContactedAt: '2026-10-16',
    nextFollowUpAt: '2026-10-16',
    notes: 'Submitted via Booking Portal today. Confirm next Thursday shoot availability.',
    pitchHistory: [],
  },
  {
    id: 'comp-beauty-of-joseon',
    workspaceId: 'ws-vanguard-01',
    name: 'Guda Company (Beauty of Joseon)',
    industryNiche: 'K-Beauty & Skincare',
    region: 'GLOBAL',
    websiteUrl: 'https://beautyofjoseon.com',
    outreachStatus: 'PROPOSAL_SENT',
    brandFitScore: 95,
    activeAdSignals: [
      'Scaling Aqua-Fresh SPF & Glow Replenishing Rice Milk on TikTok Shop US/UK',
      'Actively testing English-speaking creators settled in Seoul for authentic K-Beauty storytelling',
    ],
    whyItFitsYourGoal:
      'Proposal sent 4 days ago ($1,850 4-video bundle). Needs follow-up bump today to close before Friday.',
    contacts: [
      {
        id: 'ct-5',
        name: 'Hye-Jin Yoon',
        roleTitle: 'Global Influencer & UGC Lead',
        email: 'hj.yoon@beautyofjoseon.com',
        preferredLanguage: 'en-US',
      },
    ],
    estimatedDealValueUsd: 1850,
    nativeCurrency: 'USD',
    nativeEstimatedValue: 1850,
    assignedTalentIds: ['talent-owner-01'],
    lastContactedAt: '2026-10-12',
    nextFollowUpAt: '2026-10-16',
    notes: 'Proposal viewed twice by brand team. Due for Follow-Up #1 today.',
    pitchHistory: [
      {
        id: 'ph-log-5',
        date: 'Oct 12, 2026',
        direction: 'OUTBOUND',
        channel: 'EMAIL',
        subject: 'Proposal: Seoul-to-US SPF Storytelling Bundle (4 Videos + 8 Hooks)',
        snippet: 'Sent interactive proposal link for Q4 Sun Relief & Rice Milk campaign.',
      },
    ],
  },
  {
    id: 'comp-elevenlabs',
    workspaceId: 'ws-vanguard-01',
    name: 'ElevenLabs AI',
    industryNiche: 'AI & Consumer Tech',
    region: 'US',
    websiteUrl: 'https://elevenlabs.io',
    outreachStatus: 'CONTACTED',
    brandFitScore: 91,
    activeAdSignals: [
      'Running paid social ads targeting actors, voice talent, and global video creators',
      'Expanding multilingual dubbing showcase campaigns',
    ],
    whyItFitsYourGoal: 'Natural fit for a bilingual Actor/Creator demonstrating voice & performance range.',
    contacts: [
      {
        id: 'ct-6',
        name: 'Lucas Meyer',
        roleTitle: 'Head of Creator Growth',
        email: 'lucas@elevenlabs.io',
        preferredLanguage: 'en-US',
      },
    ],
    estimatedDealValueUsd: 1600,
    nativeCurrency: 'USD',
    nativeEstimatedValue: 1600,
    assignedTalentIds: ['talent-owner-01'],
    lastContactedAt: '2026-10-13',
    nextFollowUpAt: '2026-10-17',
    notes: 'Cold pitch sent with 30s bilingual acting demo reel.',
    pitchHistory: [
      {
        id: 'ph-log-6',
        date: 'Oct 13, 2026',
        direction: 'OUTBOUND',
        channel: 'EMAIL',
        subject: 'Actor + Bilingual Creator Concept for ElevenLabs Dubbing Studio',
        snippet: 'Shared custom concept showing an actor performing a dramatic monologue across EN/KO.',
      },
    ],
  },
  {
    id: 'comp-anua',
    workspaceId: 'ws-vanguard-01',
    name: 'The Founders Inc (Anua Skincare)',
    industryNiche: 'K-Beauty & Skincare',
    region: 'GLOBAL',
    websiteUrl: 'https://anuaskincare.com',
    outreachStatus: 'DELIVERED',
    brandFitScore: 97,
    activeAdSignals: [
      'Currently running your 3 Heartleaf & Niacinamide ads as top-spending Meta creatives',
    ],
    whyItFitsYourGoal:
      'Active client! 60-day paid whitelisting license expires in 6 days — prime $750 renewal + Retainer upsell.',
    contacts: [
      {
        id: 'ct-7',
        name: 'Chloe Park',
        roleTitle: 'US Paid Media Manager',
        email: 'chloe.park@thefounders.kr',
        preferredLanguage: 'en-US',
      },
    ],
    estimatedDealValueUsd: 2600,
    nativeCurrency: 'USD',
    nativeEstimatedValue: 2600,
    assignedTalentIds: ['talent-owner-01'],
    lastContactedAt: '2026-10-02',
    nextFollowUpAt: '2026-10-16',
    notes: '60-day usage rights expire Oct 22. Pitch usage extension + November 4-video retainer today.',
    pitchHistory: [],
  },
  {
    id: 'comp-WHOOP',
    workspaceId: 'ws-vanguard-01',
    name: 'WHOOP',
    industryNiche: 'Fitness & Wellness',
    region: 'US',
    websiteUrl: 'https://whoop.com',
    outreachStatus: 'BOOKED',
    brandFitScore: 90,
    activeAdSignals: [
      'High-production direct-response creator ads focused on sleep recovery and strain tracking',
    ],
    whyItFitsYourGoal: 'Booked $1,800 package currently in script & B-roll production.',
    contacts: [
      {
        id: 'ct-8',
        name: 'Ryan Vance',
        roleTitle: 'Performance Partnerships',
        email: 'rvance@whoop.com',
        preferredLanguage: 'en-US',
      },
    ],
    estimatedDealValueUsd: 1800,
    nativeCurrency: 'USD',
    nativeEstimatedValue: 1800,
    assignedTalentIds: ['talent-owner-01'],
    lastContactedAt: '2026-10-14',
    notes: 'Shooting 3 vertical ads this Friday. Raw footage + edited hooks due Oct 21.',
    pitchHistory: [],
  },
  {
    id: 'comp-agency-tubescience',
    workspaceId: 'ws-vanguard-01',
    name: 'TubeScience (Performance Ad Studio)',
    entityType: 'AGENCY',
    industryNiche: 'K-Beauty & Skincare',
    region: 'US',
    websiteUrl: 'https://tubescience.com',
    outreachStatus: 'CONTACTED',
    brandFitScore: 98,
    activeAdSignals: [
      'Casts 100+ on-camera actors & spoken-word creators weekly for 8-figure DTC clients',
      'Pays $800–$1,800/day session fees or $600–$2,400 remote modular bundles',
    ],
    whyItFitsYourGoal:
      'Getting onto 2–3 performance agency rosters provides recurring monthly briefs without cold pitching single brands.',
    contacts: [
      {
        id: 'ct-agency-1',
        name: 'Talent Casting Desk',
        roleTitle: 'Senior Casting Producer',
        email: 'casting@tubescience.com',
        preferredLanguage: 'en-US',
      },
    ],
    estimatedDealValueUsd: 2400,
    nativeCurrency: 'USD',
    nativeEstimatedValue: 2400,
    assignedTalentIds: ['talent-owner-01'],
    lastContactedAt: '2026-10-14',
    nextFollowUpAt: '2026-10-18',
    notes: 'Submitted Actor/UGC slate + 60-second direct-response reel to Casting Producer.',
    pitchHistory: [
      {
        id: 'ph-log-agency-1',
        date: 'Oct 14, 2026',
        direction: 'OUTBOUND',
        channel: 'EMAIL',
        subject: 'On-Camera Actor & Bilingual UGC Creator Roster Submission — Lead Talent',
        snippet: 'Shared comp card, 3-second hook retention stats, and 48h self-tape availability.',
      },
    ],
  },
  {
    id: 'comp-agency-hom',
    workspaceId: 'ws-vanguard-01',
    name: 'House of Marketers (TikTok Ad Agency)',
    entityType: 'AGENCY',
    industryNiche: 'AI & Consumer Tech',
    region: 'GLOBAL',
    websiteUrl: 'https://houseofmarketers.com',
    outreachStatus: 'SCOUTED',
    brandFitScore: 94,
    activeAdSignals: [
      'Founded by ex-TikTok team; manages paid Spark Ads & UGC production for global consumer apps and beauty brands',
      'Actively onboarding bilingual EN/KO and EN/ES remote creators',
    ],
    whyItFitsYourGoal:
      'High-volume TikTok Creative Partner agency that books multi-video creator packs every month.',
    contacts: [
      {
        id: 'ct-agency-2',
        name: 'Creator Network Team',
        roleTitle: 'Head of Creator Partnerships',
        email: 'creators@houseofmarketers.com',
        preferredLanguage: 'en-US',
      },
    ],
    estimatedDealValueUsd: 1800,
    nativeCurrency: 'USD',
    nativeEstimatedValue: 1800,
    assignedTalentIds: ['talent-owner-01'],
    lastContactedAt: '2026-10-15',
    nextFollowUpAt: '2026-10-17',
    notes: 'Ready to send roster pitch via Lead Gen Hub.',
    pitchHistory: [],
  },
];

export const INITIAL_PROPOSALS: ProposalPackage[] = [
  {
    id: 'prop-medicube-q4',
    workspaceId: 'ws-vanguard-01',
    brandCompanyId: 'comp-medicube',
    brandName: 'APR Corp (Medicube Global)',
    talentProfileId: 'talent-owner-01',
    title: 'Q4 Age-R Booster Pro: On-Camera Actor Authority + High-Retention UGC Ad Suite',
    campaignObjective:
      'Deliver studio-grade on-camera spokesperson authority combined with native TikTok/Meta direct-response hooks for Black Friday scaling in US & KR.',
    targetRole: 'ACTOR',
    locale: 'en-US',
    currency: 'USD',
    includeKoreanWithholdingTaxNote: true,
    goalAlignmentScore: 98,
    goalAlignmentBreakdown: {
      revenueContributionPct: 52,
      nicheMatch: true,
      meetsRateFloor: true,
      retainerPotential: true,
      explanation:
        'Closes 52% of your remaining $4,550 October revenue target in a single booking, matches your K-Beauty vertical, and anchors a monthly creative refresh retainer.',
    },
    customDeliverables: [
      {
        id: 'del-1',
        label: 'On-Camera Spoken-Word Hero UGC Ads (30–45s, 9:16)',
        category: 'UGC_VIDEO',
        quantity: 3,
        unitPriceUsd: 450,
      },
      {
        id: 'del-2',
        label: 'A/B Scroll-Stopping Hook Variations (First 4 Seconds)',
        category: 'HOOK_VARIATION',
        quantity: 6,
        unitPriceUsd: 90,
      },
      {
        id: 'del-3',
        label: 'Clean B-Roll & Macro Product Texture Stills/Clips',
        category: 'RAW_FOOTAGE',
        quantity: 1,
        unitPriceUsd: 250,
      },
      {
        id: 'del-4',
        label: '60-Day Paid Ad Usage Rights (Meta + TikTok Whitelisting)',
        category: 'USAGE_RIGHTS',
        quantity: 1,
        unitPriceUsd: 350,
      },
    ],
    tiers: [
      {
        id: 'tier-starter',
        tierCode: 'STARTER',
        name: 'Tier 1: Rapid Hook Validation Pack',
        subtitle: 'Low-friction creative test for immediate Meta/TikTok A/B split testing',
        isRecommended: false,
        deliverables: [
          '2x Fully Edited On-Camera UGC Ads (30–45s)',
          '4x Custom Hook Variations (8 total video combinations)',
          '30-Day Paid Ad Usage Rights (Meta & TikTok)',
          '1 Round of Creative Revisions',
        ],
        usageRightsSummary: '30-Day Paid Social Usage Included',
        turnaroundDays: 5,
        priceUsd: 1350,
        priceKrw: 1863000,
        goalImpactSummary: '+$1,350 toward Oct Goal (30% of remaining gap)',
      },
      {
        id: 'tier-recommended',
        tierCode: 'GOAL_ALIGNED_RECOMMENDED',
        name: 'Tier 2: Q4 Scale & Authority Suite (Goal-Aligned)',
        subtitle: 'Matches your exact Black Friday brief: 3 Core Ads + 6 Hooks + 60-Day Whitelisting',
        isRecommended: true,
        deliverables: [
          '3x On-Camera Actor/Spokesperson UGC Ads (EN & KO Hook Options)',
          '6x Direct-Response Hook Variations (18 testable ad combinations)',
          'Full Raw Footage & Macro Skin-Glow B-Roll Vault',
          '60-Day Paid Social Usage Rights + Creator Handle Whitelisting',
          'Priority 4-Business-Day Turnaround',
        ],
        usageRightsSummary: '60-Day Paid Usage + Handle Whitelisting',
        turnaroundDays: 4,
        priceUsd: 2490,
        priceKrw: 3436200,
        goalImpactSummary: '+$2,490 toward Oct Goal (Closes 55% of remaining monthly gap)',
      },
      {
        id: 'tier-retainer',
        tierCode: 'RETAINER_PARTNERSHIP',
        name: 'Tier 3: 3-Month Creative Performance Partner',
        subtitle: 'Continuous monthly ad refresh to prevent creative fatigue through Q4 & Q1',
        isRecommended: false,
        deliverables: [
          '4x New On-Camera UGC Ads Every Month (12 Videos Total)',
          '8x Fresh Hook Variations Monthly based on winning ROAS data',
          '90-Day Rolling Paid Usage & Whitelisting Access',
          'Dedicated Bi-Weekly Creative Strategy Sync',
        ],
        usageRightsSummary: '90-Day Rolling Usage + Category Priority',
        turnaroundDays: 4,
        priceUsd: 2250,
        priceKrw: 3105000,
        goalImpactSummary: 'Locks $6,750 in recurring revenue & completes your 3/3 Retainer Milestone!',
      },
    ],
    selectedTierId: 'tier-recommended',
    pitchEmailSubject:
      'Proposal: APR / Medicube Q4 Booster Pro On-Camera Ad Suite (+ 3 Testable Hooks Inside)',
    pitchMessageBody: `Hi Ji-Hoon,

Thank you for reaching out this morning! Given Medicube's push for the Age-R Booster Pro ahead of Black Friday, combining trained on-camera acting delivery with native direct-response UGC pacing is the fastest way to hold 3-second thumbstop rates above 45%.

I put together a tailored, goal-aligned proposal with three clear options—including the exact 3-Video + 6-Hook + 60-Day Whitelisting package you mentioned, plus a monthly performance retainer option if you want to lock in creative refreshes through Q4.

Three initial hook concepts included in this package:
1. "The Split-Face 7-Day Call-Time Test" (Visual authority + tactile device sonic cue)
2. "Why Korean Broadcast Makeup Artists Keep This in Their Kit" (Insider behind-the-scenes angle)
3. "Stop Layering 6 Serums If Your Barrier Can't Absorb Them" (Problem/Agitation direct-to-camera)

You can review the interactive breakdown and select your preferred tier directly at the proposal link below. Ready to shoot this week!`,
    creativeHooksProposed: [
      {
        hookTitle: 'Hook 01: The 5AM Call-Time Split-Face Test',
        visualDirection: 'Close-up in dressing room mirror under studio lights; using Booster Pro on left jawline only.',
        spokenLine: '"When I have a 5 AM camera call time, I only do half my face first so the director sees the difference."',
      },
      {
        hookTitle: 'Hook 02: The K-Drama Makeup Artist Secret',
        visualDirection: 'Fast cut holding the Age-R device up to camera with Korean/English dual captions.',
        spokenLine: '"Every on-set makeup artist in Seoul uses this 3-minute prep trick before 4K close-ups—here is why."',
      },
      {
        hookTitle: 'Hook 03: Expensive Serum Absorption Reality Check',
        visualDirection: 'Pouring serum on glass vs. using microcurrent absorption visual metaphor.',
        spokenLine: '"Your $80 serum isn’t failing you—it’s just sitting on top of your skin barrier."',
      },
    ],
    shareableSlug: 'vanguard.studio/p/medicube-q4-booster-pro',
    status: 'DRAFT',
    createdAt: '2026-10-16',
  },
  {
    id: 'prop-boj-spf',
    workspaceId: 'ws-vanguard-01',
    brandCompanyId: 'comp-beauty-of-joseon',
    brandName: 'Guda Company (Beauty of Joseon)',
    talentProfileId: 'talent-owner-01',
    title: 'Seoul-to-Global Aqua-Fresh SPF Storytelling Bundle (4 Videos + 8 Hooks)',
    campaignObjective: 'Bridge authentic Seoul lifestyle aesthetics with English-spoken conversion hooks for TikTok Shop & Meta.',
    targetRole: 'UGC_CREATOR',
    locale: 'en-US',
    currency: 'USD',
    includeKoreanWithholdingTaxNote: false,
    goalAlignmentScore: 95,
    goalAlignmentBreakdown: {
      revenueContributionPct: 41,
      nicheMatch: true,
      meetsRateFloor: true,
      retainerPotential: true,
      explanation: 'High-margin 4-video K-Beauty bundle at $1,850 ($462/video effective rate).',
    },
    customDeliverables: [],
    tiers: [
      {
        id: 'tier-boj-1',
        tierCode: 'STARTER',
        name: 'Tier 1: 2-Video SPF Texture Test',
        subtitle: '2x Spoken-Word & Sensory Application Ads + 4 Hooks',
        isRecommended: false,
        deliverables: ['2x Edited Vertical Videos', '4x Hook Variations', '30-Day Spark Ads'],
        usageRightsSummary: '30-Day Spark Ads & Meta Usage',
        turnaroundDays: 5,
        priceUsd: 1100,
        priceKrw: 1518000,
        goalImpactSummary: '+$1,100 toward Oct Goal',
      },
      {
        id: 'tier-boj-2',
        tierCode: 'GOAL_ALIGNED_RECOMMENDED',
        name: 'Tier 2: 4-Video Seoul Storytelling Bundle',
        subtitle: '4x Hero Concepts + 8 Hooks + Raw B-Roll + 60-Day Usage',
        isRecommended: true,
        deliverables: ['4x Edited Vertical Videos', '8x Hook Variations', 'Raw B-Roll Pack', '60-Day Global Paid Usage'],
        usageRightsSummary: '60-Day Global Paid Usage',
        turnaroundDays: 5,
        priceUsd: 1850,
        priceKrw: 2553000,
        goalImpactSummary: '+$1,850 toward Oct Goal',
      },
      {
        id: 'tier-boj-3',
        tierCode: 'RETAINER_PARTNERSHIP',
        name: 'Tier 3: Monthly K-Beauty Resident Creator',
        subtitle: '5x Videos Monthly + Unlimited Organic Whitelisting',
        isRecommended: false,
        deliverables: ['5x Monthly Videos', '10x Hooks', '90-Day Usage Rights'],
        usageRightsSummary: '90-Day Usage Rights',
        turnaroundDays: 4,
        priceUsd: 2100,
        priceKrw: 2898000,
        goalImpactSummary: '+$2,100/mo Recurring Retainer',
      },
    ],
    selectedTierId: 'tier-boj-2',
    pitchEmailSubject: 'Proposal: Beauty of Joseon x Vanguard Q4 Storytelling Bundle',
    pitchMessageBody: 'Hi Hye-Jin, sharing the interactive proposal link for our 4-video Seoul storytelling bundle.',
    creativeHooksProposed: [
      {
        hookTitle: 'Zero White-Cast Under Studio Lighting',
        visualDirection: 'Applying SPF right before stepping in front of a 4K cinema camera.',
        spokenLine: '"If a sunscreen leaves even 1% flashback under studio lights, I can’t wear it on set."',
      },
    ],
    shareableSlug: 'vanguard.studio/p/beauty-of-joseon-q4',
    status: 'VIEWED_BY_BRAND',
    createdAt: '2026-10-12',
  },
];

export const INITIAL_USAGE_LICENSES: UsageRightsLicense[] = [
  {
    id: 'lic-anua-01',
    workspaceId: 'ws-vanguard-01',
    brandCompanyId: 'comp-anua',
    brandName: 'The Founders Inc (Anua Skincare)',
    talentProfileId: 'talent-owner-01',
    campaignTitle: 'Heartleaf 77% Toner + Niacinamide 3-Ad Pack',
    usageType: 'PAID_ADS_WHITELIST',
    platforms: ['META_ADS', 'TIKTOK_SPARK'],
    durationDays: 60,
    startDate: '2026-08-23',
    expiresOn: '2026-10-22',
    daysRemaining: 6,
    renewalFeeUsd: 750,
    status: 'EXPIRING_SOON',
  },
  {
    id: 'lic-samsung-02',
    workspaceId: 'ws-vanguard-01',
    brandCompanyId: 'comp-samsung',
    brandName: 'Samsung Galaxy AI Studio',
    talentProfileId: 'talent-owner-01',
    campaignTitle: 'Galaxy AI Live Translate On-Camera Hero Spot',
    usageType: 'DIGITAL_BUYOUT',
    platforms: ['GLOBAL_DIGITAL', 'YOUTUBE_SHORTS'],
    durationDays: 90,
    startDate: '2026-07-28',
    expiresOn: '2026-10-26',
    daysRemaining: 10,
    renewalFeeUsd: 1200,
    exclusivityCategory: 'Smartphone AI Hardware (KR/US)',
    status: 'EXPIRING_SOON',
  },
  {
    id: 'lic-whoop-03',
    workspaceId: 'ws-vanguard-01',
    brandCompanyId: 'comp-WHOOP',
    brandName: 'WHOOP',
    talentProfileId: 'talent-owner-01',
    campaignTitle: 'Actor Recovery & Sleep Strain 3-Ad Suite',
    usageType: 'PAID_ADS_WHITELIST',
    platforms: ['META_ADS', 'TIKTOK_SPARK'],
    durationDays: 60,
    startDate: '2026-10-15',
    expiresOn: '2026-12-14',
    daysRemaining: 59,
    renewalFeeUsd: 600,
    status: 'ACTIVE',
  },
];

export const INITIAL_AGENCY_BRIEFS: AgencyBrandBrief[] = [
  {
    id: 'brief-olive-young',
    workspaceId: 'ws-vanguard-01',
    brandName: 'CJ Olive Young Global',
    campaignTitle: 'Global K-Beauty Fest: 4-Creator Multi-Role Campaign (US & APAC)',
    industryNiche: 'K-Beauty & Skincare',
    region: 'GLOBAL',
    budgetUsd: 8400,
    nativeCurrency: 'KRW',
    nativeBudget: 11592000,
    requiredRoles: ['ACTOR', 'MODEL', 'UGC_CREATOR'],
    requiredLanguages: ['EN', 'KO', 'JA'],
    creatorsNeededCount: 3,
    matchedTalentIds: ['talent-owner-01', 'talent-roster-02', 'talent-roster-04'],
    agencyCommissionPct: 20,
    status: 'OPEN_MATCHING',
    briefSummary:
      'Olive Young needs 3 distinct faces (Bilingual Hero Presenter + Men’s Grooming Model + J-Beauty/K-Beauty Luxury Model) for a coordinated 12-video Q4 global campaign. Agency manages brief & invoicing and retains 20% ($1,680) + your personal talent share ($2,240).',
  },
  {
    id: 'brief-ramp-ai',
    workspaceId: 'ws-vanguard-01',
    brandName: 'Ramp Financial',
    campaignTitle: 'Founder & Creative Studio Finance: 2 On-Camera Actors Needed',
    industryNiche: 'AI & Consumer Tech',
    region: 'US',
    budgetUsd: 5200,
    nativeCurrency: 'USD',
    nativeBudget: 5200,
    requiredRoles: ['ACTOR', 'UGC_CREATOR'],
    requiredLanguages: ['EN'],
    creatorsNeededCount: 2,
    matchedTalentIds: ['talent-owner-01', 'talent-roster-03'],
    agencyCommissionPct: 20,
    status: 'ROSTER_PITCHED',
    briefSummary:
      'Seeking 2 sharp comedic/editorial on-camera actors to film fast-paced dual-perspective ads on creative business expenses.',
  },
];

interface WorkspaceContextValue {
  workspace: Workspace;
  talentProfiles: TalentProfile[];
  ownerProfile: TalentProfile;
  creatorGoal: CreatorGoal;
  inboundMessages: InboundMessage[];
  companies: BrandCompany[];
  proposals: ProposalPackage[];
  usageLicenses: UsageRightsLicense[];
  agencyBriefs: AgencyBrandBrief[];
  ugcPlatforms: UgcPlatformChannel[];
  // Actions
  setWorkspaceMode: (mode: WorkspaceMode) => void;
  setBaseCurrency: (currency: CurrencyCode) => void;
  formatMoney: (amountUsd: number, overrideCurrency?: CurrencyCode) => string;
  addInboundMessage: (msg: InboundMessage, createCompanyAlso?: boolean) => void;
  updateInboundStatus: (id: string, status: InboundMessage['status']) => void;
  deleteInboundMessage: (id: string) => void;
  addCompany: (company: BrandCompany) => void;
  updateCompany: (id: string, updates: Partial<BrandCompany>) => void;
  deleteCompany: (id: string) => void;
  updateCompanyStatus: (id: string, status: OutreachStatus, note?: string) => void;
  logCompanyOutreach: (companyId: string, subject: string, snippet: string, channel?: InboundMessage['channel']) => void;
  addOrUpdateProposal: (proposal: ProposalPackage) => void;
  acceptProposalTier: (proposalId: string, tierId: string) => void;
  renewUsageLicense: (licenseId: string) => void;
  addTalentToRoster: (talent: TalentProfile) => void;
  updateOwnerProfile: (updates: Partial<TalentProfile>) => void;
  toggleTalentInAgencyBrief: (briefId: string, talentId: string) => void;
  pitchAgencyBriefRoster: (briefId: string) => void;
  updateCreatorGoal: (updated: Partial<CreatorGoal>) => void;
  updatePlatformStatus: (platformId: string, status: PlatformApplicationStatus) => void;
  clearToBlankWorkspace: () => void;
  exportCompaniesCsv: () => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = 'vanguard_talent_crm_state_v2';

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspace, setWorkspace] = useState<Workspace>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.workspace) return parsed.workspace;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_WORKSPACE;
  });

  const [talentProfiles, setTalentProfiles] = useState<TalentProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.talentProfiles) return parsed.talentProfiles;
      }
    } catch {
      // ignore
    }
    return INITIAL_TALENT_PROFILES;
  });

  const [creatorGoal, setCreatorGoal] = useState<CreatorGoal>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.creatorGoal) return parsed.creatorGoal;
      }
    } catch {
      // ignore
    }
    return INITIAL_CREATOR_GOAL;
  });

  const [inboundMessages, setInboundMessages] = useState<InboundMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.inboundMessages) return parsed.inboundMessages;
      }
    } catch {
      // ignore
    }
    return INITIAL_INBOUND_MESSAGES;
  });

  const [companies, setCompanies] = useState<BrandCompany[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.companies) return parsed.companies;
      }
    } catch {
      // ignore
    }
    return INITIAL_COMPANIES;
  });

  const [proposals, setProposals] = useState<ProposalPackage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.proposals) return parsed.proposals;
      }
    } catch {
      // ignore
    }
    return INITIAL_PROPOSALS;
  });

  const [usageLicenses, setUsageLicenses] = useState<UsageRightsLicense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.usageLicenses) return parsed.usageLicenses;
      }
    } catch {
      // ignore
    }
    return INITIAL_USAGE_LICENSES;
  });

  const [agencyBriefs, setAgencyBriefs] = useState<AgencyBrandBrief[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.agencyBriefs) return parsed.agencyBriefs;
      }
    } catch {
      // ignore
    }
    return INITIAL_AGENCY_BRIEFS;
  });

  const [ugcPlatforms, setUgcPlatforms] = useState<UgcPlatformChannel[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.ugcPlatforms) return parsed.ugcPlatforms;
      }
    } catch {
      // ignore
    }
    return INITIAL_UGC_PLATFORMS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          workspace,
          talentProfiles,
          creatorGoal,
          inboundMessages,
          companies,
          proposals,
          usageLicenses,
          agencyBriefs,
          ugcPlatforms,
        })
      );
    } catch {
      // ignore quota errors
    }
  }, [
    workspace,
    talentProfiles,
    creatorGoal,
    inboundMessages,
    companies,
    proposals,
    usageLicenses,
    agencyBriefs,
    ugcPlatforms,
  ]);

  const ownerProfile = talentProfiles.find((t) => t.isOwner) || talentProfiles[0];

  const setWorkspaceMode = (mode: WorkspaceMode) => {
    setWorkspace((prev) => ({ ...prev, mode }));
  };

  const setBaseCurrency = (baseCurrency: CurrencyCode) => {
    setWorkspace((prev) => ({ ...prev, baseCurrency }));
  };

  const formatMoney = (amountUsd: number, overrideCurrency?: CurrencyCode): string => {
    const targetCurrency = overrideCurrency || workspace.baseCurrency;
    if (targetCurrency === 'KRW') {
      const krw = Math.round(amountUsd * workspace.usdToKrwRate);
      return `₩${krw.toLocaleString('ko-KR')}`;
    }
    return `$${Math.round(amountUsd).toLocaleString('en-US')}`;
  };

  const addInboundMessage = (msg: InboundMessage, createCompanyAlso = true) => {
    setInboundMessages((prev) => [msg, ...prev]);
    if (createCompanyAlso) {
      const existing = companies.find(
        (c) => c.name.toLowerCase() === msg.brandName.toLowerCase() || c.id === msg.brandCompanyId
      );
      if (!existing) {
        const newCompId = msg.brandCompanyId || `comp-${Date.now()}`;
        const newCompany: BrandCompany = {
          id: newCompId,
          workspaceId: workspace.id,
          name: msg.brandName,
          entityType: 'BRAND',
          industryNiche: msg.industryNiche,
          region: msg.region,
          websiteUrl: `https://${msg.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          outreachStatus: 'INBOUND',
          brandFitScore: msg.goalAlignmentScore,
          activeAdSignals: [`Inbound ${msg.category.replace('_', ' ')} via ${msg.channel}`],
          whyItFitsYourGoal: msg.goalAlignmentReason,
          contacts: [
            {
              id: `ct-${Date.now()}`,
              name: msg.senderName,
              roleTitle: msg.senderTitle,
              email: msg.senderHandleOrEmail,
              preferredLanguage: msg.region === 'KR' ? 'ko-KR' : 'en-US',
            },
          ],
          estimatedDealValueUsd: msg.detectedBudgetUsd,
          nativeCurrency: msg.nativeCurrency,
          nativeEstimatedValue: msg.nativeBudgetAmount,
          assignedTalentIds: [ownerProfile.id],
          lastContactedAt: 'Today',
          nextFollowUpAt: 'Today',
          notes: msg.aiSummary,
          pitchHistory: [
            {
              id: `ph-${Date.now()}`,
              date: msg.receivedAt,
              direction: 'INBOUND',
              channel: msg.channel,
              subject: msg.subject,
              snippet: msg.aiSummary,
            },
          ],
        };
        setCompanies((prev) => [newCompany, ...prev]);
      }
    }
  };

  const updateInboundStatus = (id: string, status: InboundMessage['status']) => {
    setInboundMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const deleteInboundMessage = (id: string) => {
    setInboundMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const addCompany = (company: BrandCompany) => {
    setCompanies((prev) => {
      if (prev.some((c) => c.name.toLowerCase() === company.name.toLowerCase())) {
        return prev;
      }
      return [company, ...prev];
    });
  };

  const updateCompany = (id: string, updates: Partial<BrandCompany>) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCompany = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCompanyStatus = (id: string, outreachStatus: OutreachStatus, note?: string) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          outreachStatus,
          lastContactedAt: 'Today',
          notes: note ? `${note} • ${c.notes}` : c.notes,
        };
      })
    );
  };

  const logCompanyOutreach = (
    companyId: string,
    subject: string,
    snippet: string,
    channel: InboundMessage['channel'] = 'EMAIL'
  ) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id !== companyId) return c;
        const nextStatus: OutreachStatus =
          c.outreachStatus === 'SCOUTED' ? 'CONTACTED' : c.outreachStatus;
        return {
          ...c,
          outreachStatus: nextStatus,
          lastContactedAt: 'Today',
          pitchHistory: [
            {
              id: `ph-${Date.now()}`,
              date: 'Today, Just now',
              direction: 'OUTBOUND',
              channel,
              subject,
              snippet,
            },
            ...c.pitchHistory,
          ],
        };
      })
    );
    setCreatorGoal((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === 'ms-3' ? { ...m, current: m.current + 1 } : m
      ),
    }));
  };

  const addOrUpdateProposal = (proposal: ProposalPackage) => {
    setProposals((prev) => {
      const exists = prev.some((p) => p.id === proposal.id);
      if (exists) {
        return prev.map((p) => (p.id === proposal.id ? proposal : p));
      }
      return [proposal, ...prev];
    });
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === proposal.brandCompanyId &&
        (c.outreachStatus === 'SCOUTED' ||
          c.outreachStatus === 'CONTACTED' ||
          c.outreachStatus === 'INBOUND' ||
          c.outreachStatus === 'IN_CONVERSATION')
          ? { ...c, outreachStatus: 'PROPOSAL_SENT', lastContactedAt: 'Today' }
          : c
      )
    );
  };

  const acceptProposalTier = (proposalId: string, tierId: string) => {
    const targetProposal = proposals.find((p) => p.id === proposalId);
    if (!targetProposal) return;
    const chosenTier = targetProposal.tiers.find((t) => t.id === tierId) || targetProposal.tiers[1];

    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, selectedTierId: tierId, status: 'ACCEPTED' } : p
      )
    );

    setCompanies((prev) =>
      prev.map((c) =>
        c.id === targetProposal.brandCompanyId
          ? {
              ...c,
              outreachStatus: 'BOOKED',
              estimatedDealValueUsd: chosenTier.priceUsd,
              lastContactedAt: 'Today',
            }
          : c
      )
    );

    setCreatorGoal((prev) => ({
      ...prev,
      currentBookedUsd: prev.currentBookedUsd + chosenTier.priceUsd,
      milestones: prev.milestones.map((m) => {
        if (m.id === 'ms-1' && chosenTier.tierCode === 'RETAINER_PARTNERSHIP') {
          return { ...m, current: Math.min(m.target, m.current + 1) };
        }
        if (m.id === 'ms-2' && targetProposal.targetRole === 'ACTOR') {
          return { ...m, current: Math.min(m.target, m.current + 1) };
        }
        return m;
      }),
    }));
  };

  const renewUsageLicense = (licenseId: string) => {
    const target = usageLicenses.find((l) => l.id === licenseId);
    if (!target) return;
    setUsageLicenses((prev) =>
      prev.map((l) =>
        l.id === licenseId
          ? {
              ...l,
              status: 'RENEWED',
              daysRemaining: l.daysRemaining + 60,
              expiresOn: '2026-12-22',
            }
          : l
      )
    );
    setCreatorGoal((prev) => ({
      ...prev,
      currentBookedUsd: prev.currentBookedUsd + target.renewalFeeUsd,
    }));
  };

  const addTalentToRoster = (talent: TalentProfile) => {
    setTalentProfiles((prev) => [...prev, talent]);
  };

  const updateOwnerProfile = (updates: Partial<TalentProfile>) => {
    setTalentProfiles((prev) =>
      prev.map((t) => (t.id === ownerProfile.id ? { ...t, ...updates } : t))
    );
  };

  const toggleTalentInAgencyBrief = (briefId: string, talentId: string) => {
    setAgencyBriefs((prev) =>
      prev.map((b) => {
        if (b.id !== briefId) return b;
        const exists = b.matchedTalentIds.includes(talentId);
        return {
          ...b,
          matchedTalentIds: exists
            ? b.matchedTalentIds.filter((id) => id !== talentId)
            : [...b.matchedTalentIds, talentId],
        };
      })
    );
  };

  const pitchAgencyBriefRoster = (briefId: string) => {
    const target = agencyBriefs.find((b) => b.id === briefId);
    if (!target) return;
    setAgencyBriefs((prev) =>
      prev.map((b) =>
        b.id === briefId
          ? { ...b, status: b.status === 'OPEN_MATCHING' ? 'ROSTER_PITCHED' : 'BOOKED' }
          : b
      )
    );
    if (target.status === 'ROSTER_PITCHED') {
      const agencyCut = Math.round(target.budgetUsd * (target.agencyCommissionPct / 100));
      setCreatorGoal((prev) => ({
        ...prev,
        currentBookedUsd: prev.currentBookedUsd + agencyCut,
      }));
    }
  };

  const updateCreatorGoal = (updated: Partial<CreatorGoal>) => {
    setCreatorGoal((prev) => ({ ...prev, ...updated }));
  };

  const updatePlatformStatus = (platformId: string, applicationStatus: PlatformApplicationStatus) => {
    setUgcPlatforms((prev) =>
      prev.map((p) => (p.id === platformId ? { ...p, applicationStatus } : p))
    );
  };

  const clearToBlankWorkspace = () => {
    setInboundMessages([]);
    setCompanies([]);
    setProposals([]);
    setUsageLicenses([]);
    setAgencyBriefs([]);
    setCreatorGoal((prev) => ({
      ...prev,
      currentBookedUsd: 0,
      milestones: prev.milestones.map((m) => ({ ...m, current: 0 })),
    }));
    setUgcPlatforms(
      INITIAL_UGC_PLATFORMS.map((p) => ({ ...p, applicationStatus: 'NOT_STARTED' }))
    );
  };

  const exportCompaniesCsv = () => {
    const headers = [
      'Entity Type',
      'Company / Agency Name',
      'Industry / Niche',
      'Region',
      'Status',
      'Fit Score',
      'Estimated Value (USD)',
      'Primary Contact Name',
      'Contact Role',
      'Contact Email',
      'Website URL',
      'Last Contacted',
      'Notes',
    ];
    const rows = companies.map((c) => {
      const contact = c.contacts[0];
      return [
        c.entityType || 'BRAND',
        c.name,
        c.industryNiche,
        c.region,
        c.outreachStatus,
        String(c.brandFitScore),
        String(c.estimatedDealValueUsd),
        contact?.name || '',
        contact?.roleTitle || '',
        contact?.email || '',
        c.websiteUrl,
        c.lastContactedAt || '',
        (c.notes || '').replace(/\r?\n/g, ' '),
      ]
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vanguard-crm-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setWorkspace(INITIAL_WORKSPACE);
    setTalentProfiles(INITIAL_TALENT_PROFILES);
    setCreatorGoal(INITIAL_CREATOR_GOAL);
    setInboundMessages(INITIAL_INBOUND_MESSAGES);
    setCompanies(INITIAL_COMPANIES);
    setProposals(INITIAL_PROPOSALS);
    setUsageLicenses(INITIAL_USAGE_LICENSES);
    setAgencyBriefs(INITIAL_AGENCY_BRIEFS);
    setUgcPlatforms(INITIAL_UGC_PLATFORMS);
  };

  return React.createElement(
    WorkspaceContext.Provider,
    {
      value: {
        workspace,
        talentProfiles,
        ownerProfile,
        creatorGoal,
        inboundMessages,
        companies,
        proposals,
        usageLicenses,
        agencyBriefs,
        ugcPlatforms,
        setWorkspaceMode,
        setBaseCurrency,
        formatMoney,
        addInboundMessage,
        updateInboundStatus,
        deleteInboundMessage,
        addCompany,
        updateCompany,
        deleteCompany,
        updateCompanyStatus,
        logCompanyOutreach,
        addOrUpdateProposal,
        acceptProposalTier,
        renewUsageLicense,
        addTalentToRoster,
        updateOwnerProfile,
        toggleTalentInAgencyBrief,
        pitchAgencyBriefRoster,
        updateCreatorGoal,
        updatePlatformStatus,
        clearToBlankWorkspace,
        exportCompaniesCsv,
        resetDemoData,
      },
    },
    children
  );
};

export const useWorkspace = (): WorkspaceContextValue => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return ctx;
};
