import { FormControl } from '@angular/forms';

export type SecurityForm = {
    currentPassword: FormControl<string>;
    newPassword: FormControl<string>;
    confirmNewPassword: FormControl<string>;
    twoStep: FormControl<boolean | null>;
    askPasswordChange: FormControl<boolean | null>;
}
