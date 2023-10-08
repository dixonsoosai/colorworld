import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { ProductsService } from 'src/app/demo/service/products.service';
import * as $ from "jquery";
import { Customer } from 'src/app/demo/domain/customer';
import { ProductItem } from 'src/app/demo/domain/product';
import { successToastr } from 'src/app/demo/service/apputils.service';

@Component({
    templateUrl: './tax-invoice.component.html',
    styleUrls : ['./tax-invoice.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class TaxInvoiceComponent implements OnInit {

    isLoading = false;
    
    items: MenuItem[] | undefined;
    activeItem: MenuItem | undefined;
    
    productList = [];
    customerDetails: Customer = new Customer();
    selectedProducts: ProductItem[] = [];
  
    searchText !: string;
    units = [
        { name: 'Kg', code: 'kg' },
        { name: 'gm', code: 'gm' },
        { name: 'L', code: 'l' },
        { name: 'ml', code: 'ml' },
        { name: 'Nos', code: 'Nos'}
    ];
    filteredUnits  = [];

    visible: boolean = false;
    position: string = 'top';

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService, 
        private productService: ProductsService) { }

    ngOnInit() {
        this.items = [
            { label: 'Products', icon: 'pi pi-fw pi-shopping-cart' },
            { label: 'Invoice', icon: 'pi pi-fw pi-calendar' },
        ];
    
        this.activeItem = this.items[0];
        this.fetchAll();
    }

    fetchAll() {
        this.isLoading = false;
        this.productService.fetchAllProducts().subscribe({
            next: response => {
                if (response.code === 200) {
                    this.productList = response.data;
                }
            },
            error: err => console.error('An error occurred :', err.errorMessage),
            complete: () => this.isLoading = true
        });
    }

    //Filter 
    
    filter(event) {
        let filteredProduct = $(event.srcElement).val().toLowerCase();
        $("#productView div").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(filteredProduct) > -1)
        });
    }

    onActiveItemChange(event: MenuItem) {
        this.activeItem = event;
        console.log(this.activeItem);
    }

    addToCart(product) {
        let checkFlag = false;
        if(product.pnpdcd != "") {
            this.selectedProducts.forEach(element => {
                if(element.pnpdcd.trim() === product.pnpdcd.trim()) {
                    element.pntqty += 1;
                    element.pnnamt = element.pntqty * product.pnmcpr;
                    element.pncgst = element.pnnamt* product.pncgst/100;
                    element.pnsgst = element.pnnamt* product.pnsgst/100;
                    element.pntamt = element.pnnamt + element.pncgst + element.pnsgst;
                    checkFlag = true;
                }
            });
        }
        if(checkFlag){
            return;
        }
        let productItem :any = {};
        productItem.pnscnm = product.pnscnm;
        productItem.pnhsnc = product.pnhsnc;
        productItem.pnpdcd = product.pnpdcd;
        
        productItem.pnunit = product.pnunit;
        productItem.pnuqty = product.pnuqty;
        
        productItem.pnprice = product.pnmcpr;
        productItem.pncgsp = product.pncgst;
        productItem.pnsgsp = product.pnsgst;
        
        productItem.pntqty = 1;
        productItem.pnnamt = productItem.pntqty * product.pnnamt;
        productItem.pncgst = productItem.pnnamt * product.pncgst/100;
        productItem.pnsgst = productItem.pnnamt * product.pnsgst/100;
        productItem.pntamt = product.pnnamt + productItem.pncgst + productItem.pnsgst;
        this.selectedProducts.push(productItem);
        console.log(this.selectedProducts);
        this.messageService.add(successToastr("Product added to Invoice"));
    }
}