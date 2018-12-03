import { Component, NgZone } from '@angular/core';
import { NavController, ToastController  } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { connect, Client, IConnackPacket } from 'mqtt';
import { Storage } from '@ionic/storage';
import uniq from 'lodash';
import { UserDetailsPage } from '../user-details/user-details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  users = [];
  zone: any;
  client:Client
  orders = [];
  loopflag = false;
  tick = false;

  constructor(public navCtrl: NavController, public http: HTTP,private toastCtrl: ToastController, private storage: Storage) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.client = connect('mqtt://192.168.1.128',{port:3000});
    this.client.subscribe('cafe/orders/#');
    this.client.subscribe('cafe/tobarista/#', (err, granted) => {
    }).on('message', (topic: string, payload: string) => {
      if(this.users.length){
        this.users.forEach(user=>{
          console.log(user.favItems)
        })
      }
      console.log(`message from ${topic}: ${payload}`);
      console.log('Loop flag is :'+this.loopflag);
      if(topic.substring(0,14)=='cafe/tobarista'){
        const person = JSON.parse(payload);
        const user = person.username;
        if(this.users.findIndex(existinguser=>existinguser == user)<0){
          console.log('Found user for once:'+person.username);
          this.zone.run(()=>{
            this.users.push(user);
          });          
        }
      }
      // if(topic.substring(0,14)=='cafe/tobarista' && this.loopflag == false){
      //   this.loopflag = true;
      //   // this.users = uniq(this.users);
      //   console.log(JSON.stringify(this.users));
      //     const person = JSON.parse(payload);
      //     const user = {username: person.username};
      //     if(this.users.findIndex(existinuser=>existinuser.username == user.username)<0 && this.tick == false){
      //       console.log('Found user for once:'+person.username);
      //       this.tick = true;
      //       this.http.get('https://smartcafeserver.herokuapp.com/api/getuser',user,{}).then(data=>{          
      //         this.zone.run(()=>{
      //             this.users.push(JSON.parse(data.data));
      //             this.loopflag = false;
      //             console.log(this.users);   
      //             this.tick = false;     
      //         });
      //       });
      //     } else {
      //       this.loopflag = false;
      //     }
      //       this.users.forEach(existinguser=>{
      //         if(user.username == existinguser.username){
      //           flag = true;
      //         }
      //       });

        
      // }
      if(topic.substring(0,12)=='cafe/orders/'){
        this.zone.run(()=>{
          console.log('Received message from an order:'+payload);
          const order = JSON.parse(payload);
          this.orders.push(
            {
              bill:order.total,
              cart:order.cart,
              user:order.user
            }
          );
          
          this.storage.set('Orders',this.orders);
          let toast = this.toastCtrl.create({
            message: 'An order has just been added!',
            duration: 2000,
            position: 'top'
          });
          toast.present();
          console.log(this.orders);
        });
       
      }


    }).on('connect', (packet: IConnackPacket) => {
        console.log('connected!', JSON.stringify(packet))
      });
    }
  
  onReady(username:string){
    this.zone.run(()=>{
      const ind = this.users.findIndex(user=>user.username == username);
      this.users.splice(ind,1);
    });
  }

  onUserDetails(user:string){
    this.navCtrl.push(UserDetailsPage,{user:user});
  }
  ionViewWillEnter() {
    // this.zone.run(()=>{
    //   console.log('Inside RUn');
    //   setInterval(()=>{
    //     this.http.get('http://10.25.159.146:3000/api/getuser',this.user,{}).then(data=>{
    //       this.user = JSON.parse(data.data);
    //       console.log(JSON.stringify(this.user));

    //     });
    //   }, 3000);
    // });
    
  }

}
