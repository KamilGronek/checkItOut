// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { UserData } from './UserData';
// import { Observable } from 'rxjs';
// import { AccountStatus } from './AccountStatus';

// @Injectable({
//     providedIn: 'root',
// })
// export class UserDataService {
//     private userDataCase: string = 'userDataForFirstLogin';

//     private apiUrl: string = 'http://localhost:8080/applicant';

//     httpOptions = {
//         headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
//     };

//     constructor(private http: HttpClient) {}

//     getUserDataList(): Observable<UserData[]> {
//         return this.http.get<UserData[]>(this.apiUrl + '/list');
//     }

//     getInfluencerById(): UserData {
//         switch (this.userDataCase) {
//             case 'userDataForFirstLogin': {
//                 return this.userDataForFirstLogin;
//             }
//             case 'userDataInValidation': {
//                 return this.userDataInValidation;
//             }
//             case 'userDataForFailedValidation': {
//                 return this.userDataForFailedValidation;
//             }
//             case 'userDataActiveAccount': {
//                 return this.userDataActiveAccount;
//             }
//             default: {
//                 return this.userDataForFirstLogin;
//             }
//         }
//     }

//     // createAccountUserData(userData: UserData) {
//     //     return this.http.post<UserData>(
//     //         this.apiUrl + '/create',
//     //         userData,
//     //         this.httpOptions
//     //     );
//     // }

//     userDataForFirstLogin: UserData = {
//         id: 1,
//         instagramNick: null,
//         firstName: null,
//         lastName: null,
//         email: null,
//         city: null,
//         messageToAdmin: null,
//         noteFromAdmin:
//             'Witamy, proszę uzupełnij swoje dane a następnie wyślij je do walidacji, żeby aktywować konto',
//         accountStatus: AccountStatus.INACTIVE,
//     };

//     userDataInValidation: UserData = {
//         id: 1,
//         instagramNick: '@norbertmarchewka',
//         firstName: 'Norbert',
//         lastName: 'Marchewka',
//         email: 'norbert.marchewka44@gmailcom',
//         city: 'Warszawa',
//         messageToAdmin: null,
//         noteFromAdmin:
//             'Witamy, proszę uzupełnij swoje dane a następnie wyślij je do walidacji, żeby aktywować konto',
//         accountStatus: AccountStatus.IN_VALIDATION,
//     };

//     userDataForFailedValidation: UserData = {
//         id: 1,
//         instagramNick: '@norbertmarchewka',
//         firstName: 'Norbert',
//         lastName: 'Marchewka',
//         email: 'norbert.marchewka44@gmailcom',
//         city: 'Warszawa',
//         messageToAdmin: null,
//         noteFromAdmin:
//             'Twoje konta na Instagramie nie jest publiczne, proszę zmień typ konta po czym wyślij zgłoszenie do ponownej walidacji',
//         accountStatus: AccountStatus.INACTIVE,
//     };

//     userDataActiveAccount: UserData = {
//         id: 1,
//         instagramNick: '@norbertmarchewka',
//         firstName: 'Norbert',
//         lastName: 'Marchewka',
//         email: 'norbert.marchewka44@gmailcom',
//         city: 'Warszawa',
//         messageToAdmin: null,
//         noteFromAdmin:
//             'Twoje konto jest aktywne, możesz bez przeszkód korzystać z serwisu',
//         accountStatus: AccountStatus.INACTIVE,
//     };
// }
