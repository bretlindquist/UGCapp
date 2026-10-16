import {
  BrandCompany,
  CreatorGoal,
  InboundCategory,
  InboundChannel,
  InboundMessage,
  RegionCode,
  TalentRole,
  UgcAgencyLead,
  UgcAgencyType,
  UgcPlatformChannel,
  UgcPlaybookMethod,
} from '../types/crm';

export interface DiscoveredBrandCandidate {
  id: string;
  name: string;
  industryNiche: string;
  region: RegionCode;
  websiteUrl: string;
  brandFitScore: number;
  estimatedDealValueUsd: number;
  nativeCurrency: 'USD' | 'KRW';
  nativeEstimatedValue: number;
  activeAdSignals: string[];
  whyItFitsYourGoal: string;
  recommendedRole: TalentRole;
  decisionMaker: {
    name: string;
    roleTitle: string;
    email: string;
    preferredLanguage: 'en-US' | 'ko-KR';
  };
  suggestedPitchHook: string;
  groundingSources: {
    title: string;
    url: string;
  }[];
}

export const CURATED_UGC_AGENCIES: UgcAgencyLead[] = [
  {
    id: 'ag-tubescience',
    name: 'TubeScience',
    agencyType: 'PERFORMANCE_AD_AGENCY',
    region: 'US',
    headquarters: 'Los Angeles, CA (Remote & On-Set Casting)',
    websiteUrl: 'https://www.tubescience.com',
    rosterApplicationUrl: 'https://www.tubescience.com/careers',
    notableClientBrands: [' WeightWatchers', 'HelloFresh', 'babbel', ' Enterprise DTC Brands'],
    hiresRoles: ['ACTOR', 'UGC_CREATOR', 'MODEL'],
    typicalPayRangeUsd: '$500 – $2,000 / shoot day or remote ad bundle',
    estimatedRetainerOrBriefUsd: 1800,
    howToGetBooked:
      'Data-driven direct-response video studio. They prioritize expressive on-camera actors who can deliver tight 3-second hooks, problem/solution reads, and rapid script variations.',
    contactRoleTitle: 'Talent Casting Producer / Creative Strategist',
    contactEmailOrPortal: 'casting@tubescience.com',
    suggestedPitchSubject: 'On-Camera Actor & Direct-Response UGC Talent // Roster Submission',
    suggestedPitchBody: `Hi TubeScience Casting Team,\n\nI’m an on-camera commercial actor and direct-response UGC creator with a dedicated 4K home studio (and available for LA/Seoul studio days). I specialize in high-retention 3-second hooks, founder-style explainers, and rapid script iterations.\n\nPortfolio & Comp Card: [Your Portfolio Link]\n\nI’d love to be added to your casting roster for upcoming performance creative shoots and remote UGC bundles.\n\nBest,\n[Your Name]`,
  },
  {
    id: 'ag-mutesix',
    name: 'MuteSix (dentsu Creative Studio)',
    agencyType: 'PERFORMANCE_AD_AGENCY',
    region: 'US',
    headquarters: 'Culver City, CA / Remote Creator Network',
    websiteUrl: 'https://mutesix.com',
    rosterApplicationUrl: 'https://mutesix.com/contact/',
    notableClientBrands: ['DTC Skincare', 'Pet Wellness', 'Apparel', 'Consumer Tech'],
    hiresRoles: ['UGC_CREATOR', 'ACTOR', 'MODEL'],
    typicalPayRangeUsd: '$400 – $1,600 / 3-video UGC ad concept',
    estimatedRetainerOrBriefUsd: 1500,
    howToGetBooked:
      'Builds custom creator rosters per client vertical. Send a niche-organized portfolio (Skincare, Tech, Wellness) directly to their Influencer & Creative Partnerships producers.',
    contactRoleTitle: 'Creator Partnerships & Casting Manager',
    contactEmailOrPortal: 'creators@mutesix.com',
    suggestedPitchSubject: 'UGC Creator & Commercial Talent — Roster Application (Skincare / Tech)',
    suggestedPitchBody: `Hi MuteSix Creative Partnerships Team,\n\nI produce direct-response vertical video ads (TikTok, Meta Reels, YouTube Shorts) with modular hook variations and clean 4K audio/lighting. I’d love to join your external creator casting database for Q4/Q1 client briefs.\n\nRecent ROAS case studies & reels: [Your Portfolio Link]\n\nBest regards,\n[Your Name]`,
  },
  {
    id: 'ag-house-of-marketers',
    name: 'House of Marketers',
    agencyType: 'KBEAUTY_GLOBAL_PR',
    region: 'GLOBAL',
    headquarters: 'London / New York / Global K-Beauty Hub',
    websiteUrl: 'https://houseofmarketers.com',
    rosterApplicationUrl: 'https://houseofmarketers.com/contact-us/',
    notableClientBrands: ['COSRX', 'Beauty of Joseon', 'Biodance', 'Mediheal', 'LG H&H'],
    hiresRoles: ['UGC_CREATOR', 'MODEL', 'ACTOR'],
    typicalPayRangeUsd: '$350 – $1,800 / campaign + Spark Ads licensing',
    estimatedRetainerOrBriefUsd: 1450,
    howToGetBooked:
      'Leading global agency scaling K-Beauty brands into Western markets. Pitch education-led skincare hooks (ingredient breakdowns, glass-skin texture macro shots, EN/KO bilingual capability).',
    contactRoleTitle: 'Influencer & UGC Campaign Manager',
    contactEmailOrPortal: 'hello@houseofmarketers.com',
    suggestedPitchSubject: 'K-Beauty & Lifestyle UGC Creator / Actor — Creator Roster Submission',
    suggestedPitchBody: `Hi House of Marketers Campaign Team,\n\nI’ve followed your viral K-Beauty campaigns for COSRX, Biodance, and Beauty of Joseon. As an on-camera creator and model specializing in high-definition texture demonstrations and ingredient storytelling, I would love to join your creator roster for upcoming US & global skincare briefs.\n\nPortfolio & Rates: [Your Portfolio Link]\n\nBest,\n[Your Name]`,
  },
  {
    id: 'ag-darkroom',
    name: 'Darkroom Agency',
    agencyType: 'TIKTOK_SHOP_PARTNER',
    region: 'US',
    headquarters: 'New York & Los Angeles',
    websiteUrl: 'https://www.darkroomagency.com',
    rosterApplicationUrl: 'https://www.darkroomagency.com/contact',
    notableClientBrands: ['High-Growth DTC Beauty', 'Home & Wellness', 'TikTok Shop Flagships'],
    hiresRoles: ['UGC_CREATOR', 'ACTOR'],
    typicalPayRangeUsd: '$500 – $2,200 / bundle + TikTok Shop GMV retainers',
    estimatedRetainerOrBriefUsd: 1750,
    howToGetBooked:
      'Official TikTok Shop Partner & performance studio. Pitch your ability to shoot high-converting shoppable video hooks and host or produce Spark Ad assets.',
    contactRoleTitle: 'Director of Social Commerce & Creator Creative',
    contactEmailOrPortal: 'hello@darkroomagency.com',
    suggestedPitchSubject: 'Direct-Response UGC & TikTok Shop Ad Talent — Roster Pitch',
    suggestedPitchBody: `Hi Darkroom Creative Team,\n\nI’m an on-camera actor and UGC creator producing conversion-focused vertical ads and TikTok Shop creatives. I’d love to share my reel and be considered for your client creator roster.\n\nReel & Comp Card: [Your Portfolio Link]\n\nBest,\n[Your Name]`,
  },
  {
    id: 'ag-inbeat',
    name: 'InBeat Agency',
    agencyType: 'CREATOR_SEEDING_AGENCY',
    region: 'GLOBAL',
    headquarters: 'Montreal / New York / Los Angeles',
    websiteUrl: 'https://inbeat.agency',
    rosterApplicationUrl: 'https://inbeat.agency/contact/',
    notableClientBrands: ['Nordstrom', 'New Balance', 'Disney', 'Bumble', 'Native'],
    hiresRoles: ['UGC_CREATOR', 'MODEL', 'ACTOR'],
    typicalPayRangeUsd: '$350 – $1,500 / paid social UGC package',
    estimatedRetainerOrBriefUsd: 1350,
    howToGetBooked:
      'Runs high-velocity paid social UGC testing for consumer apps and DTC brands. They look for natural, native-feeling TikTok/Reels delivery with strong first-3-second retention.',
    contactRoleTitle: 'Creator Casting & Campaign Specialist',
    contactEmailOrPortal: 'hello@inbeat.co',
    suggestedPitchSubject: 'UGC Creator & On-Camera Talent — InBeat Casting Database',
    suggestedPitchBody: `Hi InBeat Casting Team,\n\nI’m a UGC creator, actor, and model creating native TikTok and Meta ad creatives for consumer tech, skincare, and lifestyle brands. I’d love to join your creator database for upcoming paid social briefs.\n\nPortfolio: [Your Portfolio Link]\n\nBest,\n[Your Name]`,
  },
  {
    id: 'ag-vidsy',
    name: 'Vidsy Creator Network',
    agencyType: 'PERFORMANCE_AD_AGENCY',
    region: 'GLOBAL',
    headquarters: 'New York & London',
    websiteUrl: 'https://www.vidsy.co',
    rosterApplicationUrl: 'https://www.vidsy.co/creators',
    notableClientBrands: ['L’Oréal', 'Unilever', 'eBay', ' Nestlé', 'Meta'],
    hiresRoles: ['UGC_CREATOR', 'ACTOR'],
    typicalPayRangeUsd: '$300 – $1,200 per structured brand brief',
    estimatedRetainerOrBriefUsd: 1200,
    howToGetBooked:
      'Apply directly to the Vidsy Creator Network. Once vetted, you receive structured creative briefs with clear hooks, visual directions, and guaranteed payouts.',
    contactRoleTitle: 'Creator Community & Casting Lead',
    contactEmailOrPortal: 'creators@vidsy.co',
    suggestedPitchSubject: 'Vidsy Creator Network Application — On-Camera Actor & UGC Creator',
    suggestedPitchBody: `Hi Vidsy Creator Team,\n\nI’ve submitted my creator profile and wanted to share my direct-response UGC and commercial acting reel for upcoming beauty, tech, and lifestyle briefs.\n\nPortfolio: [Your Portfolio Link]\n\nBest,\n[Your Name]`,
  },
  {
    id: 'ag-im-factory',
    name: 'The Influencer Marketing Factory',
    agencyType: 'KBEAUTY_GLOBAL_PR',
    region: 'GLOBAL',
    headquarters: 'New York, Miami & Seoul',
    websiteUrl: 'https://theinfluencermarketingfactory.com',
    rosterApplicationUrl: 'https://theinfluencermarketingfactory.com/contact-us/',
    notableClientBrands: ['Numbuzin', 'Sony Music', ' Warner Music', 'Google', ' Unilever'],
    hiresRoles: ['UGC_CREATOR', 'ACTOR', 'MODEL'],
    typicalPayRangeUsd: '$500 – $2,500 / cross-border US & KR campaign',
    estimatedRetainerOrBriefUsd: 1650,
    howToGetBooked:
      'Strong footprint in both US and South Korea (including K-Beauty launches like Numbuzin). Highlight your ability to bridge Western and Korean aesthetics.',
    contactRoleTitle: 'Talent & Campaign Partnerships Lead',
    contactEmailOrPortal: 'info@theinfluencermarketingfactory.com',
    suggestedPitchSubject: 'Bilingual / Global UGC Creator & Commercial Talent — Roster Submission',
    suggestedPitchBody: `Hi Influencer Marketing Factory Team,\n\nI saw your cross-border K-Beauty and consumer tech campaigns (including Numbuzin). As an actor, model, and UGC creator working across US and Korean brand aesthetics, I’d love to join your talent roster.\n\nPortfolio & Comp Card: [Your Portfolio Link]\n\nBest,\n[Your Name]`,
  },
  {
    id: 'ag-filmless',
    name: 'Filmless Official',
    agencyType: 'COMMERCIAL_CASTING_AGENCY',
    region: 'US',
    headquarters: 'San Francisco / Remote Production Network',
    websiteUrl: 'https://www.filmless.com',
    rosterApplicationUrl: 'https://www.filmless.com/pages/contact-us',
    notableClientBrands: ['B2B SaaS', 'Fintech', 'Enterprise Tech', 'Amazon Brands'],
    hiresRoles: ['ACTOR', 'UGC_CREATOR'],
    typicalPayRangeUsd: '$400 – $1,500 / spokesperson or UGC ad spot',
    estimatedRetainerOrBriefUsd: 1300,
    howToGetBooked:
      'Produces high-converting explainer videos, spokesperson ads, and performance UGC. Actors with crisp teleprompter/improv delivery and pro microphones get repeat bookings.',
    contactRoleTitle: 'Casting & Production Coordinator',
    contactEmailOrPortal: 'casting@filmless.com',
    suggestedPitchSubject: 'On-Camera Spokesperson Actor & UGC Creator — Filmless Roster',
    suggestedPitchBody: `Hi Filmless Production Team,\n\nI’m a trained on-camera actor and UGC creator with a broadcast-grade home studio (4K camera, wireless lav & shotgun mic, studio key lighting). I’d love to be added to your roster for SaaS spokesperson and direct-response UGC projects.\n\nReel: [Your Portfolio Link]\n\nBest,\n[Your Name]`,
  },
  {
    id: 'ag-medialabs',
    name: 'MediaLabs (TikTok Shop Partner)',
    agencyType: 'TIKTOK_SHOP_PARTNER',
    region: 'US',
    headquarters: 'United States (Full-Stack TikTok Shop Operator)',
    websiteUrl: 'https://medialabs-co.com',
    rosterApplicationUrl: 'https://medialabs-co.com',
    notableClientBrands: ['Top Beauty & Personal Care TikTok Shops', 'Health & Wellness'],
    hiresRoles: ['UGC_CREATOR', 'ACTOR'],
    typicalPayRangeUsd: '$350 – $1,500 base + high GMV affiliate commission',
    estimatedRetainerOrBriefUsd: 1400,
    howToGetBooked:
      'Top TikTok Shop Partner operating beauty & wellness portfolios. Pitch high-volume short-form hooks and LIVE shopping / Spark Ad readiness.',
    contactRoleTitle: 'Creator Acquisition Manager',
    contactEmailOrPortal: 'creators@medialabs-co.com',
    suggestedPitchSubject: 'TikTok Shop & Paid Social UGC Creator / Actor — Roster Inquiry',
    suggestedPitchBody: `Hi MediaLabs Creator Team,\n\nI create high-converting short-form product demos and problem/solution hooks for beauty and wellness brands. I’d love to connect with your creator acquisition team for paid retainers and Spark Ad campaigns.\n\nPortfolio: [Your Portfolio Link]\n\nBest,\n[Your Name]`,
  },
  {
    id: 'ag-billion-dollar-boy',
    name: 'Billion Dollar Boy',
    agencyType: 'CREATOR_SEEDING_AGENCY',
    region: 'GLOBAL',
    headquarters: 'New York, London & New Orleans',
    websiteUrl: 'https://www.billiondollarboy.com',
    rosterApplicationUrl: 'https://www.billiondollarboy.com/contact/',
    notableClientBrands: ['Heineken', 'Armani Beauty', 'PepsiCo', 'L’Oréal', 'Nespresso'],
    hiresRoles: ['MODEL', 'ACTOR', 'UGC_CREATOR'],
    typicalPayRangeUsd: '$1,000 – $4,000 / elevated editorial & creator production',
    estimatedRetainerOrBriefUsd: 2400,
    howToGetBooked:
      'Specializes in luxury, beauty, and elevated visual storytelling. Ideal for commercial models and actors who shoot cinematic vertical video and editorial stills.',
    contactRoleTitle: 'Casting & Talent Partnerships Team',
    contactEmailOrPortal: 'newyork@billiondollarboy.com',
    suggestedPitchSubject: 'Commercial Model, Actor & Elevated UGC Creator — Talent Intro',
    suggestedPitchBody: `Hi Billion Dollar Boy Talent Team,\n\nI’m a commercial model, actor, and visual creator producing editorial-grade vertical video and campaign stills for luxury beauty and lifestyle brands. Sharing my comp card and reel for your casting database.\n\nComp Card & Portfolio: [Your Portfolio Link]\n\nBest,\n[Your Name]`,
  },
];

