import { User } from './../../../models/user';
import { RolesService } from './../../../services/roles.service';
import { UserService } from './../../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  observers: Subscription[] = []

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService,
    private userService: UserService,
    private rolService: RolesService
  ) {
  }
  get email() {
    return this.loginForm.get('email')
  }
  get password() {
    return this.loginForm.get('email')
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    var obs = this.authService.login(email!, password!).subscribe((credential) => {
      if (credential) {
        const mail = credential.user.email
        this.userService.getUserById(mail!).subscribe(user => {
          if (user) {
            localStorage.setItem('user', user.id)
            localStorage.setItem('rol', user.rol!)
            this.rolService.getRolById(user.rol!).subscribe(
              result => {
                if (result.name === 'admin') {
                  this.router.navigate(['admin'])
                } else if (result.name === 'user') {
                  this.router.navigate(['home'])
                }
              }
            )
          }else{
            var newUser:User = {}
            newUser.mail=mail!
            newUser.name=credential.user.displayName!
            newUser.rol='GvjFmEHoPmcJRamN61Te'
            newUser.uid=credential.user.uid
            this.userService.postUser(newUser)
          }
        })
      }
    })
    this.observers.push(obs)
  }

}
