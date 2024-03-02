import * as $ from 'jquery';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { BillSummary, InvoiceItem, ProductItem } from 'src/app/demo/domain/product';
import { Component, HostListener, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Customer } from 'src/app/demo/domain/customer';
import { CustomersService } from 'src/app/demo/service/customers.service';
import { errorToastr, getISODate2, getISTDate, invoiceTab, productUnits, successToastr} from 'src/app/demo/service/apputils.service';
import { InvoiceService } from 'src/app/demo/service/invoice.service';
import { ProductsService } from 'src/app/demo/service/products.service';
import { SSGNJNP } from 'src/app/demo/domain/ssgnjnp';
import { ActivatedRoute } from '@angular/router';
import { Header } from 'src/app/demo/domain/header';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    templateUrl: './quotation.component.html',
    styleUrls: ['./quotation.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class QuotationComponent implements OnInit {

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
    filteredQty: any[];
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
    qty: any[];
    invoiceDate: Date;
    visible: boolean = false;
    overflowLimit: number = 17;
    filename: string = "";
    billType: string = "Q";

    constructor(
        private spinner: NgxSpinnerService,
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
            this.header.tnbilltype = "Q";
            this.activeItem = this.items[0];
            this.invoiceDate = new Date();
            this.generateNewInvoiceNum();
            this.extractFromSession();
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
        this.header.tnbilltype = "Q";
        this.selectedProducts = [];
        this.gstSummary.clear();
        this.billSummary = new BillSummary();
        this.invoiceDate = new Date();
        this.generateNewInvoiceNum();
        this.fetchCustomerList();
        this.clearSession();
    }

    generateNewInvoiceNum() {
        //Spinner
        if(this.invoiceDate == null) {
            this.invoiceDate = new Date();
        }
        this.invoiceService.newInvoice(getISODate2(this.invoiceDate), this.billType).subscribe({
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
        this.spinner.show();
        this.productService.fetchAllProducts().subscribe({
            next: response => {
                if (response.code === 200) {
                    this.productList = response.data;
                    this.getQty(this.productList);
                }
            },
            error: err => {
                console.error(err);
                this.messageService.add(errorToastr("Error fetching Products"));
                this.spinner.hide();
            },
            complete: () => this.spinner.hide()
        });
    }

    getQty(productList: ProductItem[]) {
        let qty = new Set<string>();
        productList.forEach(element => qty.add(element.pnuqty.toString()));
        let tqty = [...qty].sort();
        this.qty = tqty.map(element => {return {name : element, code : element}});
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
            this.header.tnaddress = temp[0].jpaddress|| "";
            this.header.tnpgst = temp[0].jppgst;
            this.filename = `${this.header.tnbillno}_${this.header.tnname}_Tax Invoice.pdf`;
        }
    }

    //Filter     
    filter() {
        let filteredProduct = $("#searchSuggestion").val().toLowerCase();
        //Visible fails if backspace is pressed
        $("#productView div").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(filteredProduct) > -1)
        });
        let size = (this.filteredQty || []).length;
        if(size != 0) {
            this.filterQty();
        }
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
        if (this.newProduct.pncuspr == 0) {
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

        if (this.newProduct.pnhsnc == 0) {
            this.messageService.add(errorToastr("HSN Code cannot be blank"));
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
                    element.tntamt = element.tntqty * element.tnprice;
                    element.tntxable = parseFloat((element.tntamt / (1 + (element.tncgst / 100) + (element.tnsgst / 100))).toFixed(2));
                    element.tncamt = parseFloat((element.tntxable * element.tncgst / 100).toFixed(2));
                    element.tnsamt = parseFloat((element.tntxable * element.tnsgst / 100).toFixed(2));
                    element.tntxable = parseFloat((element.tntamt - element.tncamt - element.tnsamt).toFixed(2));
                
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


        productItem.tntamt = productItem.tntqty * productItem.tnprice;
        productItem.tntxable = parseFloat((productItem.tntamt / (1 + (productItem.tncgst / 100) + (productItem.tnsgst / 100))).toFixed(2));
        productItem.tncamt = parseFloat((productItem.tntxable * productItem.tncgst / 100).toFixed(2));
        productItem.tnsamt = parseFloat((productItem.tntxable * productItem.tnsgst / 100).toFixed(2));
        productItem.tntxable = parseFloat((productItem.tntamt - productItem.tncamt - productItem.tnsamt).toFixed(2));
        
        productItem.tnbilltype = this.billType;
        
        this.selectedProducts.push(productItem);
        this.computeBillSummary();
        this.messageService.add(successToastr("Product added to Invoice"));
    }

    
    fetchInvoice() {
        this.spinner.show();
        this.invoiceService.fetchBillDetails(this.invoice, this.billType).subscribe({
            next: (response) => {
                this.header = response['data'].header;
                this.filename = `${this.header.tnbillno}_${this.header.tnname}_Tax Invoice.pdf`;
                this.invoiceDate = new Date(this.header.tntime);
                this.selectedProducts = response['data'].details;
                this.billType = this.header.tnbilltype;
                this.computeBillSummary();
            },
            error: err => {
                console.error(err);
                this.messageService.add(errorToastr("Error fetching Invoice Details, Kindly refresh !!"));
                this.spinner.hide();
            },
            complete:() => this.spinner.hide()
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
                row.tntamt = parseFloat((row.tntqty * row.tnprice).toFixed(2));
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
                row.tnprice = parseFloat((row.tntamt / row.tntqty).toFixed(2));
                row.tntxable = parseFloat((row.tntamt / (1 + (row.tncgst / 100) + (row.tnsgst / 100))).toFixed(2));
                row.tncamt = parseFloat((row.tntxable * row.tncgst / 100).toFixed(2));
                row.tnsamt = parseFloat((row.tntxable * row.tnsgst / 100).toFixed(2));
                row.tntxable = parseFloat((row.tntamt - row.tncamt - row.tnsamt).toFixed(2));
                this.computeBillSummary();
                return;
        }
        row.tntxable = parseFloat((row.tntamt / (1 + (row.tncgst / 100) + (row.tnsgst / 100))).toFixed(2));
        row.tncamt = parseFloat((row.tntxable * row.tncgst / 100).toFixed(2));
        row.tnsamt = parseFloat((row.tntxable * row.tnsgst / 100).toFixed(2));
        row.tntxable = parseFloat((row.tntamt - row.tncamt - row.tnsamt).toFixed(2));
        this.computeBillSummary();
    }

    generateBill() {
        //Validate Header
        if (!this.validateCompanyDetails()) {
            return;
        }

        this.posting();
        if(this.newBill && this.header.tnname != "") {
            this.saveCustomer();
        }
        this.newBill = false;
    }

    validateCompanyDetails(): boolean {
        let validFlag = true;
        if(this.header.tnbilltype == "Q") {
            return true;
        }
        if (this.header.tnname == "") {
            this.messageService.add(errorToastr("Company Name cannot be blank"));
            validFlag = false;
        }

        if (this.header.tnpgst == "") {
            this.messageService.add(errorToastr("Company GST cannot be blank"));
            validFlag = false;
        }

        if (this.header.tntext.length > 40) {
            this.messageService.add(errorToastr("Comments should be less than 40 chars"));
            validFlag = false;
        }
        return validFlag;
    }

    posting() {
        //Generate Header
        let header = {...this.header};
        header.tntime = getISTDate(this.invoiceDate);
        header.tntotal  = this.billSummary.bstamt;
        let seq = 0;
        this.selectedProducts.forEach(element => {
            element.tnseqno = ++seq
            element.tnbillno = header.tnbillno;
            element.tnbilltype = header.tnbilltype;
        });
        this.gstSummary.forEach(element => {
            element.gnbilltype = header.tnbilltype;
            element.gnbill = header.tnbillno;
        });
        //Generate Summary
        let billData = {
            header: header,
            details: this.selectedProducts,
            gst: [...this.gstSummary.values()]
        }
        this.spinner.show();
        this.invoiceService.generate(billData, this.overflowLimit).subscribe({
            next: response => { 
                if(response.status == 500 || response == "") {
                    this.messageService.add(errorToastr("Error while generating Invoice"));
                    return;
                }
                let htmlContent = response;
                const newWindow = window.open('', '_blank');
                newWindow.document.write(htmlContent);
                newWindow.document.close();
                this.messageService.add(successToastr("Invoice generated successfully"));
                this.clearSession();
            },
            error: error => {
                this.messageService.add(errorToastr("Error while generating Invoice, Kindly refresh !!"));
                console.error(error);
                this.spinner.hide();
            },
            complete: () => this.spinner.hide()
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
            gst.gnbilltype = this.billType;
            this.gstSummary.set(gst.gngstp, gst);
        });
        let totalGst = new SSGNJNP();
        totalGst.gngstp = "Total";
        totalGst.gnbill = this.header.tnbillno;
        totalGst.gntxable += this.billSummary.bsnamt;
        totalGst.gncamt += this.billSummary.bstcgst;
        totalGst.gnsamt += this.billSummary.bstsgst;
        totalGst.gntamt += this.billSummary.bstamt;
        totalGst.gnbilltype = this.billType;
        this.gstSummary.set("Total", totalGst);
    }

    saveCustomer() {
        let customer = new Customer();
        customer.jpid = this.header.tncusid;
        customer.jpname = this.header.tnname;
        customer.jpaddress = this.header.tnaddress;
        customer.jpdate = getISTDate(this.invoiceDate);
        customer.jppgst = this.header.tnpgst;
        customer.jpmobno = this.header.tnmobno;
        this.customerService.add(customer).subscribe({
            next: response => {
                if(response.code == 200) {
                    this.messageService.add(successToastr("Customer saved successfully"));
                }
                else {
                    this.messageService.add(errorToastr("Failed to update customer Details"));
                }
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
        this.computeBillSummary();
    }

    delete(rowIndex: number) {
        this.selectedProducts.splice(rowIndex,1);
        this.computeBillSummary();
    }

    saveToSession() {
        if(this.selectedProducts.length > 0){
            sessionStorage.setItem("InvoiceHeader", JSON.stringify(this.header));
            sessionStorage.setItem("InvoiceBody", JSON.stringify(this.selectedProducts));
        }
    }

    extractFromSession() {
        if(this.selectedProducts.length == 0) {
            try {
                if(sessionStorage.getItem("InvoiceHeader") != null) {
                    this.header = JSON.parse(sessionStorage.getItem("InvoiceHeader"));
                }
                if(sessionStorage.getItem("InvoiceBody") != null) {
                    this.selectedProducts = JSON.parse(sessionStorage.getItem("InvoiceBody"));
                }
                this.computeBillSummary();
                this.activeItem = this.items[1];
            } catch (error) {

            }
        }
    }

    clearSession() {
        sessionStorage.removeItem("InvoiceHeader");
        sessionStorage.removeItem("InvoiceBody");
    }

    @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
        this.saveToSession();
    }
}