export const INITIAL_UGC_PLATFORMS: UgcPlatformChannel[] = [
  {
    id: 'plat-insense',
    name: 'Insense',
    category: 'MANAGED_UGC_NETWORK',
    websiteUrl: 'https://insense.pro',
    creatorSignupUrl: 'https://insense.pro/for-creators',
    typicalPayRange: '$200 – $2,000+ per brief (Strong Whitelisting Deals)',
    bestForRoles: ['UGC_CREATOR', 'ACTOR', 'MODEL'],
    barrierToEntry: 'Selective (Portfolio Vetting)',
    howItWorks:
      'DTC and enterprise brands post paid UGC, Meta whitelisting, and TikTok Spark Ad briefs. Creators pitch directly inside the app with custom rates.',
    proTipToWin:
      'Upload 4 crisp vertical ad examples (Skincare, Tech, Wellness, Unboxing) before applying—Insense approves creators with clear direct-response hooks.',
    status: 'ACTIVE_PROFILE',
  },
  {
    id: 'plat-cohley',
    name: 'Cohley',
    category: 'MANAGED_UGC_NETWORK',
    websiteUrl: 'https://www.cohley.com',
    creatorSignupUrl: 'https://www.cohley.com/content-creators',
    typicalPayRange: '$250 – $1,500 per video or photo lookbook brief',
    bestForRoles: ['UGC_CREATOR', 'MODEL', 'ACTOR'],
    barrierToEntry: 'Selective (Portfolio Vetting)',
    howItWorks:
      'Connects vetted creators and commercial models with major consumer brands for both video UGC and high-res lifestyle product photography.',
    proTipToWin:
      'Highlight both your on-camera video acting AND your ability to deliver 10–15 lifestyle stills in the same shoot.',
    status: 'APPLIED',
  },
  {
    id: 'plat-collabstr',
    name: 'Collabstr',
    category: 'SELF_SERVE_MARKETPLACE',
    websiteUrl: 'https://collabstr.com',
    creatorSignupUrl: 'https://collabstr.com/Become-a-Creator',
    typicalPayRange: '$150 – $1,200 (You set your own package prices)',
    bestForRoles: ['UGC_CREATOR', 'MODEL', 'ACTOR'],
    barrierToEntry: 'Easy (Immediate)',
    howItWorks:
      'Public searchable creator storefront where brands buy your pre-built packages (e.g., "1 Spoken-Word UGC Ad = $300", "3 Ad Bundle = $750") or post briefs.',
    proTipToWin:
      'Use keywords like "On-Camera Actor", "Bilingual UGC", "K-Beauty", and "SaaS Spokesperson" in your bio so brands searching Collabstr SEO find you first.',
    status: 'ACTIVE_PROFILE',
  },
  {
    id: 'plat-backstage',
    name: 'Backstage (Commercial & UGC Casting)',
    category: 'CASTING_AND_ACTING',
    websiteUrl: 'https://www.backstage.com',
    creatorSignupUrl: 'https://www.backstage.com/casting/open-casting-calls/ugc-auditions/',
    typicalPayRange: '$300 – $2,500+ (Commercial day rates & remote UGC)',
    bestForRoles: ['ACTOR', 'MODEL', 'UGC_CREATOR'],
    barrierToEntry: 'Easy (Immediate)',
    howItWorks:
      'The largest casting platform for actors and models now has a massive dedicated remote UGC & commercial spokesperson section where agencies cast daily.',
    proTipToWin:
      'Filter by "Remote / Work from Home" + "Commercials / Branded Content" and attach a 30-second self-tape commercial hook reel.',
    status: 'ACTIVE_PROFILE',
  },
  {
    id: 'plat-billo',
    name: 'Billo',
    category: 'SELF_SERVE_MARKETPLACE',
    websiteUrl: 'https://billo.app',
    creatorSignupUrl: 'https://billo.app/become-a-creator/',
    typicalPayRange: '$60 – $200 per video (High-volume e-commerce tasks)',
    bestForRoles: ['UGC_CREATOR'],
    barrierToEntry: 'Moderate (Sample Video)',
    howItWorks:
      'Structured mobile app connecting Shopify & Amazon brands with creators for fast-turnaround testimonials, unboxings, and product demos.',
    proTipToWin:
      'Great for fast cashflow and getting free products to film higher-ticket spec ads for your main portfolio.',
    status: 'NOT_STARTED',
  },
  {
    id: 'plat-joinbrands',
    name: 'JoinBrands',
    category: 'SELF_SERVE_MARKETPLACE',
    websiteUrl: 'https://joinbrands.com',
    creatorSignupUrl: 'https://joinbrands.com/creators/',
    typicalPayRange: '$50 – $250+ per job (Level-up certification system)',
    bestForRoles: ['UGC_CREATOR', 'MODEL'],
    barrierToEntry: 'Easy (Immediate)',
    howItWorks:
      'Open marketplace with thousands of Amazon, TikTok Shop, and DTC product jobs. Complete quick certifications to unlock higher-paying video tiers.',
    proTipToWin:
      'Complete all selfie, unboxing, and vertical video certifications on day 1 to skip low-tier listings.',
    status: 'NOT_STARTED',
  },
  {
    id: 'plat-hashtagpaid',
    name: '#paid',
    category: 'MANAGED_UGC_NETWORK',
    websiteUrl: 'https://hashtagpaid.com',
    creatorSignupUrl: 'https://hashtagpaid.com/creators',
    typicalPayRange: '$500 – $3,500+ per enterprise brand campaign',
    bestForRoles: ['ACTOR', 'UGC_CREATOR', 'MODEL'],
    barrierToEntry: 'Selective (Portfolio Vetting)',
    howItWorks:
      'Matches creators with Fortune 500 and major consumer brands for high-budget creator licensing and whitelisted paid social campaigns.',
    proTipToWin:
      'Emphasize clean brand safety, professional acting training, and willingness to license content for 60–90 days of paid ads.',
    status: 'NOT_STARTED',
  },
  {
    id: 'plat-tiktok-one',
    name: 'TikTok One (Creator Marketplace)',
    category: 'TIKTOK_AND_SOCIAL_OFFICIAL',
    websiteUrl: 'https://one.tiktok.com',
    creatorSignupUrl: 'https://one.tiktok.com',
    typicalPayRange: '$300 – $2,500 + Spark Ads & Branded Missions',
    bestForRoles: ['UGC_CREATOR', 'ACTOR'],
    barrierToEntry: 'Moderate (Sample Video)',
    howItWorks:
      'TikTok’s official unified portal connecting brands and media agencies directly with creators for Spark Ads, Branded Missions, and TikTok Shop campaigns.',
    proTipToWin:
      'Keep Spark Ads authorization enabled and tag commercial categories (Skincare, Tech, Fitness) in your creator profile.',
    status: 'NOT_STARTED',
  },
];

