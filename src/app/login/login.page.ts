import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Facebook } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  errorMessage = '';

  constructor(
    private facebook: Facebook,
    private navCtrl: NavController
  ) { }

  ngOnInit() {

  }
  loginFacebook() {
    this.facebook.login(['public_profile', 'email'])
      .then(res => {
        console.log(res.status);
        this.navCtrl.navigateForward('/games');
      }, err => {
        console.log(err);
      });
  }

}
