// Ads/Promo/Bundles feature types

export type AdStatus = 'ACTIVE' | 'INACTIVE' | 'SCHEDULED' | 'EXPIRED';
export type AdAppliesTo = 'ALL' | 'PRODUCTS' | 'SERVICES' | 'CATEGORIES';
export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

// --- Advertisement ---

export interface Ad {
  id: string;
  headline: string;
  description: string;
  imageUrl: string;
  startDate: string; // ISO LocalDateTime string
  endDate: string;   // ISO LocalDateTime string
  appliesTo: AdAppliesTo;
  targetIds: string[];
  status: AdStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdDto {
  headline: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  appliesTo: AdAppliesTo;
  targetIds: string[];
  status: AdStatus;
}

export interface UpdateAdDto extends Partial<CreateAdDto> {}

// --- Promotion ---

export interface Promotion {
  id: string;
  name: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  maxUses: number;
  currentUses: number;
  minOrderAmount: number;
  applicableProductIds: string[];
  isActive: boolean;
  createdAt: string;
}

export interface CreatePromotionDto {
  name: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  maxUses: number;
  minOrderAmount: number;
  applicableProductIds: string[];
  isActive: boolean;
}

// --- Bundle ---

export interface Bundle {
  id: string;
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  productIds: string[];
  isActive: boolean;
  originalPrice: number;
  bundlePrice: number;
  savingsAmount: number;
  createdAt: string;
}

export interface CreateBundleDto {
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  productIds: string[];
  isActive: boolean;
}

export interface UpdateBundleDto extends Partial<CreateBundleDto> {}
