import { checkoutLicenseWithStripe } from "@v1/stripe/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const licenseCheckoutSchema = z.object({
  location: z.string().min(1, "Location is required"),
  assetTypes: z.array(z.string()).min(1, "At least one asset type is required"),
  resultCount: z.number().min(1, "Result count must be at least 1"),
  redirectPath: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validationResult = licenseCheckoutSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid request data",
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { location, assetTypes, resultCount, redirectPath } = validationResult.data;

    // Create the checkout session
    const result = await checkoutLicenseWithStripe({
      location,
      assetTypes,
      resultCount,
      redirectPath,
    });

    if (result.errorRedirect) {
      return NextResponse.json(
        { error: "Failed to create checkout session", redirectUrl: result.errorRedirect },
        { status: 500 }
      );
    }

    if (result.sessionId) {
      return NextResponse.json({ sessionId: result.sessionId });
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  } catch (error) {
    console.error("License checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