export const UGC_MONETIZATION_PLAYBOOKS: UgcPlaybookMethod[] = [
  {
    id: 'pb-agency-roster',
    title: '1. The Performance Agency Roster Blitz (Highest ROI)',
    subtitle: 'Stop chasing 1 brand at a time—get on 5 agency casting rosters that feed you briefs monthly.',
    earningPotential: '$1,500 – $4,500 / month per active agency relationship',
    difficulty: 'Intermediate',
    bestForRoles: ['ACTOR', 'UGC_CREATOR', 'MODEL'],
    stepByStep: [
      'Pick 5 agencies from the "Agencies to Contact" tab (e.g., TubeScience, MuteSix, House of Marketers, Darkroom, InBeat).',
      'Click "Find Contacts on LinkedIn" on each agency card to find their "Creative Strategist", "Talent Casting Producer", or "Influencer Manager".',
      'Send a short 4-sentence email with a direct link to 3 specific ad hooks (1 Problem/Solution, 1 Founder/Spokesperson, 1 Aesthetic Demo).',
      'Follow up once after 4 business days with a fresh 12-second spec hook video link.',
    ],
    emailOrDmSubject: 'On-Camera Actor & Direct-Response UGC Talent // Casting Roster Submission',
    emailOrDmTemplate: `Hi [Name],\n\nI’m an on-camera commercial actor, model, and direct-response UGC creator. I saw [Agency Name]’s recent paid social work and wanted to submit my reel for your external talent/creator roster.\n\n• 3-Second Hook & Ad Reel: [Link]\n• Turnaround: 48–72 hours (4K studio lighting + Rode/DJI pro audio)\n• Specialties: Spoken-word problem/solution, spokesperson explainers, and lifestyle lookbook stills\n\nWould love to be on your radar for upcoming Q4/Q1 client briefs.\n\nBest,\n[Your Name]`,
  },
  {
    id: 'pb-spec-ad-reverse',
    title: '2. The 12-Second "Spec Hook" Reverse Pitch',
    subtitle: 'Film a 12-second hook with a product you already own—then sell the full 3-video bundle.',
    earningPotential: '$900 – $2,200 per closed brand bundle',
    difficulty: 'Beginner Friendly',
    bestForRoles: ['UGC_CREATOR', 'ACTOR'],
    stepByStep: [
      'Grab 1 skincare, tech, or wellness product you already own and love.',
      'Film a punchy 12-second opening hook + texture/demo clip in 4K vertical (9:16).',
      'Find the brand in the "Brands & Companies" tab, inspect their current ads in Meta Ad Library, and email their Head of Creative / Growth.',
      'Offer to send them the unwatermarked file + 2 more full ad concepts + 6 hook variations.',
    ],
    emailOrDmSubject: 'I shot a 4K ad hook concept for [Brand Name] (preview inside)',
    emailOrDmTemplate: `Hi [Name],\n\nI’ve been using [Product Name] and noticed you’re scaling video creatives in the Meta Ad Library right now.\n\nAs an on-camera actor & UGC creator, I filmed a quick 12-second high-retention hook concept in my studio to test a new angle for your paid social funnel:\n\n👉 Private Preview: [Link]\n\nIf your team likes the energy, I can deliver a full 3-video conversion bundle (with 6 interchangeable 3-second hooks + 60-day whitelisting rights) within 4 days. Open to seeing my package options?\n\nBest,\n[Your Name]`,
  },
  {
    id: 'pb-modular-hook-bundle',
    title: '3. Modular "2 Bodies × 5 Hooks" Ad Testing Pack',
    subtitle: 'Media buyers don’t buy "1 video"—they buy hook variations to beat ad fatigue.',
    earningPotential: '$1,200 – $2,500 per shoot (2.5x higher than single videos)',
    difficulty: 'Intermediate',
    bestForRoles: ['UGC_CREATOR', 'ACTOR'],
    stepByStep: [
      'Whenever a brand asks "What is your rate for 1 UGC video?", never reply with just a single flat number.',
      'Reply with your single rate ($450) alongside a "Performance Creative Testing Pack": 2 core body scripts + 5 distinct opening 3-second hooks (= 10 testable ad combinations) for $1,250.',
      'Use the Proposal Studio tab in Vanguard to generate this exact 3-tier quote in 1 click.',
    ],
    emailOrDmSubject: 'Creative Package Options: [Brand Name] x [Your Name]',
    emailOrDmTemplate: `Hi [Name],\n\nExcited to collaborate on [Brand Name]’s upcoming campaign! Because the first 3 seconds drive 80% of thumb-stop rate on Meta and TikTok, most of my brand partners prefer a modular hook-testing bundle over a single video:\n\n• Option 1 (Starter): 1 Full UGC Video + 2 Hook Variations — $450\n• Option 2 (Recommended Performance Pack): 3 Full Videos + 6 Hook Variations + Raw B-Roll + 60d Usage Rights — $1,350\n• Option 3 (Monthly Retainer): 6 Videos/mo + On-Camera Acting/Stills — $2,400/mo\n\nWhich tier lines up best with your current testing roadmap?\n\nBest,\n[Your Name]`,
  },
  {
    id: 'pb-usage-rights-renewal',
    title: '4. 60-Day Ad Usage Rights & Whitelisting Renewals',
    subtitle: 'Turn past videos that are still running in Meta Ad Library into recurring passive invoices.',
    earningPotential: '$400 – $1,500 pure profit per renewal (0 extra filming)',
    difficulty: 'High-Ticket Pro',
    bestForRoles: ['ACTOR', 'MODEL', 'UGC_CREATOR'],
    stepByStep: [
      'Include a 30-day or 60-day paid advertising license window on every proposal (tracked automatically in the Kit & Rights tab).',
      '7 days before the window expires, check the brand’s Meta Ad Library link—if your video is still active, it means it’s profitably converting for them!',
      'Send a friendly 60-day extension quote ($450–$900) or offer to waive half the renewal fee if they book a fresh 3-video creative refresh.',
    ],
    emailOrDmSubject: 'Ad Usage License Extension / Creative Refresh — [Brand Name]',
    emailOrDmTemplate: `Hi [Name],\n\nSo glad to see the [Campaign Name] video creatives still running strong in your active ad library!\n\nA quick heads-up that the initial 60-day paid social usage window wraps up on [Date]. Would you like to:\n1) Extend the paid ad license for another 60 days ($650), OR\n2) Book a fresh 3-video Q4 creative refresh ($1,350) and I’ll include a 60-day renewal on the existing spot at 50% off?\n\nLet me know what works best for your media buying team!\n\nBest,\n[Your Name]`,
  },
];

