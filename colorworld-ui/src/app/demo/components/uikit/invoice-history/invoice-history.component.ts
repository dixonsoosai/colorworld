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
            { label: 'Tax Invoice', icon: 'pi pi-fw pi-copy' },
            { label: 'Quotation', icon: 'pi pi-fw pi-file' }        
        ];

        this.activeItem = this.items[0];
    }

    onActiveItemChange(event: MenuItem) {
        this.activeItem = event;
    }

}
