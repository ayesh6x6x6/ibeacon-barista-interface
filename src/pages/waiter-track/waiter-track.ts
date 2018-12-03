import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { connect, Client, IConnackPacket } from 'mqtt';

@Component({
  selector: 'page-waiter-track',
  templateUrl: 'waiter-track.html',
})
export class WaiterTrackPage {
  client:Client;
  zone:any;
  username:string = '';
  table:string = '';
  reachedCustomer:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.client = connect('mqtt://192.168.1.128',{port:3000});
    this.client.on('message',(topic:string,payload:string)=>{
      // if(topic.substring(0,15)=='/cafe/tobarista'){
      //   // this.client.unsubscribe(`cafe/users/${this.username}`);
      //   this.zone.run(()=>{
      //     console.log('Inside barista');
      //     const user = JSON.parse(payload);
      //     if(this.username == user.username){
      //       this.reachedCustomer = true;
      //     }
      //     console.log('reachedCustomer:'+this.reachedCustomer);
      //     // this.client.unsubscribe('/cafe/tobarista');
      //   });        
      // } else if(topic.substring(0,11)=='cafe/users/') {
        this.zone.run(()=>{
          const track = JSON.parse(payload);
          const table = track.table;
          console.log('Table gotten is:'+table);
          this.table = table;
        });
      // }     

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaiterTrackPage');
  }
  ionViewWillEnter(){
    this.username = this.navParams.get('username');
    this.client.subscribe(`cafe/usertracker/${this.username}`);
  }

}
