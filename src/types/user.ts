// Define types
export interface ClerkUser {
    id: string;
    username?: string;
    primaryEmailAddress?: {
      emailAddress: string;
    };
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    externalAccounts?: Array<{
      provider: string;
      externalId: string;
    }>;
  }
  
  export interface UserData {
    clerkUserId: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    providerInfo: Record<string, string>;
  }
  