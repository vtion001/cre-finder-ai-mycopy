"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@v1/ui/dialog";
import { Button } from "@v1/ui/button";
import { Checkbox } from "@v1/ui/checkbox";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";

type Channels = {
  sms: boolean;
  voicemail: boolean;
  phone: boolean;
  email: boolean;
  postcard: boolean;
  handwritten: boolean;
};

const defaultCost = {
  sms: 1.23,
  voicemail: 1.37,
  phone: 0.33,
  email: 2.26,
  postcard: 0.1,
  handwritten: 0.85,
};

export function CampaignDialog() {
  const [open, setOpen] = useState(false);
  const [ids, setIds] = useState<string[]>([]);
  const [channels, setChannels] = useState<Channels>({
    sms: true,
    voicemail: true,
    phone: true,
    email: true,
    postcard: false,
    handwritten: false,
  });

  useEffect(() => {
    const handler = () => {
      const url = new URL(window.location.href);
      if (url.searchParams.get("campaign") === "open") {
        const raw = url.searchParams.get("ids");
        try {
          const list = raw ? (JSON.parse(raw) as string[]) : [];
          setIds(list);
          setOpen(true);
        } catch {}
      }
    };
    window.addEventListener("popstate", handler);
    handler();
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const total = useMemo(() => {
    const enabled = Object.entries(channels).filter(([, v]) => v).map(([k]) => k as keyof typeof defaultCost);
    const per = enabled.reduce((acc, k) => acc + defaultCost[k], 0);
    return (per * ids.length).toFixed(2);
  }, [channels, ids]);

  const submit = async () => {
    await fetch("/api/outbound/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies for authentication
      body: JSON.stringify({ ids, channels }),
    });
    // Optional test sends if configured
    if (channels.sms) {
      try {
        await fetch("/api/twilio/sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Include cookies for authentication
          body: JSON.stringify({ to: "{{phone}}", body: `Test SMS for ${ids.length} contacts` }),
        });
      } catch {}
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Outbound System</DialogTitle>
          <p className="text-sm text-muted-foreground">You have selected {ids.length} contacts</p>
        </DialogHeader>
        <div className="grid gap-3">
          {(
            [
              ["sms", "SMS"],
              ["voicemail", "Voicemail Call"],
              ["phone", "Phone Call"],
              ["email", "Email"],
              ["postcard", "Postcard"],
              ["handwritten", "Handwritten Letter"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-3">
                <Checkbox checked={channels[key]} onCheckedChange={(v) => setChannels((c) => ({ ...c, [key]: Boolean(v) }))} />
                <Label className="font-medium">{label}</Label>
              </div>
              <span className="text-green-500 font-semibold">${defaultCost[key as keyof typeof defaultCost].toFixed(2)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-md bg-muted p-3">
            <span className="font-semibold">Total:</span>
            <span className="font-bold">${total}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Send Campaign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



