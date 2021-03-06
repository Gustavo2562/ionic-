import { Component, OnInit } from '@angular/core';
import { Jogador } from 'src/app/model/jogador'
import { JogadorService } from '../../services/jogador.service';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  MarkerCluster,
  MyLocation,
  LocationService

} from '@ionic-native/google-maps';


@Component({
  selector: 'app-add-jogador',
  templateUrl: './add-jogador.page.html',
  styleUrls: ['./add-jogador.page.scss'],
})



export class AddJogadorPage implements OnInit {

  protected jogador: Jogador = new Jogador; //modificador de visibilidade "protected" e "private"
  protected id: any = null;
  protected preview: any = null;
  protected posLat: number = 0;
  protected posLng: number = 0;

  protected map: GoogleMap;


  constructor(
    protected jogadorService: JogadorService,
    protected alertController: AlertController,
    protected activeRoute: ActivatedRoute,
    public loadingController: LoadingController,
    private navCtrl: NavController, private loadingCtrl: LoadingController,
    protected router: Router,
    private camera: Camera,
    protected geolocation: Geolocation,
    private platform: Platform


  ) { }

  async ngOnInit() {

    this.localAtual();
    await this.platform.ready();
    await this.loadMap();

    this.id = this.activeRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.jogadorService.get(this.id).subscribe(
        res => {
          this.jogador = res
          this.preview = this.jogador.foto
        },
        //erro => this.id = null
      )
    }

    this.localAtual()
  }

  onsubmit(form) {
    if (!this.preview) {
      this.presentAlert("Erro", "Deve inserir a foto do usuário");
    } else {
      this.jogador.foto = this.preview;
      this.jogador.lat = this.posLat;
      this.jogador.lng = this.posLng;

      if (!this.id) {
        this.jogadorService.save(this.jogador).then(
          res => {
            form.reset();
            this.jogador = new Jogador;
            //console.log("Cadastrado");
            this.presentAlert("Aviso", "Cadastro")
            this.router.navigate(['/']);

          },
          erro => {
            console.log("Erro: " + erro);
            this.presentAlert("Erro", "Não foi possível fazer o cadastro")

          }
        )
      } else {
        this.jogadorService.update(this.jogador, this.id).then(
          res => {
            form.reset();
            this.jogador = new Jogador;
            this.presentAlert("Aviso", "Atualizado!")
            this.router.navigate(['/tabs/listJogador']);
          },
          erro => {
            console.log("Erro: " + erro);
            this.presentAlert("Erro", "Não foi possível atualizar!")


          }
        )
      }
    }
  }

  tirarFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.preview = base64Image;

    }, (err) => {
      // Handle error
    });
  }

  localAtual() {
    this.geolocation.getCurrentPosition().then(
      resp => {
        this.posLat = resp.coords.latitude;
        this.posLng = resp.coords.longitude;
      }).catch(
        error => {
          console.log('Não foi possivel pegar sua localização!', error);
        });
  }


  //Alertas ionic
  async presentAlert(tipo: string, texto: string) {
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

  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      'camera': {
        'target': {
          "lat": this.posLat,
          "lng": this.posLng
        },
        'zoom': 15
      }
    });
    //this.addCluster(this.dummyData());
    this.minhaLocalizacao()
  }

  minhaLocalizacao() {
    LocationService.getMyLocation().then(
      (myLocation: MyLocation) => {
        this.map.setOptions({
          camera: {
            target: myLocation.latLng
          }
        })
        let marker: Marker = this.map.addMarkerSync({
          position: {
            lat: myLocation.latLng.lat,
            lng: myLocation.latLng.lng
          },
          icon: "00ff00",
          title: this.jogador.nome,
          snippet: this.jogador.nickname
        })
        //nome no mapa
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(
          res => {
            marker.setTitle(this.jogador.nome)
            marker.setSnippet(this.jogador.nickname)
            marker.showInfoWindow()
          }
        )

  this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(

    res=>{
      this.map.addMarker({
        position:{
          lat:res.position.lat,
          lng:res.position.lng
        }
      })
    }
  )

      }
    )
  }
}


