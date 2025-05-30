"use client";

import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Skeleton } from "@v1/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@v1/ui/table";
import { format } from "date-fns";
import {
  CreditCardIcon,
  GiftIcon,
  MinusIcon,
  PlusIcon,
  RefreshCwIcon,
  WalletIcon,
} from "lucide-react";

type CreditTransaction = Tables<"credit_transactions">;

interface CreditTransactionsTableProps {
  transactions: CreditTransaction[];
  isLoading?: boolean;
}

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "subscription":
    case "purchase":
      return <CreditCardIcon className="h-4 w-4" />;
    case "bonus":
      return <GiftIcon className="h-4 w-4" />;
    case "refund":
      return <RefreshCwIcon className="h-4 w-4" />;
    case "adjustment":
      return <WalletIcon className="h-4 w-4" />;
    default:
      return <WalletIcon className="h-4 w-4" />;
  }
};

const getTransactionBadge = (type: string, amount: number) => {
  const isPositive = amount > 0;

  switch (type) {
    case "subscription":
      return (
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 flex items-center gap-1"
        >
          <CreditCardIcon className="h-3 w-3" />
          Subscription
        </Badge>
      );
    case "purchase":
      return (
        <Badge
          variant="secondary"
          className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 flex items-center gap-1"
        >
          <PlusIcon className="h-3 w-3" />
          Purchase
        </Badge>
      );
    case "bonus":
      return (
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 flex items-center gap-1"
        >
          <GiftIcon className="h-3 w-3" />
          Bonus
        </Badge>
      );
    case "refund":
      return (
        <Badge
          variant="secondary"
          className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800 flex items-center gap-1"
        >
          <RefreshCwIcon className="h-3 w-3" />
          Refund
        </Badge>
      );
    case "adjustment":
      return (
        <Badge
          variant="secondary"
          className={`${
            isPositive
              ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
              : "bg-red-50 text-red-700 hover:bg-red-50 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
          } flex items-center gap-1`}
        >
          {isPositive ? (
            <PlusIcon className="h-3 w-3" />
          ) : (
            <MinusIcon className="h-3 w-3" />
          )}
          {isPositive ? "Credit Added" : "Credit Used"}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <WalletIcon className="h-3 w-3" />
          {type}
        </Badge>
      );
  }
};

export function CreditTransactionsTable({
  transactions,
  isLoading = false,
}: CreditTransactionsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <WalletIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium">No credit transactions</h3>
        <p className="text-muted-foreground mt-1">
          Your credit transaction history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="min-w-[140px]">Date & Time</TableHead>
                <TableHead className="min-w-[120px]">Type</TableHead>
                <TableHead className="min-w-[200px]">Description</TableHead>
                <TableHead className="text-right min-w-[100px]">
                  Amount
                </TableHead>
                <TableHead className="text-center min-w-[120px]">
                  Expires
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.transaction_type)}
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {format(
                            new Date(transaction.created_at!),
                            "MMM d, yyyy",
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(transaction.created_at!), "h:mm a")}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTransactionBadge(
                      transaction.transaction_type,
                      transaction.credit_amount,
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {transaction.description || "No description"}
                    </div>
                    {transaction.reference_id && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Ref: {transaction.reference_id}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-medium ${
                        transaction.credit_amount > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.credit_amount > 0 ? "+" : ""}
                      {transaction.credit_amount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {transaction.expires_at ? (
                      <div className="text-sm">
                        {format(
                          new Date(transaction.expires_at),
                          "MMM d, yyyy",
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Never
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
