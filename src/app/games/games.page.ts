import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DbService } from './../services/db.service';
import { ToastController } from '@ionic/angular';
import { Facebook } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
})
export class GamesPage implements OnInit {

  mainForm: FormGroup;
  Data: any[] = [];
  user: any = {};

  constructor(
    private db: DbService,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private facebook: Facebook
  ) { }

  ngOnInit() {
    this.getInfo();
    this.db.dbState().subscribe((res) => {
      if (res) {
        this.db.fetchGames().subscribe(item => {
          this.Data = item;
          console.log(this.Data);
        });
      }
    });

    this.mainForm = this.formBuilder.group({
      nombre: [''],
      precio: [''],
      tipo: [''],
      calificacion: [''],
    });
  }

  storeData() {
    this.db.addGame(
      this.mainForm.value.nombre,
      this.mainForm.value.precio,
      this.mainForm.value.tipo,
      this.mainForm.value.calificacion,
    ).then((res) => {
      this.mainForm.reset();
    });
  }

  getInfo() {
    this.facebook.api('/me?fields=id,name,email,first_name,picture,last_name,gender', ['public_profile', 'email'])
      .then(data => {
        console.log(data);
        this.user = data;
      })
      .catch(error => {
        console.error(error);
      });
  }
}
