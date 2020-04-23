import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Games } from './games';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})

export class DbService {
  private storage: SQLiteObject;
  gamesList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
  ) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'games_db.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.getDataFal();
        });
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchGames(): Observable<Games[]> {
    return this.gamesList.asObservable();
  }

  getDataFal() {
    this.httpClient.get(
      'assets/dump.sql',
      { responseType: 'text' }
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data)
        .then(_ => {
          this.getGames();
          this.isDbReady.next(true);
        })
        .catch(error => console.error(error));
    });
  }

  getGames() {
    return this.storage.executeSql('SELECT * FROM games', []).then(res => {
      const items: Games[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            nombre: res.rows.item(i).nombre,
            precio: res.rows.item(i).precio,
            tipo: res.rows.item(i).tipo,
            calificacion: res.rows.item(i).calificacion,
          });
        }
      }
      this.gamesList.next(items);
    });
  }

  addGame(nombre, precio, tipo, calificacion) {
    const data = [nombre, precio, tipo, calificacion];
    // tslint:disable-next-line: max-line-length
    return this.storage.executeSql('INSERT INTO games (nombre, precio, tipo, calificacion) VALUES (?, ?, ?, ?)', data)
      .then(res => {
        this.getGames();
      });
  }

}
