import { Component } from '@angular/core';

import { ModalController, ToastController, LoadingController, NavController } from 'ionic-angular'

import { Geolocation } from '@ionic-native/geolocation';
import { Location } from './../../models/location';
import { Camera, CameraOptions } from '@ionic-native/camera';


declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  location: Location = {
    lat: 18.771739,
    lng: 98.8864364
  }

  locationIsSet: boolean = false;

  base64Image: string = 'assets/imgs/camera.png';
  imageDisplay: string;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private geolocation: Geolocation,
    private loadCtrl: LoadingController,
    private toasCtrl: ToastController,
    private camera: Camera,

  ) {}
  ionViewDidLoad() {
    this.onLocation();
  }

  onLocation() {

    const loader = this.loadCtrl.create({
      content: 'Getting your Location...'
    });
    loader.present();

    this.geolocation.getCurrentPosition()
      .then((resp) => {
        loader.dismiss();
        this.location.lat = resp.coords.latitude
        this.location.lng = resp.coords.longitude
        this.locationIsSet = true;

        console.log(this.location);
      })
      .catch((error) => {

        console.log('Error getting location', error);

        loader.dismiss();
        const toast = this.toasCtrl.create({
          message: 'Could not get location, please pick it manually!',
          duration: 2500
        })
        toast.present();
      });
  }

  OnTakePhoto() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData)

      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(this.base64Image)

      this.imageDisplay = this.base64Image;
    }, (err) => {
      // Handle error
    });
  }

  onRefresh() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);

  }



  onClickInfoView() {
    console.log("aa :"+ this.location)

    let path1 =  { lat : this.location.lat, lng:this.location.lng }
    let path2 =  { lat : this.location.lat, lng:this.location.lng }


    this.directionsService.route({
      origin:  path1,
      destination: path2,
      travelMode: 'DRIVING'

    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);

        let end_address = response.routes[0].legs[0].end_address;

        console.log(response.routes[0].legs[0].distance.text)
        console.log(response.routes[0].legs[0].end_address)


      } else {
        window.alert('Directions request failed due to ' + status);
      }

    }
    );
  }

  onSubmit(value) {
    console.log('onSubmit')
  }
}
