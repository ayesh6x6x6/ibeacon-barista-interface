import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user = {};
  zone: any;

  constructor(public navCtrl: NavController, public http: HTTP) {
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  ionViewWillEnter() {
    this.zone.run(()=>{
      console.log('Inside RUn');
      setInterval(()=>{
        this.http.get('http://10.25.159.146:3000/api/getuser',{},{}).then(data=>{
          this.user = JSON.parse(data.data);
          console.log(JSON.stringify(this.user));

        });
      }, 3000);
    });
    
  }

}
