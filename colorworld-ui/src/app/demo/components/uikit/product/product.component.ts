import { Component } from '@angular/core';
import { Products } from 'src/app/demo/domain/products';
import { ProductsService } from 'src/app/demo/service/products.service';
import * as $ from 'jquery';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { errorToastr, successToastr } from 'src/app/demo/service/apputils.service';

@Component({
    templateUrl: './product.component.html',
    styleUrls: ['./products.component.scss'],
    providers: [MessageService, ConfirmationService, DialogService]
})
export class ProductComponent {

    isLoading = false;
    products!: Products;
    productList!: Products[];
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

    add() {
        this.isLoading = false;
        let product = "";
        this.productService.addProduct(product).subscribe({
            next: response => {
                if (response.code === 200) {
                    console.log(response);
                }
            },
            error: err => {
                this.messageService.add(errorToastr("Error while adding Product. Kindly contact system administrator"));
                console.error(err);
            },
            complete: () => this.isLoading = true
        });
    }

    delete(productCode: string) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = false;
                this.productService.deleteProductByCode(productCode).subscribe({
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

    

    view(product: any) {
        console.log(product);
        this.show();
    }

    show() {
        this.visible = true;
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
}
