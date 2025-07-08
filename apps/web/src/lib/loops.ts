import { env } from "@/env.mjs";
import { LoopsClient, type Contact as LoopsContact } from "loops";

// Initialize Loops client
const loops = new LoopsClient(process.env.LOOPS_API_KEY!);

export interface CreateContactParams {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string;
}

export async function createLoopsContact(
  params: CreateContactParams,
): Promise<{ id: string } | null> {
  try {
    console.log("Creating Loops contact:", params);

    const response = await loops.createContact(params.email, {
      firstName: params.firstName,
      lastName: params.lastName,
      userGroup: params.role,
      phone: params.phoneNumber,
    });

    if (response.success && response.id) {
      console.log("Successfully created Loops contact:", response.id);
      return { id: response.id };
    }

    console.error("Failed to create Loops contact:", response);
    return null;
  } catch (error) {
    console.error("Error creating Loops contact:", error);
    return null;
  }
}

export async function updateLoopsContact(
  contactId: string,
  params: Partial<CreateContactParams> & { email: string },
): Promise<boolean> {
  try {
    console.log("Updating Loops contact:", contactId, params);

    const response = await loops.updateContact(params.email, {
      ...(params.firstName && { firstName: params.firstName }),
      ...(params.lastName && { lastName: params.lastName }),
      ...(params.role && { userGroup: params.role }),
      ...(params.phoneNumber && { phone: params.phoneNumber }),
    });

    if (response.success) {
      console.log("Successfully updated Loops contact:", contactId);
      return true;
    }

    console.error("Failed to update Loops contact:", response);
    return false;
  } catch (error) {
    console.error("Error updating Loops contact:", error);
    return false;
  }
}

export async function getLoopsContact(
  email: string,
): Promise<LoopsContact | null> {
  try {
    console.log("Getting Loops contact:", email);

    const response = await loops.findContact({ email });

    if (response.length > 0) {
      const contact = response[0]!;
      console.log("Found Loops contact:", contact.id);

      return contact;
    }

    console.log("Loops contact not found:", email);
    return null;
  } catch (error) {
    console.error("Error getting Loops contact:", error);
    return null;
  }
}
