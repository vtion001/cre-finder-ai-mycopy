import { CreditUsageDisplay } from "@/components/credit-usage-display";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { CreditTransactionsTable } from "@/components/tables/credit-transactions-table";
import {
  IconCreditCard,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";
import {
  getCreditTransactions,
  getUser,
  getUserCreditUsage,
} from "@v1/supabase/cached-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@v1/ui/card";
import { SidebarInset, SidebarProvider } from "@v1/ui/sidebar";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Credit Usage - CRE Finder AI",
  description: "View your search credit usage and limits.",
};

export default async function CreditsPage() {
  const user = await getUser();

  if (!user?.data) {
    redirect("/login");
  }

  const { data } = await getUserCreditUsage();
  const { data: transactions } = await getCreditTransactions();

  return (
    <SidebarProvider>
      <AppSidebar user={user.data} variant="inset" />
      <SidebarInset>
        <SiteHeader title="Credits" />
        <div className="space-y-6 p-6 pb-16">
          <div className="mx-auto flex w-full flex-col space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Current Balance */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current Balance
                  </CardTitle>
                  <IconWallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data.remaining_credits}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Available search credits
                  </p>
                </CardContent>
              </Card>

              {/* Purchased Credits */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Purchased
                  </CardTitle>
                  <IconCreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.total_extra}</div>
                  <p className="text-xs text-muted-foreground">
                    Lifetime credit purchases
                  </p>
                </CardContent>
              </Card>

              {/* Used This Period */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Used This Period
                  </CardTitle>
                  <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data.total_consumed}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Credits used in current billing cycle
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6">
              <CreditUsageDisplay data={data} />

              {/* Credit Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    View all your credit transactions including purchases,
                    bonuses, and usage.
                  </p>
                </CardHeader>
                <CardContent>
                  <CreditTransactionsTable transactions={transactions || []} />
                </CardContent>
              </Card>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">About Credits</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Credits are consumed when you complete a property search. Each
                  completed search uses one credit. Your credit limit is based
                  on your subscription plan and resets at the beginning of each
                  billing period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
