import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { ProductsService } from 'src/app/demo/service/products.service';
import * as $ from "jquery";
import { Customer } from 'src/app/demo/domain/customer';
import { BillSummary, GSTSummary, InvoiceItem, ProductItem } from 'src/app/demo/domain/product';
import { errorToastr, successToastr, productUnits, invoiceTab, getCurrentDate, getISOCurrentDate, getISODate } from 'src/app/demo/service/apputils.service';
import { CustomersService } from 'src/app/demo/service/customers.service';
import { InvoiceService } from 'src/app/demo/service/invoice.service';
import { SSTNHDP } from 'src/app/demo/domain/sstnhdp';
import { SSTNJNP } from 'src/app/demo/domain/sstnjnp';
import { SSGNJNP } from 'src/app/demo/domain/ssgnjnp';

@Component({
    templateUrl: './tax-invoice.component.html',
    styleUrls: ['./tax-invoice.component.scss'],
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
    gstSummary = new Map<string, SSGNJNP>();

    searchText !: string;
    units = productUnits;
    filteredUnits: any = {};

    invoiceNumber: number = 0;
    invoiceDate: Date;
    visible: boolean = false;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private productService: ProductsService,
        private customerService: CustomersService,
        private invoiceService: InvoiceService) { }

    ngOnInit() {
        this.items = invoiceTab;
        this.invoiceDate = new Date();
        this.fetchAll();
        this.generateNewInvoiceNum();
        this.dummy();
    }

    dummy() {
        this.activeItem = this.items[1];
        this.visible = true;
        this.newProduct.pnscnm = "Sample";
        this.newProduct.pnhsnc = 3004;
        this.newProduct.pncgst = 9;
        this.newProduct.pnsgst = 9;
        this.newProduct.pnuqty = 4;
        this.newProduct.pnmcpr = 400;
        this.customerDetails.jpname = "Sample";
        this.customerDetails.jppgst = "DUFPS0618A";
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

        if (this.newProduct.pnsgst == 0) {
            this.messageService.add(errorToastr("SGST cannot be blank"));
            errorFlag = true;
        }
        if (this.newProduct.pncgst == 0) {
            this.messageService.add(errorToastr("CGST cannot be blank"));
            errorFlag = true;
        }
        if (this.newProduct.pnhsnc == 0) {
            this.messageService.add(errorToastr("HSN Code cannot be blank"));
            errorFlag = true;
        }
        if (this.newProduct.pnmcpr == 0) {
            this.messageService.add(errorToastr("Product Price cannot be blank"));
            errorFlag = true;
        }
        if (this.newProduct.pnuqty == 0) {
            this.messageService.add(errorToastr("Quantity cannot be blank"));
            errorFlag = true;
        }
        if (this.newProduct.pnscnm == "") {
            this.messageService.add(errorToastr("Product Name cannot be blank"));
            errorFlag = true;
        }

        if (errorFlag) {
            return;
        }
        this.addToCart(this.newProduct);
        this.clearProduct();
        this.visible = false;
    }

    addToCart(product) {
        let checkFlag = false;
        if (product.pnpdcd != "") {
            this.selectedProducts.forEach(element => {
                if (element.tnpdcd.trim() === product.pnpdcd.trim()) {
                    element.tntqty += 1;
                    element.tnnamt = element.tntqty * element.tnprice;
                    element.tncamt = element.tnnamt * element.tncgst / 100;
                    element.tnsamt = element.tnnamt * element.tnsgst / 100;
                    element.tntamt = element.tnnamt + element.tncamt + element.tnsamt;
                    checkFlag = true;
                    this.messageService.add(successToastr("Product added to Invoice"));
                    this.computeBillSummary();
                }
            });
        }
        if (checkFlag) {
            return;
        }

        let productItem: InvoiceItem = new InvoiceItem();
        productItem.tnbillno = this.invoiceNumber;
        productItem.tnscnm = product.pnscnm;
        productItem.tnchallan = '';
        productItem.tnhsnc = product.pnhsnc;
        productItem.tnpdcd = product.pnpdcd;

        productItem.tnunit = product.pnunit;
        productItem.tnuqty = product.pnuqty;

        productItem.tnprice = product.pnmcpr;
        productItem.tncgst = product.pncgst;
        productItem.tnsgst = product.pnsgst;

        productItem.tntqty = 1;
        productItem.tnnamt = productItem.tntqty * productItem.tnprice;
        productItem.tncamt = productItem.tnnamt * productItem.tncgst / 100;
        productItem.tnsamt = productItem.tnnamt * productItem.tnsgst / 100;
        productItem.tntamt = productItem.tnnamt + productItem.tncamt + productItem.tnsamt;
        this.selectedProducts.push(productItem);
        this.computeBillSummary();
        this.messageService.add(successToastr("Product added to Invoice"));
    }

    generateNewInvoiceNum() {
        if(this.invoiceDate == null) {
            this.invoiceDate = new Date();
        }
        this.invoiceService.newInvoice(getISODate(this.invoiceDate)).subscribe({
            next: response => {
                if(response.code === 200) {
                    this.invoiceNumber = response.data;
                }
                else {
                    this.invoiceNumber = parseInt(`${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDay}001`);
                }
            },
            error: error => {
                console.error("Error while fetching Invoice Number");
                console.error(error);
                this.invoiceNumber = parseInt(`${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDay}001`);
            }
        })
    }
    computeBillSummary() {
        this.billSummary = new BillSummary();
        this.selectedProducts.forEach(element => {
            this.billSummary.bsnamt += element.tnnamt;
            this.billSummary.bstcgst += element.tncamt;
            this.billSummary.bstsgst += element.tnsamt;
            this.billSummary.bstamt += element.tntamt;
            this.billSummary.bsfamt = Math.round(this.billSummary.bstamt);
            this.billSummary.bsroff = this.billSummary.bsfamt - this.billSummary.bstamt;
        });
        this.computeGSTSummary();
    }

    computeGSTSummary() {
        this.gstSummary.clear();
        this.selectedProducts.forEach(element => {
            let gst;
            if (this.gstSummary.has(element.tncgst.toString())) {
                gst = this.gstSummary.get(element.tncgst.toString());
            }
            else {
                gst = new SSGNJNP();
                gst.gngstp = element.tncgst.toString();
            }
            gst.gnbill = this.invoiceNumber;
            gst.gntxable += element.tnnamt;
            gst.gncamt += element.tncamt;
            gst.gnsamt += element.tnsamt;
            gst.gntamt += element.tntamt;
            this.gstSummary.set(gst.gngstp, gst);
        });
        let totalGst = new SSGNJNP();
        totalGst.gngstp = "Total";
        totalGst.gnbill = this.invoiceNumber;
        totalGst.gntxable += this.billSummary.bsnamt;
        totalGst.gncamt += this.billSummary.bstcgst;
        totalGst.gnsamt += this.billSummary.bstsgst;
        totalGst.gntamt += this.billSummary.bstamt;
        this.gstSummary.set("Total", totalGst);
    }

    onChange(newValue: any, row: InvoiceItem, column: string) {
        if (newValue == 0) {
            return;
        }
        switch (column) {
            case "tqty":
            case "tnprice":
                row.tnnamt = row.tntqty * row.tnprice;
                break;
            case "namt":
                row.tnprice = parseFloat((row.tnnamt / row.tntqty).toFixed(2));
                break;
            case "cgst":
                row.tnsgst = row.tncgst;
                break;
            case "sgst":
                row.tncgst = row.tnsgst;
                break;
            case "tntamt":
                row.tnnamt = parseFloat((row.tntamt / (1 + (row.tncgst / 100) + (row.tnsgst / 100))).toFixed(2));
                row.tncamt = parseFloat((row.tnnamt * row.tncgst / 100).toFixed(2));
                row.tnsamt = parseFloat((row.tnnamt * row.tnsgst / 100).toFixed(2));
                row.tnnamt = parseFloat((row.tntamt - row.tncamt - row.tnsamt).toFixed(2));
                row.tnprice = parseFloat((row.tnnamt / row.tntqty).toFixed(2));
                this.computeBillSummary();
                return;
        }
        row.tncamt = parseFloat((row.tnnamt * row.tncgst / 100).toFixed(2));
        row.tnsamt = parseFloat((row.tnnamt * row.tnsgst / 100).toFixed(2));
        row.tntamt = row.tnnamt + row.tncamt + row.tnsamt;
        this.computeBillSummary();
    }

    generateBill() {
        //Validate Header
        let isValidHeader = this.validateCompanyDetails();
        if (!isValidHeader) {
            return;
        }

        this.posting();
        this.saveCustomer();
        this.clearBill();
    }

    validateCompanyDetails(): boolean {
        let validFlag = true;
        if (this.customerDetails.jpname == "") {
            this.messageService.add(errorToastr("Company Name cannot be blank"));
            validFlag = true;
        }

        if (this.customerDetails.jppgst == "") {
            this.messageService.add(errorToastr("Company GST cannot be blank"));
            validFlag = true;
        }

        return validFlag;
    }

    clearBill() {
        this.customerDetails = new Customer();
        this.selectedProducts = [];
        this.gstSummary.clear();
        this.billSummary = new BillSummary();
        this.invoiceDate = new Date();
        this.generateNewInvoiceNum();
    }

    saveCustomer() {
        this.customerDetails.jpbaln += -1 * this.billSummary.bsfamt;
        this.customerDetails.jpdate = getCurrentDate();
        this.customerDetails.jpmobno = this.customerDetails.jpmobno == '0' ? '' : this.customerDetails.jpmobno;
    }

    posting() {
        //Generate Header
 
        let header = new SSTNHDP();
        header.tnbillno = this.invoiceNumber;
        header.tnname = this.customerDetails.jpname;
        header.tnpgst = this.customerDetails.jppgst;
        header.tntime = getISODate(this.invoiceDate);

        header.tnchqdt = "";
        header.tncsrv = 0;
        header.tnprbn = 0;
        header.tnrtna = 0;
        header.tntotal = this.billSummary.bsnamt;
        header.tngdtl = this.billSummary.bsfamt;
     
        //Generate Summary
        let billData = {
            header: header,
            details: this.selectedProducts,
            gst: [...this.gstSummary.values()]
        }
        console.log(billData);
        this.invoiceService.generate(billData).subscribe({
            next: response => {
                if(response.code == 200) {
                    this.messageService.add(successToastr("Invoice generated successfully"));
                }
                else {
                    this.messageService.add(errorToastr("Error while generating Invoice"));
                    console.error(response);
                }
            },
            error: error => {
                this.messageService.add(errorToastr("Error while generating Invoice"));
                console.error(error);
            },
            complete: () => {}
        });
    }
}