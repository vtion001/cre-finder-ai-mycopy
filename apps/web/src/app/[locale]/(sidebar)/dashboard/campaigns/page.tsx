import { SiteHeader } from "@/components/site-header";
import { CampaignList } from "@/components/campaigns/campaign-list";

export const metadata = { title: "Campaigns - CRE Finder AI" };

export default async function CampaignsPage() {
  // For now, we'll use a simple approach without the broken imports
  const mockUser = { 
    id: "mock-user-id", 
    email: "test@example.com",
    avatar_url: null,
    billing_address: null,
    created_at: null,
    crm_id: null,
    full_name: "Test User",
    locale: null,
    payment_method: null,
    payment_provider: null,
    timezone: null,
    updated_at: null,
    phone_number: null,
    role: "admin" as const,
    time_format: null
  };
  const mockLicenses: any[] = [];

  return (
    <>
      <SiteHeader title="Campaigns" user={mockUser} licenses={mockLicenses} showMobileDrawer />
      <div className="p-4">
        <CampaignList />
      </div>
    </>
  );
}


