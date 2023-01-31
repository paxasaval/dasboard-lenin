import { RolesService } from './roles.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, UserCredential } from 'firebase/auth';
import { from, Observable, switchMap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth,
    private userService: UserService,
    private authorize: AngularFireAuth,
    private rolService: RolesService,
    private router: Router
    ) {}

  signUp(name: string, email: string, password: string, rol:string): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(switchMap(({ user }) => updateProfile(user, { displayName: name }).then(()=>{
      var newUser: User = {}
          newUser.mail=email
          newUser.name=name
          newUser.rol=rol
          newUser.uid=user.uid
          this.userService.postUser(newUser)
    })));
  }

    login(email: string, password: string):Observable<UserCredential> {

    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

    logout(){
    localStorage.clear()
    return from(this.auth.signOut())
  }

}
