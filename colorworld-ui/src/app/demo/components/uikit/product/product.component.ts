import * as $ from 'jquery';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { errorToastr, productUnits, successToastr } from 'src/app/demo/service/apputils.service';
import { ProductItem } from 'src/app/demo/domain/product';
import { ProductsService } from 'src/app/demo/service/products.service';

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
    units = productUnits;
    filteredUnits  = [];

    visible: boolean = false;
    
    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private productService: ProductsService
    ) {
    }

    ngOnInit() {
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

    delete(product: ProductItem) {
        this.confirmationService.confirm({
            message: `Are you sure that you want to delete this product? <br>Product Name: ${product.pnscnm} <br> Product Code: ${product.pnpdcd}`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = false;
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
                    complete: () => this.isLoading = true
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
        this.product = new ProductItem();
        this.visible = false;
    }
    //Filter
    filter(event) {
        let filteredProduct = $(event.srcElement).val().toLowerCase();
        $("#productView div").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(filteredProduct) > -1)
        });
    }

    filterUnits() {
        let size = this.filteredUnits.length;
        let filteredUnits = this.filteredUnits;
        $("#productView div").filter(function () {
            if(filteredUnits.length == 0) {
                $(this).toggle(true);
            }
            else {
                $(this).toggle(false);
                for(let i = 0; i< size; i++) {
                    let unitPos = $(this).text().indexOf("Unit");
                    let lastPos = $(this).text().lastIndexOf("View");
                    if($(this).text().toLowerCase().indexOf(filteredUnits[i].code.toLowerCase()) > unitPos && 
                        $(this).text().toLowerCase().indexOf(filteredUnits[i].code.toLowerCase()) < lastPos) {
                        $(this).toggle(true);
                        break;
                    }
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
            }
        });
    }
}