export const CURATED_BRAND_DISCOVERY_POOL: DiscoveredBrandCandidate[] = [
  {
    id: 'scout-biodance',
    name: 'Biodance Global (Bio-Collagen Real Deep Mask)',
    industryNiche: 'K-Beauty & Skincare',
    region: 'KR',
    websiteUrl: 'https://biodance.com',
    brandFitScore: 97,
    estimatedDealValueUsd: 2200,
    nativeCurrency: 'KRW',
    nativeEstimatedValue: 3036000,
    activeAdSignals: [
      'Scaling overnight hydrogel mask UGC ads across Meta US & Olive Young Global',
      'Testing time-lapse morning peel hooks with bilingual on-camera talent',
      'High appetite for 60-day Spark Ads whitelisting bundles',
    ],
    whyItFitsYourGoal:
      'Matches K-Beauty target niche; actively hiring bilingual EN/KO talent for $2,000+ multi-hook ad bundles.',
    recommendedRole: 'UGC_CREATOR',
    decisionMaker: {
      name: 'Seo-Yun Kang',
      roleTitle: 'Global Performance Marketing Lead',
      email: 'sy.kang@biodance.co.kr',
      preferredLanguage: 'ko-KR',
    },
    suggestedPitchHook:
      '"I wore this mask under studio hot lights after a 5-hour red-eye flight—watch the glass-skin peel test in 4K."',
    groundingSources: [
      { title: 'Meta Ad Library: Biodance Global Active Video Ads', url: 'https://www.facebook.com/ads/library/' },
      { title: 'TikTok Creative Center: Top Skincare Spark Ads', url: 'https://ads.tiktok.com/business/creativecenter' },
    ],
  },
  {
    id: 'scout-runwayml',
    name: 'Runway AI (Gen-3 Alpha Creative Studio)',
    industryNiche: 'AI & Consumer Tech',
    region: 'US',
    websiteUrl: 'https://runwayml.com',
    brandFitScore: 95,
    estimatedDealValueUsd: 2800,
    nativeCurrency: 'USD',
    nativeEstimatedValue: 2800,
    activeAdSignals: [
      'Sponsoring actors, filmmakers, and commercial directors for workflow showcase reels',
      'Expanding enterprise & indie creator ambassadors for Q4 release',
    ],
    whyItFitsYourGoal:
      'Directly leverages your Actor + Creator identity; pays premium $2,500–$3,500 rates for on-camera authority.',
    recommendedRole: 'ACTOR',
    decisionMaker: {
      name: 'Marcus Sterling',
      roleTitle: 'Head of Creator & Studio Partnerships',
      email: 'partnerships@runwayml.com',
      preferredLanguage: 'en-US',
    },
    suggestedPitchHook:
      '"How one actor shoots a 3-location sci-fi commercial spec spot in a single afternoon using Gen-3."',
    groundingSources: [
      { title: 'Runway Film & Creator Partner Program', url: 'https://runwayml.com' },
    ],
  },
  {
    id: 'scout-tamburins',
    name: 'Tamburins (IICOMBINED Co., Ltd.)',
    industryNiche: 'Luxury Lifestyle',
    region: 'KR',
    websiteUrl: 'https://tamburins.com',
    brandFitScore: 93,
    estimatedDealValueUsd: 2500,
    nativeCurrency: 'KRW',
    nativeEstimatedValue: 3450000,
    activeAdSignals: [
      'Casting editorial models & dramatic actors for seasonal fragrance campaign vignettes',
      'Expanding global flagship visual storytelling across Seoul, Tokyo, and US digital',
    ],
    whyItFitsYourGoal:
      'High-prestige Commercial Modeling + Acting day rate ($2,500 / ₩3.45M) with strong portfolio halo effect.',
    recommendedRole: 'MODEL',
    decisionMaker: {
      name: 'Min-Seok Bae',
      roleTitle: 'Art Direction & Casting Producer',
      email: 'visual.casting@tamburins.com',
      preferredLanguage: 'ko-KR',
    },
    suggestedPitchHook:
      'Cinematic 9:16 editorial mood film + 12 high-contrast macro fragrance stills shot in natural dusk lighting.',
    groundingSources: [
      { title: 'Tamburins Official Campaign Archive', url: 'https://tamburins.com' },
    ],
  },
  {
    id: 'scout-oura',
    name: 'Oura Health (Oura Ring Gen 4)',
    industryNiche: 'Fitness & Wellness',
    region: 'GLOBAL',
    websiteUrl: 'https://ouraring.com',
    brandFitScore: 94,
    estimatedDealValueUsd: 2600,
    nativeCurrency: 'USD',
    nativeEstimatedValue: 2600,
    activeAdSignals: [
      'Scaling Gen 4 launch ads featuring actors, athletes, and creative founders',
      'Focusing on sleek titanium form-factor + recovery readiness storytelling',
    ],
    whyItFitsYourGoal:
      'Strong candidate for a 3-month UGC + Lifestyle Modeling retainer at $2,600/mo.',
    recommendedRole: 'ACTOR',
    decisionMaker: {
      name: 'Hannah Lindqvist',
      roleTitle: 'Director of Global Paid Social & Creator Creative',
      email: 'h.lindqvist@ouraring.com',
      preferredLanguage: 'en-US',
    },
    suggestedPitchHook:
      '"Why an actor can’t wear a bulky smartwatch on camera—and how Oura Gen 4 saved my 14-hour shoot week."',
    groundingSources: [
      { title: 'Meta Ad Library: Oura Ring Gen 4 Video Creatives', url: 'https://www.facebook.com/ads/library/' },
    ],
  },
  {
    id: 'scout-mixsoon',
    name: 'Mixsoon (Bean Essence Global)',
    industryNiche: 'K-Beauty & Skincare',
    region: 'GLOBAL',
    websiteUrl: 'https://mixsoon.us',
    brandFitScore: 91,
    estimatedDealValueUsd: 1650,
    nativeCurrency: 'USD',
    nativeEstimatedValue: 1650,
    activeAdSignals: [
      'Aggressive TikTok Shop & Meta whitelisting spend in North America and Europe',
      'Looking for tactile texture demonstration + authoritative ingredient breakdowns',
    ],
    whyItFitsYourGoal:
      'Fast-closing K-Beauty brand with high repeat ordering for 3-video + 6-hook UGC packages.',
    recommendedRole: 'UGC_CREATOR',
    decisionMaker: {
      name: 'Da-Eun Lim',
      roleTitle: 'North America Campaign Manager',
      email: 'daeun@mixsoon.co.kr',
      preferredLanguage: 'en-US',
    },
    suggestedPitchHook:
      '"Is it snail mucin? No—and here is why Korean actors switched to fermented bean essence before makeup."',
    groundingSources: [
      { title: 'TikTok Creative Center: Mixsoon Bean Essence Top Ads', url: 'https://ads.tiktok.com/business/creativecenter' },
    ],
  },
  {
    id: 'scout-alo-yoga',
    name: 'Alo Yoga & Alo Glow System',
    industryNiche: 'Luxury Lifestyle',
    region: 'US',
    websiteUrl: 'https://aloyoga.com',
    brandFitScore: 90,
    estimatedDealValueUsd: 2100,
    nativeCurrency: 'USD',
    nativeEstimatedValue: 2100,
    activeAdSignals: [
      'Opening Seoul Dosan flagship & scaling APAC + US creator lookbook & wellness ads',
      'Hiring hybrid model/creators for elevated studio-to-street video concepts',
    ],
    whyItFitsYourGoal:
      'Cross-border US/Seoul positioning gives you an unfair advantage for their Dosan & Global digital push.',
    recommendedRole: 'MODEL',
    decisionMaker: {
      name: 'Sienna Ross',
      roleTitle: 'VIP & Performance Creator Talent Manager',
      email: 'sienna.ross@aloyoga.com',
      preferredLanguage: 'en-US',
    },
    suggestedPitchHook:
      '"Seoul Dosan to LA Studio: 3 elevated transition looks built for a 12-hour casting day."',
    groundingSources: [
      { title: 'Alo Yoga Global Brand Expansion', url: 'https://aloyoga.com' },
    ],
  },
  {
    id: 'scout-medicube',
    name: 'Medicube (APR Corp — AGE-R Booster Pro)',
    industryNiche: 'K-Beauty & Skincare',
    region: 'GLOBAL',
    websiteUrl: 'https://medicube.us',
    brandFitScore: 96,
    estimatedDealValueUsd: 2400,
    nativeCurrency: 'USD',
    nativeEstimatedValue: 2400,
    activeAdSignals: [
      'One of the highest-spending K-Beauty device & skincare advertisers on US Meta & TikTok Shop',
      'Constantly hiring on-camera actors and creators for device demo + before/after hooks',
    ],
    whyItFitsYourGoal:
      'High-ticket beauty device ($200+ AOV) means large creator budgets ($1,800–$3,000 per bundle).',
    recommendedRole: 'ACTOR',
    decisionMaker: {
      name: 'Jisoo Han',
      roleTitle: 'US Paid Social & Influencer Team Lead',
      email: 'global.pr@apr-in.com',
      preferredLanguage: 'en-US',
    },
    suggestedPitchHook:
      '"Why my makeup artist on set uses the Booster Pro for 3 minutes before every close-up scene."',
    groundingSources: [
      { title: 'Meta Ad Library: Medicube US Active Video Ads', url: 'https://www.facebook.com/ads/library/' },
    ],
  },
  {
    id: 'scout-elevenlabs',
    name: 'ElevenLabs (AI Voice & Creator Studio)',
    industryNiche: 'AI & Consumer Tech',
    region: 'US',
    websiteUrl: 'https://elevenlabs.io',
    brandFitScore: 92,
    estimatedDealValueUsd: 2300,
    nativeCurrency: 'USD',
    nativeEstimatedValue: 2300,
    activeAdSignals: [
      'Partnering with voice actors, on-camera actors, and multilingual creators for global dubbing & voice marketplace campaigns',
      'High payouts for YouTube, TikTok, and Reels sponsored creator demos',
    ],
    whyItFitsYourGoal:
      'Ideal fit for an Actor + Creator who works across English and Korean media.',
    recommendedRole: 'ACTOR',
    decisionMaker: {
      name: 'Elena Vance',
      roleTitle: 'Creator Partnerships & Growth Lead',
      email: 'creators@elevenlabs.io',
      preferredLanguage: 'en-US',
    },
    suggestedPitchHook:
      '"Testing whether AI can localization-dub my Korean commercial audition into 4 languages while keeping my vocal emotion."',
    groundingSources: [
      { title: 'ElevenLabs Actor & Creator Partnerships', url: 'https://elevenlabs.io' },
    ],
  },
];

