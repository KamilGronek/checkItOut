import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    Component, inject,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder, FormControl, FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {InfluencerService} from "app/feature/influencers/services/influencer.service";
import {InfluencerUser} from "../../../../influencers/services/influencer.types";
import {UserService} from "app/feature/users/services/user.service";
import {environment} from "environments/environment";
import {AuthService} from "app/core/services/authentication/auth.service";
import {HttpClient} from "@angular/common/http";
import {InputComponent} from "../../../../../shared/components/ui/input/input.component";

type PersonalInfoForm = {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
}

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        InputComponent,
    ],
    standalone: true
})
export class SettingsAccountComponent implements OnInit {

    private apiUrl: string = environment.apiUrl;
    private _authService = inject(AuthService);
    private _httpClient = inject(HttpClient);
    private _formBuilder = inject(FormBuilder);

    accountForm: FormGroup<PersonalInfoForm> = this._formBuilder.group({
        firstName: this._formBuilder.control("", [Validators.required]),
        lastName: this._formBuilder.control("", [Validators.required]),
        email: this._formBuilder.control("", [Validators.required]),
    });


    ngOnInit(): void {

        let user = this._authService.getDecodedToken();
        console.log(user);
        this._httpClient.get(
            this.apiUrl + `/user/user/${user.sub}`
        ).subscribe({
            next: (user: any) => {
                console.log(user);
                this.initAccountForm(user);
            },
            error: (err: Error) => {},
        });
    }

    initAccountForm(user: any){
        this.accountForm.controls.firstName.setValue(user.firstName);
        this.accountForm.controls.lastName.setValue(user.lastName);
        this.accountForm.controls.email.setValue(user.email);
    }
}
