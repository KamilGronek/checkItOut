export const environment = {
  production: true,
  apiUrl: 'https://checkitout.app/api',
  firebaseConfig: {
    apiKey: 'AIzaSyBVAdNu1AolItY5tjdKVtq3TxiewsFv98M',
    authDomain: 'check-it-out-47c50.firebaseapp.com',
    projectId: 'check-it-out-47c50',
    storageBucket: 'check-it-out-47c50.firebasestorage.app',
    messagingSenderId: '918098393889',
    appId: '1:918098393889:web:950269fae0b0cc10249c60',
    measurementId: 'G-QMBC9R5QQ6'
  },
  instagram: {
    clientId: '2658917770964963',
    clientSecret: '3164b30e7f544e25d881b69ba6089989',
    redirectUri: 'https://checkitout.app/auth/instagram/influencer/callback'
  },
  social: {
    instagram: {
      clientId: '2658917770964963',
      redirectUri: 'https://checkitout.app/auth/social/callback/instagram'
    }
    // Add more social platforms here as needed
  }
};