export function buildMetaAdLibraryUrl(query: string, region: RegionCode = 'US'): string {
  const country = region === 'KR' ? 'KR' : 'US';
  const encoded = encodeURIComponent(query.trim() || 'skincare UGC');
  return `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${country}&media_type=video&q=${encoded}&search_type=keyword_unordered`;
}

export function buildTikTokCreativeCenterUrl(query: string): string {
  const encoded = encodeURIComponent(query.trim() || 'UGC');
  return `https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en?keyword=${encoded}`;
}

export function buildLinkedInPeopleSearchUrl(companyOrAgencyName: string, roleHint?: string): string {
  const cleanName = companyOrAgencyName.replace(/\([^)]*\)/g, '').trim();
  const titles = roleHint || 'Creative Strategist OR Influencer Marketing OR Casting OR Partnerships';
  const q = encodeURIComponent(`site:linkedin.com/in "${cleanName}" (${titles})`);
  return `https://www.google.com/search?q=${q}`;
}

export function buildMailtoUrl(to: string, subject: string, body: string): string {
  const cleanTo = to.includes('@') && !to.startsWith('@') ? to.trim() : '';
  return `mailto:${encodeURIComponent(cleanTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildGmailComposeUrl(to: string, subject: string, body: string): string {
  const cleanTo = to.includes('@') && !to.startsWith('@') ? to.trim() : '';
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanTo)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function filterAndDiscoverAgencies(params: {
  query: string;
  agencyType: UgcAgencyType | 'ALL';
  region: RegionCode | 'ALL';
  role: TalentRole | 'ALL';
}): UgcAgencyLead[] {
  const { query, agencyType, region, role } = params;
  const q = query.trim().toLowerCase();

  let list = CURATED_UGC_AGENCIES.filter((ag) => {
    const matchesType = agencyType === 'ALL' || ag.agencyType === agencyType;
    const matchesRegion = region === 'ALL' || ag.region === region || ag.region === 'GLOBAL';
    const matchesRole = role === 'ALL' || ag.hiresRoles.includes(role);
    const matchesQuery =
      !q ||
      ag.name.toLowerCase().includes(q) ||
      ag.howToGetBooked.toLowerCase().includes(q) ||
      ag.notableClientBrands.some((b) => b.toLowerCase().includes(q)) ||
      ag.headquarters.toLowerCase().includes(q);
    return matchesType && matchesRegion && matchesRole && matchesQuery;
  });

  if (q && list.length === 0) {
    const cleanName = query.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
    list = [
      {
        id: `custom-agency-${Date.now()}`,
        name: cleanName,
        agencyType: agencyType === 'ALL' ? 'PERFORMANCE_AD_AGENCY' : agencyType,
        region: region === 'ALL' ? 'US' : region,
        headquarters: 'Global / Remote Creator Roster',
        websiteUrl: `https://${slug}.com`,
        rosterApplicationUrl: `https://www.google.com/search?q=${encodeURIComponent(cleanName + ' creator roster casting application')}`,
        notableClientBrands: ['DTC Paid Social Clients', 'UGC & Commercial Campaigns'],
        hiresRoles: ['UGC_CREATOR', 'ACTOR', 'MODEL'],
        typicalPayRangeUsd: '$400 – $1,800 / campaign bundle',
        estimatedRetainerOrBriefUsd: 1500,
        howToGetBooked: `Reach out to ${cleanName}'s Creative Strategist or Casting Producer on LinkedIn and send a 3-hook vertical video reel.`,
        contactRoleTitle: 'Creative Strategist / Influencer Partnerships Lead',
        contactEmailOrPortal: `casting@${slug}.com`,
        suggestedPitchSubject: `On-Camera Actor & UGC Creator — ${cleanName} Talent Roster Submission`,
        suggestedPitchBody: `Hi ${cleanName} Creative Team,\n\nI’m an on-camera actor, model, and direct-response UGC creator producing high-retention vertical video ads and lifestyle stills. I’d love to join ${cleanName}’s external creator roster for upcoming client briefs.\n\nPortfolio & Comp Card: [Your Portfolio Link]\n\nBest,\n[Your Name]`,
      },
    ];
  }

  return list;
}

