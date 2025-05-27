"use client";

import { Calendar } from "@v1/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@v1/ui/card";
import { useState } from "react";

export function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateWithSelection, setDateWithSelection] = useState<Date | undefined>(new Date());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Standard Calendar</CardTitle>
          <CardDescription>
            Default calendar with navigation arrows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          {date && (
            <p className="mt-4 text-sm text-muted-foreground">
              Selected: {date.toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enhanced Calendar</CardTitle>
          <CardDescription>
            Calendar with month and year selection dropdowns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={dateWithSelection}
            onSelect={setDateWithSelection}
            enableMonthYearSelection={true}
            className="rounded-md border"
          />
          {dateWithSelection && (
            <p className="mt-4 text-sm text-muted-foreground">
              Selected: {dateWithSelection.toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
