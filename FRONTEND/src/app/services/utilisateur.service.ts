import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilisateur } from 'src/app/models/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  
  API_Login_Url: string = "/api/login" as const;

  constructor(private httpClient: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  };


  public Connexion(prenom: string, motdepasse: string) : Observable<Utilisateur> {

    let data = `prenom=${prenom}&motdepasse=${motdepasse}`;
    return this.httpClient.post<Utilisateur>(this.API_Login_Url, data, this.httpOptions);
  }
}