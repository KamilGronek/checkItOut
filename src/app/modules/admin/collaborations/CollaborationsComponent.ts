import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, inject} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';

import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, FacebookAuthProvider, signInWithPopup, signInWithCredential} from '@angular/fire/auth';


@Component({
    selector: 'collaborations',
    standalone: true,
    templateUrl: './collaborations.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatIconModule],
})
export class CollaborationsComponent implements OnInit, AfterViewInit, OnDestroy
{

    private auth = inject(Auth);
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor()
    {

    }
    ngAfterViewInit(): void {
    }

    ngOnInit(): void
    {
    }

    sendRequest() {
        console.log("Przycisk działa");
        const provider = new FacebookAuthProvider();

        signInWithPopup(this.auth, provider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const credential = FacebookAuthProvider.credentialFromResult(result);


            signInWithCredential(this.auth, credential)
         .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user.getIdToken());
            // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });

    
            // IdP data available using getAdditionalUserInfo(result)
            // ...
            })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = FacebookAuthProvider.credentialFromError(error);
            console.log("problem")
            console.log(credential.idToken)
            // ...\
            });
    }
    

    signUp() {
        createUserWithEmailAndPassword(this.auth, 'natalkamarchewka11@gmail.com', 'Mateusz24!ppp')
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(user.getIdToken());
            // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                });
    }

    signIn() {
         signInWithEmailAndPassword(this.auth, 'norbert.marchewka44@gmail.com', 'Mateusz24!ppp')
         .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user.getIdToken());
            // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
