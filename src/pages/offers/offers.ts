import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { connect, Client, IConnackPacket } from 'mqtt';

@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html',
})
export class OffersPage {
  client:Client;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl:ToastController) {
    this.client = connect('mqtt://192.168.1.128',{port:3000});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OffersPage');
  }

  createOffer(offer:string){
    var theoffer = '';
    let toast = this.toastCtrl.create({
      message: 'An offer for '+offer+' has been created!',
      duration: 3500,
      position: 'top'
    });
    switch(offer){
      case 'PS4-Sidetables': theoffer = 'There is a new game you can participate in';
      break;
      case 'PS4': theoffer = 'We have new games which you can checkout';
      break;
      case 'Bookshelf-Sidetables': theoffer = 'Head over to our bookshelf for new books';
      break;
      case 'Sidetables': theoffer = 'We have new couches in our side table areas';
      break;
      case 'Entrypoint-counter':  theoffer = 'Stay for longer in our shop and get a 100 AED voucher';
      break;
      case 'Business-bookshelf': theoffer = 'We have todays newspaper with hidden discount vouchers';
      break;
      case 'Bookshelf': theoffer = "New books have arrived, check them out!";
      break;
      case 'Corner': theoffer = "Free milkshakes on us";
      break;
      case 'Business': theoffer ="A tuna sandwich on us";
      break;
    }
    toast.present();
    this.client.publish('cafe/offers/'+offer,theoffer);
  }

}
