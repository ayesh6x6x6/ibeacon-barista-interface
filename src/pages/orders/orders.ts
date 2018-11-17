import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { connect, Client, IConnackPacket } from 'mqtt';
import { Storage } from '@ionic/storage';
import { WaiterTrackPage } from '../waiter-track/waiter-track';

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {
  orders = [];
  zone: any;
  client:Client

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.client = connect('mqtt://192.168.1.128',{port:3000});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }

  onReady(username:string){
    this.client.subscribe(`cafe/users/${username}`).on('message',(topic:string,payload:string)=>{
      const {table} = JSON.parse(payload);
      console.log('Table gotten is:'+table);
      this.client.publish(`cafe/orderarrive/${table}`,'Arriving');
      this.client.unsubscribe(`cafe/users/${username}`);
    });
    console.log('Order ready for user:'+username);
    this.client.publish(`cafe/orderready/${username}`,"Order ready");
    this.navCtrl.push(WaiterTrackPage,{username:username});
  }

  onServed(username:string){
    this.zone.run(()=>{
      const ind = this.orders.findIndex(order=>order.user.username == username);
      this.orders.splice(ind,1);
      this.storage.set('Orders',this.orders);
    });
    
  }

  ionViewWillEnter(){
    this.zone.run(()=>{
      this.storage.get('Orders').then((orders)=>{
        this.orders = orders;
        console.log('Retrieved orders');
      });
    });
    
  }

}
