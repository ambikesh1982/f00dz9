import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { FirebaseError } from 'firebase';
import { Observable, of } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { AppUser } from './models';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  currUser: firebase.User;

  currUser$: Observable<AppUser | null>; // Use this in other component't template.
  currAppUser: AppUser|null;



  constructor(public afAuth: AngularFireAuth, private dataService: DataService) {
    this.currUser$ = this.afAuth.authState.pipe(
      switchMap( user => {
        if (user) {
          return this.dataService.getUserFromFirestore(user.uid)
          .pipe(
            first(),
            tap( cu => this.currAppUser = cu ),
          );
        } else {
          return of(null);
        }
      })
    );
  }

  get currentAppUser(): AppUser {
    return this.currAppUser;
  }

  get currentUserId() {
    return this.currAppUser.uid;
  }

  loginAnonymously(): Promise<void> {
    console.log('#Event: loginAnonymously()#');
    return this.afAuth.auth.signInAnonymously()
      .then((credential: firebase.auth.UserCredential) => {
        console.log(credential);
        const anomymousUser: AppUser = {
          uid:          credential.user.uid,
          isAnonymous:  credential.user.isAnonymous,
          displayName:  'Guest',
          photoURL: 'anonymous-user'
        };

        // Save user data to fireabase...
        console.log('loginAnonymously(): Sign in successfull...');
        return this.dataService.saveUserDataToFirestore(anomymousUser);

      })
      .catch(
        ( e: firebase.FirebaseError) => {
          this.handleAuthErrors(e);
        });
  }

  loginGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider): Promise<void>  {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential: firebase.auth.UserCredential) => {
        console.log(' google login userid...', credential);
        const googleuser: AppUser = {
          uid:          credential.user.uid,
          isAnonymous:  credential.user.isAnonymous,
          displayName:  credential.user.displayName,
          email:        credential.user.email,
          photoURL:     credential.user.photoURL,
          providerId:   credential.user.providerId,
          phoneNumber:  credential.user.phoneNumber,
        };
        console.log(' google login user data...', googleuser);

        this.dataService.saveUserDataToFirestore(googleuser);
       // console.log(' a google login method...',user);

      }).catch((e: FirebaseError) => {
        this.handleAuthErrors(e);
      });
  }

  upgradeAnonymousUser() {
    // TODO: Upgrade anonymous user to google.
  }

  signOut() {
    console.log('User log-out successfull');
    this.afAuth.auth.signOut();
}

handleAuthErrors(e: firebase.FirebaseError) {
// Firebase Auth Error Codes...
  // auth/app-deleted
  // auth/app-not-authorized
  // auth/argument-error
  // auth/invalid-api-key
  // auth/invalid-user-token
  // auth/network-request-failed
  // auth/operation-not-allowed
  // auth/requires-recent-login
  // auth/too-many-requests
  // auth/unauthorized-domain
  // auth/user-disabled
  // auth/user-token-expired
  // auth/web-storage-unsupported
  switch (e.code) {
    case 'auth/operation-not-allowed':
      console.log('Error: loginAnonymously()...Anonymous auth not enabled in the Firebase Console.');
      break;
    default:
       console.error('Error: loginAnonymously()...', e.code);
      console.error('Error: loginAnonymously()...', e.message);
      break;
  }

}


}
