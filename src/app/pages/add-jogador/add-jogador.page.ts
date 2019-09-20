import { Component, OnInit } from '@angular/core';
import { Jogador } from 'src/app/model/jogador'
@Component({
  selector: 'app-add-jogador',
  templateUrl: './add-jogador.page.html',
  styleUrls: ['./add-jogador.page.scss'],
})
export class AddJogadorPage implements OnInit {

  protected jogador: Jogador = new Jogador; //modificador de visibilidade "protected" e "private"

  constructor() { }

  ngOnInit() {
  }

}
