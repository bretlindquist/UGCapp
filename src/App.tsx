import React, { useState } from 'react';
import { WorkspaceProvider } from './store/workspaceStore';
import { AppShell, NavTabId } from './components/layout/AppShell';
import { TodayDashboard } from './features/today/TodayDashboard';
import { LeadRadarView } from './features/leads/LeadRadarView';
import { CompaniesPipelineView } from './features/pipeline/CompaniesPipelineView';
import { ProposalStudioView } from './features/proposals/ProposalStudioView';
import { CompCardAndRightsView } from './features/kit/CompCardAndRightsView';
import { AgencyRosterView } from './features/agency/AgencyRosterView';
import { TalentRole } from './types/crm';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTabId>('today');
  const [proposalTargetCompanyId, setProposalTargetCompanyId] = useState<string | null>(
    'comp-medicube'
  );
  const [proposalRoleHint, setProposalRoleHint] = useState<TalentRole | undefined>(
    'ACTOR'
  );

  const handleOpenProposalForCompany = (companyId: string, roleHint?: TalentRole) => {
    setProposalTargetCompanyId(companyId);
    if (roleHint) {
      setProposalRoleHint(roleHint);
    }
    setActiveTab('proposals');
  };

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onOpenProposalForCompany={handleOpenProposalForCompany}
    >
      {activeTab === 'today' && (
        <TodayDashboard
          onNavigateTab={setActiveTab}
          onBuildProposalForCompany={handleOpenProposalForCompany}
        />
      )}
      {activeTab === 'leads' && (
        <LeadRadarView onBuildProposalForCompany={handleOpenProposalForCompany} />
      )}
      {activeTab === 'pipeline' && (
        <CompaniesPipelineView
          onBuildProposalForCompany={handleOpenProposalForCompany}
        />
      )}
      {activeTab === 'proposals' && (
        <ProposalStudioView
          initialCompanyId={proposalTargetCompanyId}
          initialRoleHint={proposalRoleHint}
        />
      )}
      {activeTab === 'kit' && (
        <CompCardAndRightsView onNavigateToday={() => setActiveTab('today')} />
      )}
      {activeTab === 'agency' && (
        <AgencyRosterView
          onOpenProposalForTalent={handleOpenProposalForCompany}
        />
      )}
    </AppShell>
  );
}

export default function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}
