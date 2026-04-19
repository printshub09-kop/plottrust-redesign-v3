/**
 * Shared types for PlotTrust — the Maharashtra land-records domain.
 *
 * Naming: we keep Maharashtra-specific terminology (Gat, Satbara, Ferfar)
 * so the code reads like a land records team would speak it.
 */

export type DpZone = 'green' | 'yellow' | 'red';
export type LandType = 'NA' | 'AGRI' | 'AGRI_NA_POTENTIAL' | 'MIXED' | 'RESERVED';
export type ReservationKind = 'school' | 'hospital' | 'garden' | 'road' | 'other' | null;

export interface Village {
  id: string;
  name: string;
  nameMr: string;             // मराठी नाव
  taluka: string;
  district: string;
  pincode?: string;
  /** ST_AsGeoJSON of village polygon */
  geojson?: string;
}

/** A plot/parcel — the single atomic unit of discovery. */
export interface Plot {
  id: string;

  /* Location */
  villageId: string;
  village: Pick<Village, 'name' | 'nameMr' | 'taluka' | 'district'>;

  /* Identifiers */
  gatNumber?: string | null;      // e.g. "142/2-A"
  surveyNumber?: string | null;   // e.g. "58"
  ctsNumber?: string | null;      // City Survey — urban plots
  reraNumber?: string | null;     // MahaRERA project ID

  /* Physical */
  areaSqm: number;
  areaSqft: number;               // derived but stored for search
  frontRoadMeters?: number | null;

  /* Classification */
  landType: LandType;
  dpZone: DpZone;
  reservation: ReservationKind;
  fsiAllowed?: number;            // base FSI e.g. 1.1
  tdrAllowed?: number;            // e.g. 0.3

  /* Value */
  readyReckonerRate: number;      // ₹/sqm (government ASR)
  askMarketRate?: number;         // ₹/sqm (asking)
  lastTxnRate?: number;           // last registered transaction ₹/sqm
  deltaPct?: number;              // computed (market − ASR) / ASR

  /* Status */
  verified: boolean;
  listedAt: string;               // ISO
  source: 'owner' | 'agent' | 'builder';
  slug: string;                   // /plots/{slug}
  images?: string[];
}

export interface SearchFilters {
  q?: string;
  cat?: 'village' | 'gat' | 'rera' | 'cts';
  district?: string;
  landType?: LandType[];
  dpZone?: DpZone[];
  maxPriceLakh?: number;
  minAreaSqft?: number;
  reraOnly?: boolean;
}

export interface ReadyReckonerRate {
  villageId: string;
  year: number;
  residentialRate: number;  // ₹/sqm
  commercialRate: number;
  agriRate: number;
  industrialRate: number;
  openLandRate: number;
}

export type UserRole = 'BUYER' | 'AGENT' | 'BUILDER' | 'LAWYER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  credits: number;                // pre-paid lookups for pro users
  reraAgentId?: string | null;    // for agents
  barRegistrationId?: string | null; // for lawyers
}
