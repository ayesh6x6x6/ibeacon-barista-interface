import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { OrdersPage } from '../orders/orders';
import { OffersPage } from '../offers/offers';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  

  tab1Root = HomePage;
  tab2Root = OrdersPage;
  tab3Root = OffersPage;
  // tab3Root = 0;

  constructor() {

  }
}
