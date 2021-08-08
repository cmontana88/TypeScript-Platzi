import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '../interfaces/team';

export const TeamsTableHeaders = ['Name', 'Country', 'Players'];

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamsDb!: AngularFireList<Team>;

  constructor(private db: AngularFireDatabase) {
    this.teamsDb = this.db.list('/teams', ref => ref.orderByChild('name'));
   }

   getTeams(): Observable<Team[]> {
    return this.teamsDb.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => ({ $key: c.key, ...c.payload.val() } as Team))
      })
    );
  }

  addTeam(Team: Team){
    return this.teamsDb.push(Team);
  }

  deleteTeam(id: string){
    this.db.list('/teams').remove(id);
  }

  editTeam(newTeamData: Team){
    let $key = newTeamData.$key; 
    delete(newTeamData.$key);
    this.db.list('/teams').update($key as string, newTeamData);
  }
}
