import { Component, OnInit } from '@angular/core';
import { Jogador } from 'src/app/model/jogador'
import { JogadorService } from '../../services/jogador.service';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
    

@Component({
  selector: 'app-add-jogador',
  templateUrl: './add-jogador.page.html',
  styleUrls: ['./add-jogador.page.scss'],
})



export class AddJogadorPage implements OnInit {

  protected jogador: Jogador = new Jogador; //modificador de visibilidade "protected" e "private"

  
  constructor(
    protected jogadorService:JogadorService,
    protected alertController: AlertController,
    public loadingController: LoadingController,
    protected router:Router
  ) { }

  ngOnInit() {
  }

  

  onsubmit(form){
    this.jogadorService.save(this.jogador).then(
      res=>{
        form.reset();
        this.jogador=new Jogador;
        //console.log("Cadastrado");
        this.presentAlert("Aviso", "Cadastro")
        this.router.navigate(['/tabs/listJogador']);

      },
      erro=>{
        console.log("Erro: " + erro);
        this.presentAlert("Erro", "Não foi possível fazer o cadastro")

        
      }
    )
  }

  



  //Alertas ionic
  async presentAlert(tipo:string, texto:string) {
    const alert = await this.alertController.create({
      header: tipo,
      //subHeader: 'Subtitle',
      message: texto,
      buttons: ['OK']
    });
    await alert.present();
    
    
  }
  
  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }
}



