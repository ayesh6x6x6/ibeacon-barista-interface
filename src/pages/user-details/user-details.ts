import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage implements OnInit {
  user = {
    username: '',
    img: '../../assets/imgs/dp.jpg',
    preferences: []
  };
  param = '';
  zone:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public http: HTTP) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.param = this.navParams.get('user');
    console.log('Param is :'+this.param);
  }

  ngOnInit(){
    this.http.get('https://smartcafeserver.herokuapp.com/api/getuser',{username:this.param},{}).then(data=>{          
      this.zone.run(()=>{
        const person = JSON.parse(data.data);
        console.log(JSON.stringify(person));
        this.user.username = person.username;
        this.user.img = person.picture;
        person.favItems.forEach(item=>{
          this.http.get('https://smartcafeserver.herokuapp.com/api/getmenuitems',{item:item},{}).then(data=>{
            const pref = JSON.parse(data.data);
            this.user.preferences.push(pref.item);
            console.log('Prefs'+this.user.preferences);
          });
        });
        
      });
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDetailsPage');
  }

}
