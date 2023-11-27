import * as $ from 'jquery';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { errorToastr, productUnits, successToastr } from 'src/app/demo/service/apputils.service';
import { ProductItem } from 'src/app/demo/domain/product';
import { ProductsService } from 'src/app/demo/service/products.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    templateUrl: './product.component.html',
    styleUrls: ['./products.component.scss'],
    providers: [MessageService, ConfirmationService, DialogService]
})
export class ProductComponent {

    isLoading = false;
    product: ProductItem = new ProductItem();
    productList!: ProductItem[];
    searchText !: string;
    qty: any[];
    filteredQty  = [];

    visible: boolean = false;
    
    constructor(
        private spinner: NgxSpinnerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private productService: ProductsService
    ) {
    }

    ngOnInit() {
        this.fetchAll();
    }

    fetchAll() {
        this.spinner.show();
        this.searchText = "";
        this.productService.fetchAllProducts().subscribe({
            next: response => {
                if (response.code === 200) {
                    this.productList = response.data;
                    this.getQty(this.productList);
                }
            },
            error: err => console.error('An error occurred :', err.errorMessage),
            complete: () => this.spinner.hide()
        });
    }

    getQty(productList: ProductItem[]) {
        let qty = new Set<string>();
        productList.forEach(element => qty.add(element.pnuqty.toString()));
        let tqty = [...qty].sort();
        this.qty = tqty.map(element => {return {name : element, code : element}});
    }

    delete(product: ProductItem) {
        this.confirmationService.confirm({
            message: `Are you sure that you want to delete this product? <br>Product Name: ${product.pnscnm} <br> Product Code: ${product.pnpdcd}`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.spinner.show();
                this.productService.deleteProductByCode(product.pnpdcd).subscribe({
                    next: response => {
                        if (response.code === 200) {
                            this.messageService.add(successToastr("Product deleted successfully"));
                            this.fetchAll();
                        }
                    },
                    error: err => {
                        this.messageService.add(errorToastr("Error while deleting Product. Kindly Kindly contact system administrator"));
                        console.error(err);
                    },
                    complete: () => this.spinner.hide()
                });
            }
        });
    }

    view(product: ProductItem) {
        this.product = { ...product};
        this.show();
    }

    show() {
        this.visible = true;
    }

    clear() {
        this.searchText = "";
        this.product = new ProductItem();
        this.visible = false;
    }
    //Filter
    filter() {
        let filteredProduct = $("#searchSuggestion").val().toLowerCase();
        //Visible fails if backspace is pressed
        $("#productView div").filter(function () {
            if($(this).text().toLowerCase().indexOf(filteredProduct) != -1)
                $(this).show();
            else
                $(this).hide();
        });
        let size = (this.filteredQty || []).length;
        if(size != 0) {
            this.filterQty();
        }
    }

    clearQty() {
        this.filteredQty = [];
        this.filter();
    }

    filterQty() {
        let size = this.filteredQty.length;
        let filteredQty = this.filteredQty;
        if((filteredQty || []).length == 0) {
            this.filter();
            return;
        }
        $("#productView div:visible").filter(function () {
            $(this).hide();
            for(let i = 0; i< size; i++) {
                let startPos = $(this).text().indexOf("Quantity");
                let lastPos = $(this).text().lastIndexOf("Price");
                let searchString = $(this).text().substring(startPos, lastPos).toLowerCase();
                if(searchString.indexOf(filteredQty[i].code.toLowerCase()) != -1) {
                    $(this).show();
                    break;
                }
            }
        });
    }

    save() {
        //Validation
        let errorFlag = false;
        if(this.product.pncolor == "") {
            this.messageService.add(errorToastr("Product Name cannot be blank"));
            errorFlag  = true;
        }
        if(this.product.pncmpd == "") {
            this.messageService.add(errorToastr("Product Brand cannot be blank"));
            errorFlag  = true;
        }
        if(this.product.pncmpy == "") {
            this.messageService.add(errorToastr("Company Name cannot be blank"));
            errorFlag  = true;
        }
        if(this.product.pnscnm == "") {
            this.messageService.add(errorToastr("Short Name cannot be blank"));
            errorFlag  = true;
        }
        if(this.product.pnscnm.length >= 15) {
            this.messageService.add(errorToastr("Display Name cannot be more than 15 chars"));
            errorFlag  = true;
        }
        if(this.product.pnpdcd == "") {
            this.messageService.add(errorToastr("Product Code cannot be blank"));
            errorFlag  = true;
        }
        if(this.product.pnmrp == 0) {
            this.messageService.add(errorToastr("MRP cannot be blank"));
            errorFlag  = true;
        }
        if(this.product.pnmcpr == 0) {
            this.messageService.add(errorToastr("Merchant Price cannot be blank"));
            errorFlag  = true;
        }
        if(this.product.pncuspr == 0) {
            this.messageService.add(errorToastr("Customer Price cannot be blank"));
            errorFlag  = true;
        }
        if(this.product.pnuqty == 0) {
            this.messageService.add(errorToastr("Unit quantity cannot be blank"));
            errorFlag  = true;
        }
        if(this.product.pnunit == "") {
            this.messageService.add(errorToastr("Unit cannot be blank"));
            errorFlag  = true;
        }
        if(this.product.pnhsnc == 0) {
            this.messageService.add(errorToastr("HSN Code cannot be blank"));
            errorFlag  = true;
        }
        if(this.product.pncgst == 0) {
            this.messageService.add(errorToastr("CGST cannot be blank"));
            errorFlag  = true;
        }
        if(this.product.pnsgst == 0) {
            this.messageService.add(errorToastr("SGST cannot be blank"));
            errorFlag  = true;
        }
        if(errorFlag) {
            return;
        }
        this.product.pnavail ="Y";
        this.product.pngstpr = this.product.pncuspr;
        this.spinner.show();
        this.productService.addProduct(this.product).subscribe({
            next: response => {
                if(response.code == 200) {
                    this.messageService.add(successToastr("Product added successfully"));
                    this.fetchAll();
                }
            },
            error: error => {
                this.messageService.add(errorToastr("Error while saving product"));
                console.error(error);
            },
            complete:() => this.spinner.hide()
        });
    }
}
