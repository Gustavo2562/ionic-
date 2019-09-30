import { Component, OnInit } from '@angular/core';
import { Jogador } from 'src/app/model/jogador'
import { JogadorService } from '../../services/jogador.service';
import { AlertController, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRoute } from '@angular/router';
    

@Component({
  selector: 'app-add-jogador',
  templateUrl: './add-jogador.page.html',
  styleUrls: ['./add-jogador.page.scss'],
})



export class AddJogadorPage implements OnInit {

  protected jogador: Jogador = new Jogador; //modificador de visibilidade "protected" e "private"
  protected id:any = null;
  
  constructor(
    protected jogadorService:JogadorService,
    protected alertController: AlertController,
    protected activeRoute:ActivatedRoute,
    public loadingController: LoadingController,
    private navCtrl: NavController, private loadingCtrl: LoadingController,
    protected router:Router
  ) { }

  ngOnInit() {
    this.id = this.activeRoute.snapshot.paramMap.get("id");
    if(this.id) {
      this.jogadorService.get(this.id).subscribe(
        res => {
          this.jogador = res
        },
        erro => this.id = null
      )
    }
  }
  onsubmit(form){
    if(!this.id){
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
    } else{
      this.jogadorService.update(this.jogador, this.id).then(
        res=>{
          form.reset();
          this.jogador=new Jogador;
          this.presentAlert("Aviso", "Atualizado!")
          this.router.navigate(['/tabs/listJogador']);
        },
        erro=>{
          console.log("Erro: " + erro);
          this.presentAlert("Erro", "Não foi possível atualizar!")
  
          
        }
      )
    }
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



