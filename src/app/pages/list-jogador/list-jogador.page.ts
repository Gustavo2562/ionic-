import { Component, OnInit } from '@angular/core';
import { JogadorService } from '../../services/jogador.service'

@Component({
  selector: 'app-list-jogador',
  templateUrl: './list-jogador.page.html',
  styleUrls: ['./list-jogador.page.scss'],
})
export class ListJogadorPage implements OnInit {

protected jogadores: any;

  constructor(
    protected jogadorService:JogadorService
  ) { }

  ngOnInit() {
    this.jogadorService.getAll().subscribe(
    res=>{
      this.jogadores = res;
    }
  )
}

  doRefresh(event){
      console.log('Begin async operation');
      this.jogadorService.getAll().subscribe(
       res=> {
         this.jogadores = res
        setTimeout(() => {
          console.log('Async operation has ended');
          event.target.complete();
      }, 0);
    }
  );
}
}