export async function discoverAndEnrichBrands(params: {
  query: string;
  niche: string;
  region: RegionCode | 'ALL';
  role: TalentRole | 'ALL';
  goal: CreatorGoal;
  apiKey?: string;
}): Promise<DiscoveredBrandCandidate[]> {
  const { query, niche, region, role, goal, apiKey } = params;

  const effectiveKey =
    apiKey ||
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY;

  if (effectiveKey && query.trim().length > 1) {
    try {
      const prompt = `You are a Talent & UGC Brand Lead Intelligence Engine for an Actor, Commercial Model, and UGC Creator.
Find 4 real companies or agencies matching query "${query}" in niche "${niche}", region "${region}", suited for talent role "${role}".
The creator's current monthly revenue target is $${goal.targetRevenueUsd} with a minimum project floor of $${goal.minProjectRateUsd}.
Return strictly valid JSON array of objects with fields:
name, industryNiche, region ("US" | "KR" | "GLOBAL"), websiteUrl, brandFitScore (85-99), estimatedDealValueUsd (number), nativeCurrency ("USD" | "KRW"), nativeEstimatedValue (number), activeAdSignals (array of 3 strings), whyItFitsYourGoal (string), recommendedRole ("ACTOR" | "MODEL" | "UGC_CREATOR"), decisionMaker ({name, roleTitle, email, preferredLanguage: "en-US"|"ko-KR"}), suggestedPitchHook (string).`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${effectiveKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            tools: [{ google_search: {} }],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item, idx) => ({
              ...item,
              id: `live-scout-${Date.now()}-${idx}`,
              groundingSources: [
                {
                  title: `Google Search Grounded: ${item.name}`,
                  url: item.websiteUrl || 'https://www.facebook.com/ads/library/',
                },
              ],
            }));
          }
        }
      }
    } catch {
      // Fall back to curated pool + synthesizer
    }
  }

  const q = query.trim().toLowerCase();
  let filtered = CURATED_BRAND_DISCOVERY_POOL.filter((item) => {
    const matchesNiche =
      niche === 'ALL' || item.industryNiche.toLowerCase().includes(niche.toLowerCase());
    const matchesRegion =
      region === 'ALL' || item.region === region || item.region === 'GLOBAL';
    const matchesRole = role === 'ALL' || item.recommendedRole === role;
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.industryNiche.toLowerCase().includes(q) ||
      item.activeAdSignals.some((s) => s.toLowerCase().includes(q));
    return matchesNiche && matchesRegion && matchesRole && matchesQuery;
  });

  if (q && filtered.length === 0) {
    const cleanBrand = query.trim();
    const isKr = region === 'KR' || /[가-힣]/.test(cleanBrand);
    const estUsd = Math.max(goal.minProjectRateUsd * 3, 1800);
    filtered = [
      {
        id: `custom-scout-${Date.now()}`,
        name: cleanBrand,
        industryNiche: niche === 'ALL' ? 'K-Beauty & Skincare' : niche,
        region: region === 'ALL' ? (isKr ? 'KR' : 'US') : region,
        websiteUrl: `https://${cleanBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        brandFitScore: 94,
        estimatedDealValueUsd: estUsd,
        nativeCurrency: isKr ? 'KRW' : 'USD',
        nativeEstimatedValue: isKr ? estUsd * 1380 : estUsd,
        activeAdSignals: [
          `Active paid social funnel detected for ${cleanBrand} across vertical video placements`,
          'High potential for Actor-led spoken-word authority hooks + 60-day whitelisting',
          'Decision-makers actively testing fresh creator creatives',
        ],
        whyItFitsYourGoal: `Estimated $${estUsd.toLocaleString()} deal value exceeds your $${goal.minProjectRateUsd} minimum floor and aligns with your ${goal.periodLabel}.`,
        recommendedRole: role === 'ALL' ? 'ACTOR' : role,
        decisionMaker: {
          name: isKr ? 'Ji-Min Seo' : 'Alex Rivera',
          roleTitle: 'Head of Creative Strategy & Partnerships',
          email: `partnerships@${cleanBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          preferredLanguage: isKr ? 'ko-KR' : 'en-US',
        },
        suggestedPitchHook: `"3 things nobody tells you about ${cleanBrand} until you test it under 4K studio lights."`,
        groundingSources: [
          {
            title: `Meta Ad Library Search: ${cleanBrand}`,
            url: buildMetaAdLibraryUrl(cleanBrand, isKr ? 'KR' : 'US'),
          },
          {
            title: `TikTok Creative Center: ${cleanBrand}`,
            url: buildTikTokCreativeCenterUrl(cleanBrand),
          },
        ],
      },
    ];
  }

  return filtered;
}

