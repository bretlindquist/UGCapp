import {
  BrandCompany,
  CreatorGoal,
  CurrencyCode,
  DeliverableLineItem,
  LocaleCode,
  ProposalPackage,
  ProposalPricingTier,
  TalentProfile,
  TalentRole,
} from '../types/crm';

export function generateGoalAlignedProposal(params: {
  company: BrandCompany;
  talent: TalentProfile;
  goal: CreatorGoal;
  locale: LocaleCode;
  currency: CurrencyCode;
  targetRole: TalentRole;
  usdToKrwRate: number;
  includeKoreanWithholdingTaxNote: boolean;
}): ProposalPackage {
  const {
    company,
    talent,
    goal,
    locale,
    currency,
    targetRole,
    usdToKrwRate,
    includeKoreanWithholdingTaxNote,
  } = params;

  const remainingRevenueGapUsd = Math.max(1000, goal.targetRevenueUsd - goal.currentBookedUsd);
  const baseSingleRate = talent.rateCard.ugcSingleVideoUsd;

  // Customize default deliverables based on Actor vs Model vs UGC Creator role
  let customDeliverables: DeliverableLineItem[] = [];
  if (targetRole === 'ACTOR') {
    customDeliverables = [
      {
        id: `del-${Date.now()}-1`,
        label: 'On-Camera Actor Spokesperson / Commercial Spots (30–60s, 4K)',
        category: 'UGC_VIDEO',
        quantity: 3,
        unitPriceUsd: 550,
      },
      {
        id: `del-${Date.now()}-2`,
        label: 'Direct-Response Scroll-Stopping Hook Variations',
        category: 'HOOK_VARIATION',
        quantity: 6,
        unitPriceUsd: 95,
      },
      {
        id: `del-${Date.now()}-3`,
        label: '60-Day Paid Social & Digital Buyout Usage License',
        category: 'USAGE_RIGHTS',
        quantity: 1,
        unitPriceUsd: 400,
      },
    ];
  } else if (targetRole === 'MODEL') {
    customDeliverables = [
      {
        id: `del-${Date.now()}-1`,
        label: 'Commercial Lookbook & Key Visual Production Day (On-Location / Studio)',
        category: 'ON_SET_SHOOT_DAY',
        quantity: 1,
        unitPriceUsd: talent.rateCard.modelLookbookDayUsd,
      },
      {
        id: `del-${Date.now()}-2`,
        label: 'High-Resolution Retouched Campaign Stills (15 Frames)',
        category: 'LOOKBOOK_STILLS',
        quantity: 1,
        unitPriceUsd: 350,
      },
      {
        id: `del-${Date.now()}-3`,
        label: '90-Day Global Digital Lookbook & Paid Social Usage Rights',
        category: 'USAGE_RIGHTS',
        quantity: 1,
        unitPriceUsd: 450,
      },
    ];
  } else {
    customDeliverables = [
      {
        id: `del-${Date.now()}-1`,
        label: 'High-Converting Vertical UGC Performance Ads (9:16 Edited)',
        category: 'UGC_VIDEO',
        quantity: 4,
        unitPriceUsd: baseSingleRate,
      },
      {
        id: `del-${Date.now()}-2`,
        label: 'A/B Hook Variations (First 3 Seconds)',
        category: 'HOOK_VARIATION',
        quantity: 8,
        unitPriceUsd: 80,
      },
      {
        id: `del-${Date.now()}-3`,
        label: 'Raw Uncut B-Roll & Product Macro Clips Vault',
        category: 'RAW_FOOTAGE',
        quantity: 1,
        unitPriceUsd: 250,
      },
      {
        id: `del-${Date.now()}-4`,
        label: '60-Day Meta & TikTok Spark Ads Whitelisting Rights',
        category: 'USAGE_RIGHTS',
        quantity: 1,
        unitPriceUsd: 300,
      },
    ];
  }

  const recommendedTotalUsd = customDeliverables.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceUsd,
    0
  );
  const starterTotalUsd = Math.round(recommendedTotalUsd * 0.62);
  const retainerMonthlyUsd = Math.round(recommendedTotalUsd * 0.9);

  const isKo = locale === 'ko-KR';

  const tiers: ProposalPricingTier[] = [
    {
      id: 'tier-starter',
      tierCode: 'STARTER',
      name: isKo ? 'Tier 1: 후크 검증 스타터 패키지 (Hook Test)' : 'Tier 1: Rapid Hook Validation Pack',
      subtitle: isKo
        ? '초기 메타/틱톡 A/B 테스트를 위한 핵심 숏폼 광고 + 다중 후크 구성'
        : 'Low-friction creative test for immediate Meta/TikTok A/B split testing',
      isRecommended: false,
      deliverables: isKo
        ? [
            '본편 숏폼/브랜드 영상 2편 (9:16 고화질 편집본)',
            '도입부 3초 A/B 후크 베리에이션 4종',
            '30일 유료 광고(메타/틱톡 스파크 애즈) 집행 라이선스',
            '수정 1회 포함',
          ]
        : [
            '2x Fully Edited Hero Concepts (9:16 Vertical, 4K)',
            '4x Scroll-Stopping Hook Variations (8 total ad combinations)',
            '30-Day Paid Ad Usage Rights (Meta & TikTok)',
            '1 Round of Creative Revisions',
          ],
      usageRightsSummary: isKo ? '30일 유료 광고 사용권 포함' : '30-Day Paid Social Usage Included',
      turnaroundDays: 5,
      priceUsd: starterTotalUsd,
      priceKrw: Math.round(starterTotalUsd * usdToKrwRate),
      goalImpactSummary: `+$${starterTotalUsd.toLocaleString()} toward monthly goal`,
    },
    {
      id: 'tier-recommended',
      tierCode: 'GOAL_ALIGNED_RECOMMENDED',
      name: isKo
        ? 'Tier 2: 골-얼라인 퍼포먼스 & 온카메라 풀 패키지 (추천)'
        : 'Tier 2: Goal-Aligned Scale & Authority Suite (Recommended)',
      subtitle: isKo
        ? '배우/모델의 카메라 장악력과 퍼포먼스 마케팅 구조를 결합한 주력 캠페인 패키지'
        : 'Designed to maximize thumbstop retention, conversion ROAS, and 60-day scaling',
      isRecommended: true,
      deliverables: customDeliverables.map((d) => `${d.quantity}x ${d.label}`),
      usageRightsSummary: isKo
        ? '60일 글로벌 디지털 유료 광고 + 화이트리스팅 포함'
        : '60-Day Paid Social Usage + Creator Whitelisting Included',
      turnaroundDays: 4,
      priceUsd: recommendedTotalUsd,
      priceKrw: Math.round(recommendedTotalUsd * usdToKrwRate),
      goalImpactSummary: `Closes ${Math.min(
        100,
        Math.round((recommendedTotalUsd / remainingRevenueGapUsd) * 100)
      )}% of your remaining $${remainingRevenueGapUsd.toLocaleString()} monthly revenue gap`,
    },
    {
      id: 'tier-retainer',
      tierCode: 'RETAINER_PARTNERSHIP',
      name: isKo
        ? 'Tier 3: 3개월 크리에이티브 리테이너 파트너십'
        : 'Tier 3: 3-Month Creative Performance Retainer',
      subtitle: isKo
        ? '매월 신규 광고 소재 및 후크 리프레시를 통해 광고 피로도를 방지하는 정기 파트너십'
        : 'Continuous monthly ad refresh & priority shoot days to eliminate ad fatigue',
      isRecommended: false,
      deliverables: isKo
        ? [
            '매월 신규 온카메라/UGC 본편 영상 4편 (3개월 총 12편)',
            '매월 성과 데이터 기반 신규 후크 8종 추가 촬영',
            '90일 롤링 유료 광고 라이선스 및 동종 업계 카테고리 독점권 옵션',
            '격주 크리에이티브 성과 리뷰 미팅',
          ]
        : [
            '4x New Hero Videos Every Month (12 Videos Over 3 Months)',
            '8x Fresh Hook Variations Monthly Iterated on Winning ROAS Data',
            '90-Day Rolling Paid Usage & Whitelisting Access',
            'Priority Shoot Scheduling + Optional Category Exclusivity',
          ],
      usageRightsSummary: isKo ? '90일 롤링 라이선스 + 파트너 우대 단가' : '90-Day Rolling Usage + Priority Retainer Rate',
      turnaroundDays: 4,
      priceUsd: retainerMonthlyUsd,
      priceKrw: Math.round(retainerMonthlyUsd * usdToKrwRate),
      goalImpactSummary: `Locks $${(retainerMonthlyUsd * 3).toLocaleString()} total contract value & advances Retainer Milestone!`,
    },
  ];

  const primaryContact = company.contacts[0]?.name || (isKo ? '담당자님' : 'Team');
  const revenueContributionPct = Math.min(
    100,
    Math.round((recommendedTotalUsd / remainingRevenueGapUsd) * 100)
  );
  const nicheMatch = goal.targetNiches.some((n) =>
    n.toLowerCase().includes(company.industryNiche.toLowerCase().split(' ')[0])
  );

  const pitchEmailSubject = isKo
    ? `[제안서] ${company.name} x ${talent.displayName} — 온카메라 배우/모델 퍼포먼스 캠페인 및 3가지 후크 기획안`
    : `Proposal: ${company.name} x ${talent.displayName} — On-Camera ${targetRole.replace('_', ' ')} Campaign & 3 Testable Hooks`;

  const pitchMessageBody = isKo
    ? `안녕하세요 ${primaryContact}님,

${company.name}의 최근 캠페인 방향성을 분석하며, 전문 배우/모델의 카메라 전달력과 숏폼 다이렉트 리스폰스(UGC) 구조를 결합한 맞춤 제안서를 준비했습니다.

단순한 제품 소개를 넘어 초반 3초 후크 유지율(Thumbstop Rate)과 실제 전환율을 높이기 위해 즉시 테스트 가능한 3가지 크리에이티브 후크와 3단계 패키지 옵션을 구성했습니다:

• Tier 1 (스타터 후크 검증 패키지): ₩${tiers[0].priceKrw.toLocaleString()} ($${tiers[0].priceUsd.toLocaleString()})
• Tier 2 (골-얼라인 추천 풀 패키지): ₩${tiers[1].priceKrw.toLocaleString()} ($${tiers[1].priceUsd.toLocaleString()})
• Tier 3 (3개월 리테이너 파트너십): 월 ₩${tiers[2].priceKrw.toLocaleString()} ($${tiers[2].priceUsd.toLocaleString()}/월)
${includeKoreanWithholdingTaxNote ? '\n※ 한국 법인 정산 시 3.3% 프리랜서 원천징수 또는 세금계산서(VAT 별도) 발행 모두 가능합니다.' : ''}

아래 인터랙티브 제안서 링크에서 상세 산출물과 후크 구성을 확인하시고 원하시는 티어를 바로 선택하실 수 있습니다. 이번 주 바로 촬영 스케줄 조율 가능합니다!`
    : `Hi ${primaryContact},

I put together a tailored campaign proposal for ${company.name} that blends trained on-camera ${targetRole
        .toLowerCase()
        .replace('_', ' ')} presence with high-retention performance hooks built to scale on Meta and TikTok.

To make budget approval seamless, I structured the proposal into three clear tiers aligned with your growth goals:

• Tier 1 (Rapid Hook Validation Pack): $${tiers[0].priceUsd.toLocaleString()} (₩${tiers[0].priceKrw.toLocaleString()})
• Tier 2 (Recommended Scale & Authority Suite): $${tiers[1].priceUsd.toLocaleString()} (₩${tiers[1].priceKrw.toLocaleString()})
• Tier 3 (3-Month Performance Retainer): $${tiers[2].priceUsd.toLocaleString()}/mo (₩${tiers[2].priceKrw.toLocaleString()}/mo)

You can review the exact deliverables, usage rights windows, and 3 custom hook scripts at the interactive proposal link below. Let me know which tier works best and we can lock shoot dates this week!`;

  return {
    id: `prop-${company.id}-${Date.now()}`,
    workspaceId: company.workspaceId,
    brandCompanyId: company.id,
    brandName: company.name,
    talentProfileId: talent.id,
    title: isKo
      ? `${company.name} Q4 온카메라 ${targetRole} & 하이-리텐션 광고 패키지`
      : `${company.name}: On-Camera ${targetRole.replace('_', ' ')} & High-Retention Ad Suite`,
    campaignObjective: isKo
      ? `${company.name}의 타겟 오디언스를 사로잡는 배우/모델 비주얼 스토리텔링 및 A/B 후크 최적화`
      : `Combine studio-grade ${targetRole.toLowerCase().replace('_', ' ')} authority with scroll-stopping conversion hooks for ${company.name}.`,
    targetRole,
    locale,
    currency,
    includeKoreanWithholdingTaxNote,
    goalAlignmentScore: Math.max(company.brandFitScore, 92),
    goalAlignmentBreakdown: {
      revenueContributionPct,
      nicheMatch,
      meetsRateFloor: recommendedTotalUsd >= goal.minProjectRateUsd,
      retainerPotential: true,
      explanation: `Recommended Tier ($${recommendedTotalUsd.toLocaleString()}) closes ${revenueContributionPct}% of your remaining $${remainingRevenueGapUsd.toLocaleString()} monthly goal, exceeds your $${goal.minProjectRateUsd} minimum floor, and pitches a $${retainerMonthlyUsd.toLocaleString()}/mo retainer anchor.`,
    },
    customDeliverables,
    tiers,
    selectedTierId: 'tier-recommended',
    pitchEmailSubject,
    pitchMessageBody,
    creativeHooksProposed: [
      {
        hookTitle: isKo
          ? 'Hook 01: 촬영장 콜타임 오전 5시 비포/애프터 테스트'
          : 'Hook 01: The 5:00 AM Call-Time Set Test',
        visualDirection: 'High-contrast dressing room mirror shot under 4K studio lights; tactile close-up.',
        spokenLine: isKo
          ? '"새벽 5시 촬영 콜타임 전에 제가 카메라 테스트 통과하려고 딱 3분만 쓰는 루틴입니다."'
          : '"When I have a 5 AM camera call time, I can’t fake results under 4K studio lenses—here is what actually works."',
      },
      {
        hookTitle: isKo
          ? 'Hook 02: 업계 관계자만 아는 디테일 비교'
          : 'Hook 02: The On-Set Insider Reality Check',
        visualDirection: 'Direct-to-camera walk-and-talk holding the product with split-screen visual proof.',
        spokenLine: isKo
          ? '"광고 촬영장에서 수많은 제품을 써봤지만, 자비로 재구매한 건 이 제품이 유일합니다."'
          : '"I’ve been handed dozens of products on commercial sets this year—this is the only one that stayed in my personal bag."',
      },
      {
        hookTitle: isKo
          ? 'Hook 03: 문제 공감 + 3초 시각적 반전'
          : 'Hook 03: Pattern-Interrupt Visual Proof',
        visualDirection: 'Macro texture / interface close-up cutting immediately to confident on-camera reaction.',
        spokenLine: isKo
          ? '"아직도 기존 방식으로 시간 낭비하고 계신가요? 3초 만에 차이를 보여드릴게요."'
          : '"Stop settling for generic results when this 10-second switch changes the entire outcome."',
      },
    ],
    shareableSlug: `vanguard.studio/p/${company.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    status: 'DRAFT',
    createdAt: 'Today',
  };
}
