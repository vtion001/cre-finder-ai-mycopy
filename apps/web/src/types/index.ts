export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type StoredSkipTraceResponse = {
  output?: {
    identity: {
      phones: Array<{
        phone: string;
        phoneDisplay: string;
        isConnected: boolean;
        phoneType: string;
      }>;
      emails: Array<{
        email: string;
        emailType: string;
      }>;
      address: {
        formattedAddress: string;
      };
      addressHistory: Array<{
        formattedAddress: string;
      }>;
    };
    demographics: {
      age: number;
      gender: string;
      dob: string;
    };
    stats: {
      phoneNumbers: number;
      emailAddresses: number;
      addresses: number;
    };
  };
};
