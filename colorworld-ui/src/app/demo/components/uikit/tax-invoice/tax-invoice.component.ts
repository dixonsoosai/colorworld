import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { ProductsService } from 'src/app/demo/service/products.service';
import * as $ from "jquery";
import { Customer } from 'src/app/demo/domain/customer';
import { BillSummary, GSTSummary, InvoiceItem, ProductItem } from 'src/app/demo/domain/product';
import { errorToastr, successToastr, productUnits, invoiceTab } from 'src/app/demo/service/apputils.service';

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
    selectedProducts: InvoiceItem[] = [];
    newProduct: ProductItem = new ProductItem();

    billSummary = new BillSummary();
    gstSummary = new Map<string, GSTSummary>();

    searchText !: string;
    units = productUnits;
    filteredUnits:any  = {};

    visible: boolean = false;
    position: string = 'top';

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService, 
        private productService: ProductsService) { }

    ngOnInit() {
        this.items = invoiceTab;
        this.activeItem = this.items[1];

        this.fetchAll();
        this.visible = true;
        this.newProduct.pnscnm = "Sample";
        this.newProduct.pnhsnc = 3004;
        this.newProduct.pncgst = 9;
        this.newProduct.pnsgst = 9;
        this.newProduct.pnuqty = 4;
        this.newProduct.pnmcpr = 400;
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
    }

    clearProduct() {
        this.newProduct = new ProductItem();
    }

    addProduct() {
        //Validation
        this.newProduct.pnpdcd = '';
        let errorFlag = false;
        this.newProduct.pnunit = this.filteredUnits.code;
        
        if(this.newProduct.pnsgst == 0) {
            this.messageService.add(errorToastr("SGST cannot be blank"));
            errorFlag = true;
        }
        if(this.newProduct.pncgst == 0) {
            this.messageService.add(errorToastr("CGST cannot be blank"));
            errorFlag = true;
        }
        if(this.newProduct.pnhsnc == 0) {
            this.messageService.add(errorToastr("HSN Code cannot be blank"));
            errorFlag = true;
        }
        if(this.newProduct.pnmcpr == 0) {
            this.messageService.add(errorToastr("Product Price cannot be blank"));
            errorFlag = true;
        }
        if(this.newProduct.pnuqty == 0) {
            this.messageService.add(errorToastr("Quantity cannot be blank"));
            errorFlag = true;
        }
        if(this.newProduct.pnscnm == "") {
            this.messageService.add(errorToastr("Product Name cannot be blank"));
            errorFlag = true;
        }
        
        if(errorFlag) {
            return;
        }
        this.addToCart(this.newProduct);
        this.clearProduct();
        this.visible = false;
    }

    addToCart(product) {
        let checkFlag = false;
        if(product.pnpdcd != "") {
            this.selectedProducts.forEach(element => {
                if(element.pnpdcd.trim() === product.pnpdcd.trim()) {
                    element.pntqty += 1;
                    element.pnnamt = element.pntqty * element.pnprice;
                    element.pncgsta = element.pnnamt* element.pncgst / 100;
                    element.pnsgsta = element.pnnamt* element.pnsgst / 100;
                    element.pntamt = element.pnnamt + element.pncgst + element.pnsgst;
                    checkFlag = true;
                    this.messageService.add(successToastr("Product added to Invoice"));
                    this.computeBillSummary();
                }
            });
        }
        if(checkFlag){
            return;
        }

        let productItem :InvoiceItem = new InvoiceItem();
        productItem.pnscnm = product.pnscnm;
        productItem.pnchallan = '';
        productItem.pnhsnc = product.pnhsnc;
        productItem.pnpdcd = product.pnpdcd;
        
        productItem.pnunit = product.pnunit;
        productItem.pnuqty = product.pnuqty;
        
        productItem.pnprice = product.pnmcpr;
        productItem.pncgst = product.pncgst;
        productItem.pnsgst = product.pnsgst;
        
        productItem.pntqty = 1;
        productItem.pnnamt = productItem.pntqty * productItem.pnprice;
        productItem.pnnamt.toFixed(2);
        
        productItem.pncgsta = productItem.pnnamt * productItem.pncgst / 100;
        productItem.pncgsta.toFixed(2);
        
        productItem.pnsgsta = productItem.pnnamt * productItem.pnsgst / 100;
        productItem.pnsgsta.toFixed(2);
        
        productItem.pntamt = productItem.pnnamt + productItem.pncgsta + productItem.pnsgsta;
        this.selectedProducts.push(productItem);
        this.computeBillSummary();
        this.messageService.add(successToastr("Product added to Invoice"));
    }

    computeBillSummary() {
        this.billSummary = new BillSummary();
        this.selectedProducts.forEach(element => { 
            this.billSummary.bsnamt += element.pnnamt;
            this.billSummary.bstcgst += element.pncgsta;
            this.billSummary.bstsgst += element.pnsgsta;
            this.billSummary.bstamt += element.pntamt;
        });
        this.computeGSTSummary();
    }

    computeGSTSummary() {
        this.gstSummary = new Map<string, GSTSummary>();
        this.selectedProducts.forEach(element => { 
            let gst;
            if(this.gstSummary.has(element.pncgst.toString())) {
                gst = this.gstSummary.get(element.pncgst.toString());
            }
            else {
                gst = new GSTSummary();
                gst.gngstp = element.pncgst.toString();
            }
            gst.gnnamt += element.pnnamt;
            gst.gntcgst += element.pncgsta;
            gst.gntsgst += element.pnsgsta;
            gst.gntamt += element.pntamt;
            this.gstSummary.set(gst.gngstp, gst);
        });
        let totalGst = new GSTSummary();
        totalGst.gngstp = "Total";
        totalGst.gnnamt += this.billSummary.bsnamt;
        totalGst.gntcgst += this.billSummary.bstcgst;
        totalGst.gntsgst += this.billSummary.bstsgst;
        totalGst.gntamt += this.billSummary.bstamt;
        this.gstSummary.set("Total", totalGst);
        console.log(this.gstSummary);
    }
}