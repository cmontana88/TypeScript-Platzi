import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Player } from '../interfaces/player';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playersDb!: AngularFireList<Player>;

  constructor(private db: AngularFireDatabase) { 
    this.playersDb = this.db.list('/players', ref => ref.orderByChild('name'));
  }

  getPlayers(): Observable<Player[]> {
    return this.playersDb.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => ({ $key: c.key, ...c.payload.val() } as Player))
      })
    );
  }

  addPlayer(player: Player){
    return this.playersDb.push(player);
  }

  deletePlayer(id: string){
    this.db.list('/players').remove(id);
  }

  editPlayer(newPlayerData: Player){
    const $key = newPlayerData.$key; 
    delete(newPlayerData.$key);
    this.db.list('/players').update($key as string, newPlayerData);
  }
}
