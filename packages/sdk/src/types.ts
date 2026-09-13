export type AccessMode = "promotion" | "x402" | "denied";

export interface Enrollment {
  id: string;
  providerId: string;
  action: string;
  nullifier: string;
  granted: number;
  consumed: number;
  verifiedAt: string;
}

export interface AccessRun {
  id: string;
  providerId: string;
  mode: AccessMode;
  decision: string;
  createdAt: string;
  prompt?: string;
  transaction?: string;
  amount?: string;
}

export interface WorldChallenge {
  signalHash: string;
  expiresAt: string;
}

export interface Alive402Store {
  grant(input: Omit<Enrollment, "id" | "consumed" | "verifiedAt">): Promise<Enrollment>;
  getEnrollment(providerId: string, action: string, nullifier: string): Promise<Enrollment | null>;
  consumePromotion(enrollmentId: string): Promise<boolean>;
  createSession(enrollmentId: string, tokenHash: string, expiresAt: string): Promise<void>;
  resolveSession(tokenHash: string): Promise<Enrollment | null>;
  createWorldChallenge(challenge: WorldChallenge): Promise<void>;
  consumeWorldChallenge(signalHash: string): Promise<boolean>;
  recordRun(run: AccessRun): Promise<void>;
  updateRun(id: string, patch: Partial<AccessRun>): Promise<void>;
  getRun(id: string): Promise<AccessRun | null>;
  listRuns(providerId: string, limit?: number): Promise<AccessRun[]>;
}

export interface Alive402Config {
  providerId: string;
  world: { appId: string; rpId: string; signingKey: string; action: string };
  trial: { calls: number; store: Alive402Store };
  payment: {
    network: "hedera:testnet" | "hedera:mainnet";
    facilitatorUrl: string;
    asset: string;
    amount: string;
    payTo: string;
  };
}