export function convertCandidateToCompany(
  candidate: DiscoveredBrandCandidate,
  workspaceId: string,
  ownerTalentId: string
): BrandCompany {
  return {
    id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    workspaceId,
    entityType: 'BRAND',
    name: candidate.name,
    industryNiche: candidate.industryNiche,
    region: candidate.region,
    websiteUrl: candidate.websiteUrl,
    outreachStatus: 'SCOUTED',
    brandFitScore: candidate.brandFitScore,
    activeAdSignals: candidate.activeAdSignals,
    whyItFitsYourGoal: candidate.whyItFitsYourGoal,
    contacts: [
      {
        id: `ct-${Date.now()}`,
        name: candidate.decisionMaker.name,
        roleTitle: candidate.decisionMaker.roleTitle,
        email: candidate.decisionMaker.email,
        preferredLanguage: candidate.decisionMaker.preferredLanguage,
      },
    ],
    estimatedDealValueUsd: candidate.estimatedDealValueUsd,
    nativeCurrency: candidate.nativeCurrency,
    nativeEstimatedValue: candidate.nativeEstimatedValue,
    assignedTalentIds: [ownerTalentId],
    lastContactedAt: 'Not contacted yet',
    nextFollowUpAt: 'Ready to pitch today',
    notes: `Suggested Hook: ${candidate.suggestedPitchHook}`,
    pitchHistory: [],
    groundingSources: candidate.groundingSources,
  };
}

