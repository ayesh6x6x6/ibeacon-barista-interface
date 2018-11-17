import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WaiterTrackPage } from './waiter-track';

@NgModule({
  declarations: [
    WaiterTrackPage,
  ],
  imports: [
    IonicPageModule.forChild(WaiterTrackPage),
  ],
})
export class WaiterTrackPageModule {}
