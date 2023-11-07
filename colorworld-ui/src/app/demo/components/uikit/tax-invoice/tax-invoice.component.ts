import * as $ from 'jquery';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { BillSummary, InvoiceItem, ProductItem } from 'src/app/demo/domain/product';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Customer } from 'src/app/demo/domain/customer';
import { CustomersService } from 'src/app/demo/service/customers.service';
import { errorToastr, getISODate2, getISTDate, invoiceTab, productUnits, successToastr} from 'src/app/demo/service/apputils.service';
import { InvoiceService } from 'src/app/demo/service/invoice.service';
import { ProductsService } from 'src/app/demo/service/products.service';
import { SSGNJNP } from 'src/app/demo/domain/ssgnjnp';
import { ActivatedRoute } from '@angular/router';
import { Header } from 'src/app/demo/domain/header';

@Component({
    templateUrl: './tax-invoice.component.html',
    styleUrls: ['./tax-invoice.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class TaxInvoiceComponent implements OnInit {

    isLoading = false;
    newBill = true;

    //Tab Menu Configuration
    items: MenuItem[] | undefined;
    activeItem: MenuItem | undefined;

    //Path Param
    invoice: string;
    
    //All List
    productList = [];
    customerList: Customer[] = [];
    
    //Filtered List
    filteredCustomers: any[];
    filteredUnits: any = {};
    customerSuggestions: string[];
    selectedProducts: InvoiceItem[] = [];
    newProduct: ProductItem = new ProductItem();

    //Bill Format
    header: Header = new Header();
    billSummary = new BillSummary();
    gstSummary = new Map<string, SSGNJNP>();

    //Additional 
    searchText !: string;
    units = productUnits;
    invoiceDate: Date;
    visible: boolean = false;
    overflowLimit: number = 17;
    filename: string = "";

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute,
        private productService: ProductsService,
        private customerService: CustomersService,
        private invoiceService: InvoiceService) { }

    ngOnInit() {
        this.items = invoiceTab;
        this.fetchAll();
        this.fetchCustomerList();
        if(this.route.snapshot.paramMap.has('bill')) {
            this.newBill = false;
            this.invoice = this.route.snapshot.paramMap.get('bill');
            this.fetchInvoice();
            this.activeItem = this.items[1];
        }
        else {
            this.activeItem = this.items[0];
            this.invoiceDate = new Date();
            this.generateNewInvoiceNum();
        }
    }

    dummy() {
        this.visible = true;
        this.activeItem = this.items[1];     
        this.newProduct.pnscnm = "Sample";
        this.newProduct.pnhsnc = 3004;
        this.newProduct.pncgst = 9;
        this.newProduct.pnsgst = 9;
        this.newProduct.pnuqty = 4;
        this.newProduct.pnunit = "kg";
        this.newProduct.pnmcpr = 400;
        this.header.tnpgst = "DUFPS0618A";
        //this.addProduct();
    }

    clearBill() {
        this.overflowLimit = 17;
        this.header = new Header();
        this.selectedProducts = [];
        this.gstSummary.clear();
        this.billSummary = new BillSummary();
        this.invoiceDate = new Date();
        this.generateNewInvoiceNum();
        this.fetchCustomerList();
    }

    generateNewInvoiceNum() {
        //Spinner
        if(this.invoiceDate == null) {
            this.invoiceDate = new Date();
        }
        this.invoiceService.newInvoice(getISODate2(this.invoiceDate)).subscribe({
            next: response => {
                if(response.code === 200) {
                    this.header.tnbillno = response.data;
                }
                else {
                    this.header.tnbillno = parseInt(`${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDay}001`);
                }
                this.newBill = true;
            },
            error: error => {
                console.error("Error while fetching Invoice Number");
                console.error(error);
                this.header.tnbillno = parseInt(`${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDay}001`);
            }
        })
    }

    fetchCustomerList() {
        this.customerService.fetchAll().subscribe({
            next:response => {
                this.customerList = response.data;
            }
        });
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

    searchSuggestion(event: AutoCompleteCompleteEvent) {
        let filtered: string[] = [];
        let query = event.query;
        for (let i = 0; i < this.customerList.length; i++) {
            let customer = this.customerList[i];
            if (customer.jpname.toLowerCase().indexOf(query.toLowerCase()) == 0 || query.trim() == "") {
                filtered.push(customer.jpname);
            }
        }
        this.filteredCustomers = filtered;
    }

    populateDetails() {
        let temp:Customer [] = this.customerList.filter(customer => customer.jpname == this.header.tnname);
        if(temp.length > 0){
            this.header.tncusid = temp[0].jpid;
            this.header.tnname = temp[0].jpname;
            this.header.tnmobno = temp[0].jpmobno;
            this.header.tnadd = temp[0].jpadd || "";
            this.header.tnprvbn = temp[0].jpbaln;
            this.header.tnpgst = temp[0].jppgst;
            this.filename = `${this.header.tnbillno}_${this.header.tnname}_TaxInvoice.pdf`;
        }
    }

    //Filter     
    filter(event) {
        let filteredProduct = $(event.srcElement).val().toLowerCase();
        $("#productView div").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(filteredProduct) > -1)
        });
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
        if(this.selectedProducts.length >= this.overflowLimit) {
            this.messageService.add(errorToastr("Cannot add more Products"));
        }
        let checkFlag = false;
        if (product.pnpdcd != "") {
            this.selectedProducts.forEach(element => {
                if (element.tnpdcd.trim() === product.pnpdcd.trim()) {
                    element.tntqty += 1;
                    element.tntxable = parseFloat((element.tntqty * element.tnprice * (1 - 0.01 * element.tndisc)).toFixed(2));
                    element.tncamt = parseFloat((element.tntxable * element.tncgst / 100).toFixed(2));
                    element.tnsamt = parseFloat((element.tntxable * element.tnsgst / 100).toFixed(2));
                    element.tntamt = parseFloat((element.tntxable + element.tncamt + element.tnsamt).toFixed(2));
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
        productItem.tnbillno = this.header.tnbillno;
        productItem.tnscnnm = product.pnscnm;
        productItem.tnchallan = '';
        productItem.tnhsnc = product.pnhsnc;
        productItem.tnpdcd = product.pnpdcd;

        productItem.tnunit = product.pnunit;
        productItem.tnuqty = product.pnuqty;
        productItem.tnprice = product.pncuspr;
    
        productItem.tncgst = product.pncgst;
        productItem.tnsgst = product.pnsgst;
        
        productItem.tntqty = 1;
        productItem.tndisc = 0;
        productItem.tntxable = productItem.tntqty * productItem.tnprice;
        productItem.tncamt = parseFloat((productItem.tntxable * productItem.tncgst / 100).toFixed(2));
        productItem.tnsamt = parseFloat((productItem.tntxable * productItem.tnsgst / 100).toFixed(2));
        productItem.tntamt = parseFloat((productItem.tntxable + productItem.tncamt + productItem.tnsamt).toFixed(2));

        this.selectedProducts.push(productItem);
        this.computeBillSummary();
        this.messageService.add(successToastr("Product added to Invoice"));
    }

    
    fetchInvoice() {
        this.invoiceService.fetchBillDetails(this.invoice).subscribe({
            next: (response) => {
                this.header = response['data'].header;
                this.invoiceDate = new Date(this.header.tntime.substring(0,10));
                this.selectedProducts = response['data'].details;
                this.populateDetails();
                this.computeBillSummary();
            },
        });
    }

    onChange(newValue: any, row: InvoiceItem, column: string) {
        if (newValue == 0) {
            return;
        }
        switch (column) {
            case "tqty":
            case "tnprice":
            case "tndisc":
                row.tntxable = parseFloat((row.tntqty * row.tnprice * (1- 0.01*row.tndisc)).toFixed(2));
                break;
            case "namt":
                row.tndisc = 0;
                row.tnprice = parseFloat((row.tntxable / row.tntqty).toFixed(2));
                break;
            case "cgst":
                row.tnsgst = row.tncgst;
                break;
            case "sgst":
                row.tncgst = row.tnsgst;
                break;
            case "tntamt":
                row.tndisc = 0;
                row.tntxable = parseFloat((row.tntamt / (1 + (row.tncgst / 100) + (row.tnsgst / 100))).toFixed(2));
                row.tncamt = parseFloat((row.tntxable * row.tncgst / 100).toFixed(2));
                row.tnsamt = parseFloat((row.tntxable * row.tnsgst / 100).toFixed(2));
                row.tntxable = parseFloat((row.tntamt - row.tncamt - row.tnsamt).toFixed(2));
                row.tnprice = parseFloat((row.tntxable / row.tntqty).toFixed(2));
                this.computeBillSummary();
                return;
        }
        row.tncamt = parseFloat((row.tntxable * row.tncgst / 100).toFixed(2));
        row.tnsamt = parseFloat((row.tntxable * row.tnsgst / 100).toFixed(2));
        row.tntamt = parseFloat((row.tntxable + row.tncamt + row.tnsamt).toFixed(2));
        this.computeBillSummary();
    }

    generateBill() {
        //Validate Header
        if (!this.validateCompanyDetails()) {
            return;
        }

        this.posting();
        if(this.newBill) {
            this.saveCustomer();
        }
        this.newBill = false;
    }

    validateCompanyDetails(): boolean {
        let validFlag = true;
        if (this.header.tnname == "") {
            this.messageService.add(errorToastr("Company Name cannot be blank"));
            validFlag = false;
        }

        if (this.header.tnpgst == "") {
            this.messageService.add(errorToastr("Company GST cannot be blank"));
            validFlag = false;
        }

        return validFlag;
    }

    posting() {
        //Generate Header
        let header = {...this.header};
        header.tntime = getISTDate(this.invoiceDate);
        header.tntotal  = header.tngdtl = this.billSummary.bstamt;
        header.tnprbn = 0;
        //Generate Summary
        let billData = {
            header: header,
            details: this.selectedProducts,
            gst: [...this.gstSummary.values()]
        }
        this.invoiceService.generate(billData, this.overflowLimit).subscribe({
            next: response => { 
                if(response.code == 500 || response == "") {
                    this.messageService.add(errorToastr("Error while generating Invoice"));
                    return;
                }
                let htmlContent = response;
                const newWindow = window.open('', '_blank');
                newWindow.document.write(htmlContent);
                newWindow.document.close();
                newWindow.print();
                this.messageService.add(successToastr("Invoice generated successfully"));
                
            },
            error: error => {
                this.messageService.add(errorToastr("Error while generating Invoice"));
                console.error(error);
            },
            complete: () => {}
        });
    }

    computeBillSummary() {
        this.billSummary = new BillSummary();
        this.selectedProducts.forEach(element => {
            this.billSummary.bsnamt += parseFloat((element.tntxable).toFixed(2));
            this.billSummary.bstcgst += parseFloat((element.tncamt).toFixed(2));
            this.billSummary.bstsgst += parseFloat((element.tnsamt).toFixed(2));
            this.billSummary.bstamt += parseFloat((element.tntamt).toFixed(2));
            this.billSummary.bsfamt = Math.round(this.billSummary.bstamt);
            this.billSummary.bsroff = this.billSummary.bsfamt - this.billSummary.bstamt;
        });
        this.computeGSTSummary();
    }

    computeGSTSummary() {
        this.gstSummary.clear();
        this.selectedProducts.forEach(element => {
            let gst;
            if (this.gstSummary.has((element.tncgst + element.tnsgst).toString())) {
                gst = this.gstSummary.get((element.tncgst + element.tnsgst).toString());
            }
            else {
                gst = new SSGNJNP();
                gst.gngstp = (element.tncgst + element.tnsgst).toString();
            }
            gst.gnbill = this.header.tnbillno;
            gst.gntxable += parseFloat((element.tntxable).toFixed(2));
            gst.gncamt += parseFloat((element.tncamt).toFixed(2));
            gst.gnsamt += parseFloat((element.tnsamt).toFixed(2));
            gst.gntamt += parseFloat((element.tntamt).toFixed(2));
            this.gstSummary.set(gst.gngstp, gst);
        });
        let totalGst = new SSGNJNP();
        totalGst.gngstp = "Total";
        totalGst.gnbill = this.header.tnbillno;
        totalGst.gntxable += this.billSummary.bsnamt;
        totalGst.gncamt += this.billSummary.bstcgst;
        totalGst.gnsamt += this.billSummary.bstsgst;
        totalGst.gntamt += this.billSummary.bstamt;
        this.gstSummary.set("Total", totalGst);
    }

    saveCustomer() {
        let customer = new Customer();
        customer.jpid = this.header.tncusid;
        customer.jpname = this.header.tnname;
        customer.jpadd = this.header.tnadd;
        customer.jpbaln = this.header.tnprvbn + (-1 * this.billSummary.bsfamt);
        customer.jpdate = getISTDate(this.invoiceDate);
        customer.jppgst = this.header.tnpgst;
        customer.jpmobno = this.header.tnmobno;
        this.customerService.add(customer).subscribe({
            next: response => {
                if(response.code == 200) {
                    return;
                }
                this.messageService.add(errorToastr("Failed to update customer Details"));
            },
            error: error => {
                this.messageService.add(errorToastr("Failed to update customer Details"));
            },
            complete: () => {}
        });
    }

    onActiveItemChange(event: MenuItem) {
        this.activeItem = event;
    }

    clearProduct() {
        this.newProduct = new ProductItem();
    }

    copy(product: InvoiceItem) {
        this.selectedProducts.push({...product});
    }

    delete(rowIndex: number) {
        this.selectedProducts.splice(rowIndex,1);
    }
}