import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class JogadorService {

  constructor(
    protected fire:AngularFirestore
  ) { }

  save(jogador){
    return this.fire.collection("jogadores").add(jogador)
  }
}
