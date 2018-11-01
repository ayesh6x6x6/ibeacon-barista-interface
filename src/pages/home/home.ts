import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { connect, Client, IConnackPacket } from 'mqtt';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user = {};
  zone: any;

  constructor(public navCtrl: NavController, public http: HTTP,public client:Client) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    client = connect('mqtt://test.mosquitto.org',{port:8080});
    client.subscribe('/cafe/tobarista', (err, granted) => {
    }).on('message', (topic: string, payload: string) => {
      console.log(`message from ${topic}: ${payload}`);
      const person = JSON.parse(payload);
      this.user = {username: person.username, password: person.password};
      this.http.get('http://10.25.159.146:3000/api/getuser',this.user,{}).then(data=>{
        this.user = JSON.parse(data.data);
        console.log(JSON.stringify(this.user));
      });
    }).on('connect', (packet: IConnackPacket) => {
        console.log('connected!', JSON.stringify(packet))
      });
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
