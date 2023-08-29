import { Component } from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor() {
  }

  toggleSidebar() {
    $(".sidebar").toggleClass("close");
  }

  toggleMenu(event) {
    $(event.target).closest("li").toggleClass("showMenu");
  }

}
