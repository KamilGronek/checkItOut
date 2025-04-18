import { FormControl } from '@angular/forms';

/**
 * Form controls for business info - combines user fields and address fields
 */
export type BusinessInfoForm = {
  // User fields
  profilePicture: FormControl<string | null>;
  name: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;

  // Address fields
  city: FormControl<string | null>;
  street: FormControl<string | null>;
  state: FormControl<string | null>;
  postalCode: FormControl<string | null>;
  country: FormControl<string | null>;
  additionalInfo: FormControl<string | null>;
};

/**
 * Form controls for account creation
 */
export type AccountCredentialsForm = {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
  termsOfService: FormControl<boolean>;
};

/**
 * Form controls for influence registration via social
 */
export type SocialRegistrationForm = {
  email: FormControl<string | null>;
  termsOfService: FormControl<boolean>;
};
