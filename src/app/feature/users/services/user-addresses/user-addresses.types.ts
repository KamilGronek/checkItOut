/**
 * Types for User Addresses management
 */

import { FormControl } from '@angular/forms';

/**
 * Enum for address types
 */
export enum AddressType {
    MAIN = 'MAIN',
    SECONDARY = 'SECONDARY',
    BILLING = 'BILLING',
    SHIPPING = 'SHIPPING',
    TEMPORARY = 'TEMPORARY'
}

/**
 * Interface for Address object matching API schema
 */
export interface Address {
    id?: number;
    userId?: number;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    state: string;
    additionalInfo?: string;
    addressType: AddressType;
    primary: boolean;
    createdTime?: string;
    lastUpdateTime?: string;
}

/**
 * Interface for creating a new address
 */
export interface CreateAddressDto {
    userId: number;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    state: string;
    additionalInfo?: string;
    addressType: AddressType;
    primary: boolean;
}

/**
 * Interface for updating an address
 */
export interface UpdateAddressDto {
    userId: number;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    state?: string;
    additionalInfo?: string;
    addressType?: AddressType;
    primary?: boolean;
}

/**
 * Type for address form controls
 */
export type AddressForm = {
    userId: FormControl<number>;
    street: FormControl<string>;
    city: FormControl<string>;
    postalCode: FormControl<string>;
    country: FormControl<string>;
    state: FormControl<string>;
    additionalInfo: FormControl<string>;
    addressType: FormControl<AddressType>;
    primary: FormControl<boolean>;
}

// Need to add this import in files that use AddressForm
// import { FormControl } from '@angular/forms';
