import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { Customer } from 'src/app/demo/domain/customer';
import { CustomersService } from 'src/app/demo/service/customers.service';
import { DialogService } from 'primeng/dynamicdialog';
import { errorToastr, formatPurchaseBillData, getISTDate, getLastDay, getPurchaseHistoryHeader, saveAsExcelFile, successToastr } from 'src/app/demo/service/apputils.service';
import { PurchaseBill } from 'src/app/demo/domain/purchase';
import { PurchaseService } from 'src/app/demo/service/purchase.service';
import { Table } from 'primeng/table';

@Component({
    templateUrl: './purchase.component.html',
    providers: [MessageService, ConfirmationService, DialogService, FilterService]
})
export class PurchaseComponent implements OnInit {

    purchaseDetails: PurchaseBill[];
    loading = false;
    
    visible = false;
    purchaseBill : PurchaseBill = new PurchaseBill(); 
    filterDate;

    customerList: Customer[] = [];
    filteredCustomers: any[];
    customerSuggestions: string[];

    @ViewChild('dt1') dt: Table;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private purchaseService: PurchaseService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private customerService: CustomersService,
        private filterService: FilterService
        ) {

    }
    ngOnInit(): void {
        this.fetchAll();
        this.fetchCustomerList();
        this.configureFilter();
    }

    fetchCustomerList() {
        this.customerService.fetchAll().subscribe({
            next:response => {
                this.customerList = response.data;
            }
        });
    }

    configureFilter() {
        this.filterService.register("dateContains", (value, filter): boolean => {
            let startDate = filter[0];
            let endDate = filter[1];
            return value>= startDate && value <= endDate;
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
        let temp:Customer [] = this.customerList.filter(customer => customer.jpname == this.purchaseBill.arname);
        if(temp.length > 0){
            this.purchaseBill.argstno =  temp[0].jppgst;
        }
    }

    filterPurchase() {
        let startDate = new Date(this.filterDate);
        let endDate = getLastDay(startDate);
        const dateRange = [startDate, endDate];
        this.dt.filter(dateRange, 'ardate', 'dateContains');
    }
    fetchAll() {
        this.loading = true;
        this.purchaseService.fetchAll().subscribe({
            next: response => {
                response.data.forEach(item => {
                    if(item != null) {
                        item.ardate = item.ardate == null ? "" : new Date(item.ardate.substring(0,10));
                    }
                });
                this.purchaseDetails = response.data;
                this.loading = false;
            },
            error: error => {

            },
            complete: () => {
                this.loading = false;
            }
        }
        );
    }

    clearFilter(table: Table) {
        table.clear();
        this.filterDate = "";
        document.getElementById("searchText")["value"] = "";
    }

    exportExcel(dataTable: Table) {
        let filteredData = dataTable.filteredValue == null ? this.purchaseDetails : dataTable.filteredValue;
        saveAsExcelFile(formatPurchaseBillData(filteredData), getPurchaseHistoryHeader(), "Purchase History");
    }

    addBill() {
        this.visible = true;
    }

    save() {

        let errorFlag = false;
        if(this.purchaseBill.arbillno == "") {
            this.messageService.add(errorToastr("Invoice Number cannot be blank"));
            errorFlag = true;
        }
        if(this.purchaseBill.arname == "") {
            this.messageService.add(errorToastr("Company Name cannot be blank"));
            errorFlag = true;
        }
        if(this.purchaseBill.ardate == "") {
            this.messageService.add(errorToastr("Invoice Date cannot be blank"));
            errorFlag = true;
        }
        if(this.purchaseBill.arnamt == 0) {
            this.messageService.add(errorToastr("Net Amount cannot be blank"));
            errorFlag = true;
        }
        if(this.purchaseBill.arcgst == 0) {
            this.messageService.add(errorToastr("CGST cannot be blank"));
            errorFlag = true;
        }

        if(this.purchaseBill.arsgst == 0) {
            this.messageService.add(errorToastr("SGST cannot be blank"));
            errorFlag = true;
        }
        if(this.purchaseBill.artamt == 0) {
            this.messageService.add(errorToastr("Total Amount cannot be blank"));
            errorFlag = true;
        }

        if(this.purchaseBill.archqamt != 0 || this.purchaseBill.archqdte != "" || this.purchaseBill.archqno != 0 ||
            this.purchaseBill.arbname != "") {
                if(this.purchaseBill.archqamt == 0) {
                    this.messageService.add(errorToastr("Cheque Amount cannot be blank"));
                    errorFlag = true;
                }
                if(this.purchaseBill.archqdte == "") {
                    this.messageService.add(errorToastr("Cheque Date cannot be blank"));
                    errorFlag = true;
                }
                if(this.purchaseBill.archqno == 0) {
                    this.messageService.add(errorToastr("Cheque Number cannot be blank"));
                    errorFlag = true;
                }
            }


        if(errorFlag) {
            return;
        }
        let tempBill = { ...this.purchaseBill};
        tempBill.ardate = getISTDate(new Date(tempBill.ardate));
        this.purchaseService.save(tempBill).subscribe({
            next: response => {
                if(response.code == 200) {
                    this.messageService.add(successToastr("Bill saved successfully"));
                    this.fetchAll();
                }
            },
            error: err => {
                this.messageService.add(errorToastr("Error while saving Bill. Kindly contact system administrator"));
                console.error(err);
            },
            complete: () => {}
        }
            
        );
    }
    clear() {
        this.purchaseBill = new PurchaseBill();
    }

    view(purchaseBill : PurchaseBill) {
        this.purchaseBill = { ...purchaseBill};
        this.visible = true;
    }

    delete(purchaseBill: PurchaseBill) {
        this.confirmationService.confirm({
            message: `Are you sure that you want to delete? <br> Invoice: ${purchaseBill.arbillno}<br> Company Name: ${purchaseBill.arname}` ,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.purchaseService.delete(purchaseBill.arbillno, purchaseBill.arname).subscribe({
                    next: response => {
                        if(response["status"] == 200) {
                            this.messageService.add(successToastr("Invoice deleted successfully"));
                            this.fetchAll();
                        }
                        else {
                            this.messageService.add(errorToastr("Error deleting Invoice"));
                            console.error(response);
                        }
                        window.location.reload();
                    },
                    error: error => {
                        this.messageService.add(errorToastr("Error deleting Invoice"));
                        console.error(error);
                    },
                    complete:() => {}

                });
            }
        });
    }

    calculate(column: string) {
        switch(column) {
            case "arnamt":
                this.purchaseBill.arcgst = this.purchaseBill.arsgst = parseFloat((this.purchaseBill.arnamt * 0.09).toFixed(2));
                this.purchaseBill.artamt = parseFloat((this.purchaseBill.arnamt + this.purchaseBill.arcgst + 
                        this.purchaseBill.arsgst).toFixed(2));
                break;
            case "arcgst":
                this.purchaseBill.arsgst = this.purchaseBill.arcgst;
                this.purchaseBill.artamt = parseFloat((this.purchaseBill.arnamt + this.purchaseBill.arcgst + 
                    this.purchaseBill.arsgst).toFixed(2));
                break;
            case "arsgst":
                this.purchaseBill.arcgst = this.purchaseBill.arsgst;
                this.purchaseBill.artamt = parseFloat((this.purchaseBill.arnamt + this.purchaseBill.arcgst + 
                    this.purchaseBill.arsgst).toFixed(2));
                break;
            case "artamt":
                this.purchaseBill.arnamt = parseFloat((this.purchaseBill.artamt/(1.18)).toFixed(2));
                this.purchaseBill.arcgst = this.purchaseBill.arsgst = parseFloat((this.purchaseBill.arnamt * 0.09).toFixed(2));
                this.purchaseBill.arnamt = parseFloat((this.purchaseBill.artamt - 
                    this.purchaseBill.arcgst - this.purchaseBill.arsgst).toFixed(2));
                break;
        }
    }
}