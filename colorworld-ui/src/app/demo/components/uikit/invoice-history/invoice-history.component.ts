import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

@Component({
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.scss']
})
export class InvoiceHistoryComponent {

    items: MenuItem[] | undefined;

    activeItem: MenuItem | undefined;
    constructor() { }

    ngOnInit() {

        this.items = [
            { label: 'Tax Invoice', icon: 'pi pi-fw pi-wallet' },
            { label: 'Quotation', icon: 'pi pi-fw pi-slack' }   
        ];
        if(sessionStorage.getItem("SalesInvoiceHistory") != null || sessionStorage.getItem("SalesInvoiceHistory") != undefined) {
            this.activeItem = this.items.filter(e => e.label == sessionStorage.getItem("SalesInvoiceHistory"))[0];
        }
        else {
            this.activeItem = this.items[0];
        }
        
    }

    onActiveItemChange(event) {
        this.activeItem = event;
        sessionStorage.setItem("SalesInvoiceHistory", event.label);
    }

}