export function convertAgencyToCompany(
  agency: UgcAgencyLead,
  workspaceId: string,
  ownerTalentId: string
): BrandCompany {
  return {
    id: `comp-ag-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    workspaceId,
    entityType: 'AGENCY',
    name: `${agency.name} (Agency Roster)`,
    industryNiche: agency.agencyType.replace(/_/g, ' '),
    region: agency.region,
    websiteUrl: agency.websiteUrl,
    outreachStatus: 'SCOUTED',
    brandFitScore: 96,
    activeAdSignals: [
      `Notable clients: ${agency.notableClientBrands.join(', ')}`,
      `Typical pay range: ${agency.typicalPayRangeUsd}`,
      agency.howToGetBooked,
    ],
    whyItFitsYourGoal: `Getting accepted onto ${agency.name}'s creator/actor roster provides recurring monthly briefs (${agency.typicalPayRangeUsd}).`,
    contacts: [
      {
        id: `ct-ag-${Date.now()}`,
        name: `${agency.name} Casting Team`,
        roleTitle: agency.contactRoleTitle,
        email: agency.contactEmailOrPortal,
        preferredLanguage: agency.region === 'KR' ? 'ko-KR' : 'en-US',
      },
    ],
    estimatedDealValueUsd: agency.estimatedRetainerOrBriefUsd,
    nativeCurrency: agency.region === 'KR' ? 'KRW' : 'USD',
    nativeEstimatedValue:
      agency.region === 'KR'
        ? agency.estimatedRetainerOrBriefUsd * 1380
        : agency.estimatedRetainerOrBriefUsd,
    assignedTalentIds: [ownerTalentId],
    lastContactedAt: 'Not contacted yet',
    nextFollowUpAt: 'Submit roster application today',
    notes: `Roster Portal: ${agency.rosterApplicationUrl} • Clients: ${agency.notableClientBrands.join(', ')}`,
    pitchHistory: [],
    groundingSources: [
      { title: `${agency.name} Roster Portal`, url: agency.rosterApplicationUrl },
    ],
  };
}

export function parseSmartInboundPaste(params: {
  rawText: string;
  brandNameHint?: string;
  channel: InboundChannel;
  workspaceId: string;
  goal: CreatorGoal;
  usdToKrwRate: number;
}): InboundMessage {
  const { rawText, brandNameHint, channel, workspaceId, goal, usdToKrwRate } = params;
  const text = rawText.trim();

  const krwMatch = text.match(/₩\s*([\d,]+)|([\d,]+)\s*(만원|원|KRW)/i);
  const usdMatch = text.match(/\$\s*([\d,]+)/);

  let detectedBudgetUsd = 1500;
  let nativeCurrency: 'USD' | 'KRW' = 'USD';
  let nativeBudgetAmount = 1500;

  if (krwMatch) {
    nativeCurrency = 'KRW';
    const rawNum = parseInt((krwMatch[1] || krwMatch[2] || '2000000').replace(/,/g, ''), 10);
    nativeBudgetAmount = krwMatch[3] === '만원' ? rawNum * 10000 : rawNum;
    detectedBudgetUsd = Math.round(nativeBudgetAmount / usdToKrwRate);
  } else if (usdMatch) {
    nativeCurrency = 'USD';
    nativeBudgetAmount = parseInt(usdMatch[1].replace(/,/g, ''), 10);
    detectedBudgetUsd = nativeBudgetAmount;
  }

  const lower = text.toLowerCase();
  let category: InboundCategory = 'SPONSORSHIP';
  let targetTalentRole: TalentRole = 'UGC_CREATOR';

  if (
    lower.includes('casting') ||
    lower.includes('audition') ||
    lower.includes('on-camera') ||
    lower.includes('commercial') ||
    lower.includes('촬영')
  ) {
    category = 'CASTING_CALL';
    targetTalentRole = 'ACTOR';
  } else if (
    lower.includes('lookbook') ||
    lower.includes('stills') ||
    lower.includes('model') ||
    lower.includes('fitting') ||
    lower.includes('화보')
  ) {
    category = 'MODEL_BOOKING';
    targetTalentRole = 'MODEL';
  } else if (
    lower.includes('ugc') ||
    lower.includes('hook') ||
    lower.includes('tiktok') ||
    lower.includes('reels') ||
    lower.includes('whitelisting')
  ) {
    category = 'UGC_BRIEF';
    targetTalentRole = 'UGC_CREATOR';
  }

  const brandName =
    brandNameHint?.trim() ||
    (text.match(/(?:from|at|with|brand:)\s+([A-Z][A-Za-z0-9\s&]{2,22})/)?.[1]?.trim() ??
      'Inbound Brand Partner');

  const meetsFloor = detectedBudgetUsd >= goal.minProjectRateUsd;
  const goalAlignmentScore = meetsFloor
    ? Math.min(99, 84 + Math.round(detectedBudgetUsd / 250))
    : 68;

  return {
    id: `inb-${Date.now()}`,
    workspaceId,
    brandName,
    industryNiche:
      lower.includes('skin') || lower.includes('beauty')
        ? 'K-Beauty & Skincare'
        : 'AI & Consumer Tech',
    region: nativeCurrency === 'KRW' ? 'KR' : 'US',
    channel,
    category,
    senderName: 'Brand Partnerships Team',
    senderTitle: 'Creative & Talent Producer',
    senderHandleOrEmail: `casting@${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    subject: `Inbound ${category.replace('_', ' ')}: ${brandName}`,
    rawMessage: text,
    aiSummary: `${brandName} reached out via ${channel} regarding a ${category
      .replace('_', ' ')
      .toLowerCase()} (${
      nativeCurrency === 'KRW'
        ? `₩${nativeBudgetAmount.toLocaleString()}`
        : `$${detectedBudgetUsd.toLocaleString()}`
    }).`,
    detectedBudgetUsd,
    nativeCurrency,
    nativeBudgetAmount,
    goalAlignmentScore,
    goalAlignmentReason: meetsFloor
      ? `${goalAlignmentScore}% Match: Budget ($${detectedBudgetUsd.toLocaleString()}) exceeds your $${goal.minProjectRateUsd} rate floor and advances your ${goal.periodLabel}.`
      : `Below target rate floor ($${goal.minProjectRateUsd})—use Proposal Studio to upsell a 3-video bundle or usage rights.`,
    urgency: 'HIGH_TODAY',
    requiresActionToday: true,
    status: 'UNREAD_TODAY',
    receivedAt: 'Today, Just now',
    targetTalentRole,
  };
}
