import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Billing',
                items: [
                    { label: 'Tax Invoice', icon: 'pi pi-fw pi-wallet', routerLink: ['/home/tax-invoice'] },
                    { label: 'Quotation', icon: 'pi pi-fw pi-slack', routerLink: ['/home/quotation'] },
                    { label: 'Sales Invoice History', icon: 'pi pi-fw pi-history', routerLink: ['/home/invoice-history'] },
                    { label: 'Purchase Bills', icon: 'pi pi-fw pi-chart-line', routerLink: ['/home/purchase'] },
                    //{ label: 'Esdee Formula', icon: 'pi pi-fw pi-palette', routerLink: ['/home/esdee-formula'] },
                ]
            },
            {
                label: 'Miscellaneous',
                items: [
                    { label: 'Products', icon: 'pi pi-fw pi-cart-plus', routerLink: ['/home/products'] },
                    { label: 'Customers', icon: 'pi pi-fw pi-users', routerLink: ['/home/customer'] },
                ]
            },
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Release Notes', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
                    }
                ]
            }
        ];
    }
}
