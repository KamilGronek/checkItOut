import { FormControl, FormGroup } from '@angular/forms';

export enum CommunicationFrequency {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY'
}

// All optional because of PATCH updates
export interface UserPreference {
    id?: number;
    userId?: number;
    notificationEmailEnabled?: boolean;
    notificationPushEnabled?: boolean;
    notificationSmsEnabled?: boolean;
    darkModeEnabled?: boolean;
    language?: string;
    communicationFrequency?: CommunicationFrequency;
    gdprMarketingConsent?: boolean;
    twoFactorAuthenticationEnabled?: boolean;
}

export type UserPreferenceForm = {
    notificationEmailEnabled: FormControl<boolean>;
    notificationPushEnabled: FormControl<boolean>;
    notificationSmsEnabled: FormControl<boolean>;
    darkModeEnabled: FormControl<boolean>;
    language: FormControl<string>;
    communicationFrequency: FormControl<CommunicationFrequency>;
    gdprMarketingConsent: FormControl<boolean>;
    twoFactorAuthenticationEnabled: FormControl<boolean>;
}
