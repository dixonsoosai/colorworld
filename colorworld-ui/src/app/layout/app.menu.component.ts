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
                    { label: 'Tax Invoice', icon: 'pi pi-fw pi-box', routerLink: ['/home/myworkitems'] },
                    { label: 'Invoice History', icon: 'pi pi-fw pi-list', routerLink: ['/home/tasklist'] },
                    { label: 'Sales/Purchase', icon: 'pi pi-fw pi-search', routerLink: ['/home/table'] },
                ]
            },
            {
                label: 'Miscellaneous',
                items: [
                    { label: 'Products', icon: 'pi pi-fw pi-sliders-h', routerLink: ['/home/formlayout'] },
                    { label: 'Customers', icon: 'pi pi-fw pi-check-square', routerLink: ['/home/input'] },
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
