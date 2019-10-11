import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Game } from '../model/game';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    protected fire:AngularFirestore
  ) { }

  save(game){
    return this.fire.collection("games")
    .add({
      nome: game.nome,
      categoria: game.categoria,
      console: game.console,
      descricao: game.descricao,
      foto: game.foto,
      quantidade: game.quantidade,
      valor: game.valor
    });
  }

  getAll(){
    return this.fire.collection("games").snapshotChanges()
    .pipe(
      map(dados => 
        dados.map(d => ({ key: d.payload.doc.id, ...d.payload.doc .data() }))
      )
    )
  }

  get(id){
    return this.fire.collection("games").doc<Game>(id).valueChanges();
}
update(game, id){
  return this.fire.collection("games").doc<Game>(id).update(game);

  }

  remove(game){
    return this.fire.collection("games").doc(game.key).delete();
  }
}

