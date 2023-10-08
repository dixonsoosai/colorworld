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
                    { label: 'Sales/Purchase History', icon: 'pi pi-fw pi-id-card', routerLink: ['/home/formlayout'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/home/input'] },
                    { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/home/floatlabel'] },
                    { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/home/invalidstate'] },
                    { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/home/button'] },
                    { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/home/table'] },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/home/message'] },
                    
                    
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
                label: 'Utilities',
                items: [
                    { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'] },
                    { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
                ]
            },
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Release Notes', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
                    },
                    {
                        label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
                    }
                ]
            }
        ];
    }
}
