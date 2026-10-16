export type WorkspaceMode = 'SOLO' | 'AGENCY';
export type CurrencyCode = 'USD' | 'KRW';
export type LocaleCode = 'en-US' | 'ko-KR';
export type TalentRole = 'ACTOR' | 'MODEL' | 'UGC_CREATOR';
export type RegionCode = 'US' | 'KR' | 'GLOBAL';
export type LeadEntityType = 'BRAND' | 'AGENCY';

export type InboundChannel = 'EMAIL' | 'IG_DM' | 'TIKTOK' | 'CASTING_BOARD' | 'BOOKING_PORTAL' | 'KAKAOTALK';
export type InboundCategory = 'SPONSORSHIP' | 'UGC_BRIEF' | 'CASTING_CALL' | 'MODEL_BOOKING' | 'FOLLOW_UP';

export type OutreachStatus =
  | 'SCOUTED'
  | 'CONTACTED'
  | 'INBOUND'
  | 'IN_CONVERSATION'
  | 'PROPOSAL_SENT'
  | 'BOOKED'
  | 'DELIVERED'
  | 'PAID';

export type UsageRightsType =
  | 'ORGANIC_ONLY'
  | 'PAID_ADS_WHITELIST'
  | 'SPARK_ADS'
  | 'DIGITAL_BUYOUT'
  | 'BROADCAST_TV_BUYOUT'
  | 'CATEGORY_EXCLUSIVITY';

export type UgcAgencyType =
  | 'PERFORMANCE_AD_AGENCY'
  | 'TIKTOK_SHOP_PARTNER'
  | 'KBEAUTY_GLOBAL_PR'
  | 'CREATOR_SEEDING_AGENCY'
  | 'COMMERCIAL_CASTING_AGENCY';

export type PlatformApplicationStatus =
  | 'NOT_STARTED'
  | 'APPLIED'
  | 'ACTIVE_PROFILE'
  | 'EARNING';

export interface Workspace {
  id: string;
  name: string;
  agencyName: string;
  mode: WorkspaceMode;
  baseCurrency: CurrencyCode;
  usdToKrwRate: number;
  defaultAgencyCommissionPct: number;
}

export interface TalentCompCard {
  height: string;
  hair: string;
  eyes: string;
  wardrobeSizes: string;
  location: string;
  unionStatus: string;
}

export interface TalentRateCard {
  ugcSingleVideoUsd: number;
  ugcThreeBundleUsd: number;
  actorHalfDayUsd: number;
  actorFullDayUsd: number;
  modelLookbookDayUsd: number;
  whitelisting30DayPct: number;
  exclusivityMonthlyUsd: number;
}

export interface TalentProfile {
  id: string;
  workspaceId: string;
  isOwner: boolean;
  displayName: string;
  handle: string;
  avatarUrl: string;
  headline: string;
  roles: TalentRole[];
  languages: ('EN' | 'KO' | 'JA' | 'ES')[];
  niches: string[];
  compCard: TalentCompCard;
  rateCard: TalentRateCard;
  portfolioHighlights: {
    id: string;
    title: string;
    brand: string;
    roleType: TalentRole;
    metricOrResult: string;
    thumbnailTag: string;
  }[];
  commissionSplitPct: number;
  availabilityStatus: 'AVAILABLE' | 'ON_SET' | 'BOOKING_NEXT_MONTH';
}

export interface CreatorGoal {
  id: string;
  workspaceId: string;
  periodLabel: string;
  targetRevenueUsd: number;
  currentBookedUsd: number;
  minProjectRateUsd: number;
  targetNiches: string[];
  preferredDealTypes: ('MONTHLY_RETAINER' | 'COMMERCIAL_ACTING' | 'UGC_AD_BUNDLE' | 'LOOKBOOK_CAMPAIGN')[];
  strategicFocusNote: string;
  milestones: {
    id: string;
    label: string;
    current: number;
    target: number;
    unit: string;
  }[];
}

export interface BrandContact {
  id: string;
  name: string;
  roleTitle: string;
  email: string;
  instagramOrLinkedin?: string;
  preferredLanguage: LocaleCode;
}

export interface BrandCompany {
  id: string;
  workspaceId: string;
  entityType?: LeadEntityType; // 'BRAND' or 'AGENCY'
  name: string;
  industryNiche: string;
  region: RegionCode;
  websiteUrl: string;
  outreachStatus: OutreachStatus;
  brandFitScore: number;
  activeAdSignals: string[];
  whyItFitsYourGoal: string;
  contacts: BrandContact[];
  estimatedDealValueUsd: number;
  nativeCurrency: CurrencyCode;
  nativeEstimatedValue: number;
  assignedTalentIds: string[];
  lastContactedAt: string;
  nextFollowUpAt?: string;
  notes: string;
  pitchHistory: {
    id: string;
    date: string;
    direction: 'INBOUND' | 'OUTBOUND';
    channel: InboundChannel;
    subject: string;
    snippet: string;
  }[];
  groundingSources?: {
    title: string;
    url: string;
  }[];
}

export interface UgcAgencyLead {
  id: string;
  name: string;
  agencyType: UgcAgencyType;
  region: RegionCode;
  headquarters: string;
  websiteUrl: string;
  rosterApplicationUrl: string;
  notableClientBrands: string[];
  hiresRoles: TalentRole[];
  typicalPayRangeUsd: string;
  estimatedRetainerOrBriefUsd: number;
  howToGetBooked: string;
  contactRoleTitle: string;
  contactEmailOrPortal: string;
  suggestedPitchSubject: string;
  suggestedPitchBody: string;
}

export interface UgcPlatformChannel {
  id: string;
  name: string;
  category:
    | 'MANAGED_UGC_NETWORK'
    | 'SELF_SERVE_MARKETPLACE'
    | 'CASTING_AND_ACTING'
    | 'TIKTOK_AND_SOCIAL_OFFICIAL';
  websiteUrl: string;
  creatorSignupUrl: string;
  typicalPayRange: string;
  bestForRoles: TalentRole[];
  barrierToEntry:
    | 'Easy (Immediate)'
    | 'Moderate (Sample Video)'
    | 'Selective (Portfolio Vetting)';
  howItWorks: string;
  proTipToWin: string;
  status: PlatformApplicationStatus;
}

export interface UgcPlaybookMethod {
  id: string;
  title: string;
  subtitle: string;
  earningPotential: string;
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'High-Ticket Pro';
  bestForRoles: TalentRole[];
  stepByStep: string[];
  emailOrDmSubject: string;
  emailOrDmTemplate: string;
}

export interface InboundMessage {
  id: string;
  workspaceId: string;
  brandCompanyId?: string;
  brandName: string;
  industryNiche: string;
  region: RegionCode;
  channel: InboundChannel;
  category: InboundCategory;
  senderName: string;
  senderTitle: string;
  senderHandleOrEmail: string;
  subject: string;
  rawMessage: string;
  aiSummary: string;
  detectedBudgetUsd: number;
  nativeCurrency: CurrencyCode;
  nativeBudgetAmount: number;
  goalAlignmentScore: number;
  goalAlignmentReason: string;
  urgency: 'HIGH_TODAY' | 'THIS_WEEK' | 'FLEXIBLE';
  requiresActionToday: boolean;
  status: 'UNREAD_TODAY' | 'TRIAGED' | 'PROPOSAL_DRAFTED' | 'REPLIED';
  receivedAt: string;
  targetTalentRole: TalentRole;
}

export interface DeliverableLineItem {
  id: string;
  label: string;
  category: 'UGC_VIDEO' | 'HOOK_VARIATION' | 'RAW_FOOTAGE' | 'ON_SET_SHOOT_DAY' | 'LOOKBOOK_STILLS' | 'USAGE_RIGHTS' | 'EXCLUSIVITY';
  quantity: number;
  unitPriceUsd: number;
}

export interface ProposalPricingTier {
  id: string;
  tierCode: 'STARTER' | 'GOAL_ALIGNED_RECOMMENDED' | 'RETAINER_PARTNERSHIP';
  name: string;
  subtitle: string;
  isRecommended: boolean;
  deliverables: string[];
  usageRightsSummary: string;
  turnaroundDays: number;
  priceUsd: number;
  priceKrw: number;
  goalImpactSummary: string;
}

export interface ProposalPackage {
  id: string;
  workspaceId: string;
  brandCompanyId: string;
  brandName: string;
  talentProfileId: string;
  title: string;
  campaignObjective: string;
  targetRole: TalentRole;
  locale: LocaleCode;
  currency: CurrencyCode;
  includeKoreanWithholdingTaxNote: boolean;
  goalAlignmentScore: number;
  goalAlignmentBreakdown: {
    revenueContributionPct: number;
    nicheMatch: boolean;
    meetsRateFloor: boolean;
    retainerPotential: boolean;
    explanation: string;
  };
  customDeliverables: DeliverableLineItem[];
  tiers: ProposalPricingTier[];
  selectedTierId: string;
  pitchEmailSubject: string;
  pitchMessageBody: string;
  creativeHooksProposed: {
    hookTitle: string;
    visualDirection: string;
    spokenLine: string;
  }[];
  shareableSlug: string;
  status: 'DRAFT' | 'SENT' | 'VIEWED_BY_BRAND' | 'ACCEPTED';
  createdAt: string;
}

export interface UsageRightsLicense {
  id: string;
  workspaceId: string;
  brandCompanyId: string;
  brandName: string;
  talentProfileId: string;
  campaignTitle: string;
  usageType: UsageRightsType;
  platforms: ('META_ADS' | 'TIKTOK_SPARK' | 'YOUTUBE_SHORTS' | 'BROADCAST_TV' | 'GLOBAL_DIGITAL')[];
  durationDays: number;
  startDate: string;
  expiresOn: string;
  daysRemaining: number;
  renewalFeeUsd: number;
  exclusivityCategory?: string;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'RENEWED';
}

export interface AgencyBrandBrief {
  id: string;
  workspaceId: string;
  brandName: string;
  campaignTitle: string;
  industryNiche: string;
  region: RegionCode;
  budgetUsd: number;
  nativeCurrency: CurrencyCode;
  nativeBudget: number;
  requiredRoles: TalentRole[];
  requiredLanguages: ('EN' | 'KO' | 'JA' | 'ES')[];
  creatorsNeededCount: number;
  matchedTalentIds: string[];
  agencyCommissionPct: number;
  status: 'OPEN_MATCHING' | 'ROSTER_PITCHED' | 'BOOKED';
  briefSummary: string;
}
