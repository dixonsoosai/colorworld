import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ConfirmationService, FilterService, MenuItem, MessageService } from 'primeng/api';
import { errorToastr, formatInvoiceData, getInvoiceHeader, getLastDay, invoiceHistory, saveAsExcelFile, successToastr } from 'src/app/demo/service/apputils.service';
import { InvoiceService } from 'src/app/demo/service/invoice.service';
import { Table } from 'primeng/table';
import { BillSummary, InvoiceSummary } from 'src/app/demo/domain/product';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss'],
  providers:[MessageService, ConfirmationService]
})
export class InvoiceTableComponent {

  @ViewChild('dt1') dt: Table;
  @ViewChild('filter') filter!: ElementRef;
  
  invoiceDetails : InvoiceSummary[];
  loading = false;
  visible = false;
  
  filteredData;
  filterDate;
  filterMonths = [];
  position = "top";
  reportFormat = "S";
  overflowLimit: number  = 17;
  billSummary = new BillSummary();
  
  constructor(private invoiceService: InvoiceService,
      private spinner: NgxSpinnerService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService,
      private filterService: FilterService
      ) { }

  ngOnInit() {
    this.fetchAll();
    this.configureFilter();
  }

  toggleFormat() {
    this.dt.clear();
  }
  fetchAll() {
      this.spinner.show();
      this.invoiceService.fetchAll().subscribe({
        next: response => {
            response.data.forEach(item => {
                if(item.tntime != null) {
                    item.tntime = new Date(item.tntime);
                }
                item.gntamt = parseFloat(item.gntamt.toFixed(0));
                item.invalid = false;
                if(item.tnbilltype == "P") {
                    let expiry = new Date(item.tntime);
                    expiry.setDate(expiry.getDate() + 7);
                    if(expiry <= new Date()) {
                        item.invalid = true;
                    }
                }
            });
            response.data.sort((a, b) => {
                // 1. billtype DESC
                if (a.tnbilltype < b.tnbilltype) return 1;
                if (a.tnbilltype > b.tnbilltype) return -1;

                // 2. date part of tntime DESC
                const aDate = new Date(a.tntime.getFullYear(), a.tntime.getMonth(), a.tntime.getDate());
                const bDate = new Date(b.tntime.getFullYear(), b.tntime.getMonth(), b.tntime.getDate());

                if (aDate < bDate) return 1;
                if (aDate > bDate) return -1;

                // 3. billno DESC (assuming numeric, if string use localeCompare)
                if (a.tnbillno < b.tnbillno) return 1;
                if (a.tnbillno > b.tnbillno) return -1;

                return 0;
            });
            this.invoiceDetails = response.data;
            this.loading = false;
          }, 
          error: error => {
            this.loading = false;
            this.spinner.hide();
          },
          complete:() => this.spinner.hide()
      });
  }
  
  filterInvoice() {
    if(this.filterMonths.length < 2 && this.reportFormat == 'M') {
        return;
    }
    if(this.filterMonths.length > 2) {
        this.filterMonths = [];
        return;
    }
    let startDate = this.reportFormat == "S" ? new Date(this.filterDate) : new Date(this.filterMonths[0]);
    let endDate = this.reportFormat == "S" ? getLastDay(startDate) : getLastDay(this.filterMonths[1]);
    const dateRange = [startDate, endDate];
    this.dt.filter(dateRange, 'tntime', 'dateContains');
  }

  configureFilter() {
    this.filterService.register("dateContains", (value, filter): boolean => {
        let startDate = filter[0];
        let endDate = filter[1];
        return value>= startDate && value <= endDate;
    });
  }

  clear(table: Table) {
    table.clear();
    this.filterDate = "";
    document.getElementById("searchText")["value"] = "";
    window.location.reload();
  }

  exportExcel(dataTable: Table) {
    this.spinner.show();
    let filteredData = dataTable.filteredValue == null ? Object.create(this.invoiceDetails) : Object.create(dataTable.filteredValue)
    filteredData.sort((f1, f2) => {
        // First sort by tnbilltype descending
        if (f1.tnbilltype > f2.tnbilltype) return -1;
        if (f1.tnbilltype < f2.tnbilltype) return 1;

        // Then sort by tnbillno ascending
        if (f1.tnbillno < f2.tnbillno) return -1;
        if (f1.tnbillno > f2.tnbillno) return 1;

        return 0;
    });
    saveAsExcelFile(formatInvoiceData(filteredData), getInvoiceHeader(), "Invoice History");
    this.spinner.hide();
  }

    download(data: InvoiceSummary) {
      this.spinner.show();
      this.invoiceService.downloadByBill(data.tnbillno, this.overflowLimit).subscribe({
        next:response => {
            let htmlContent = response;
            const newWindow = window.open('Tax Invoice', '_blank');
            newWindow.document.write(htmlContent);
            newWindow.document.close();
        },
        error : error => {
            this.messageService.add(errorToastr("Error generating Invoice"));
            console.error(error);
            this.spinner.hide();
        },
        complete:() => this.spinner.hide()
      });
  }
  
  delete(data: InvoiceSummary) {
    this.confirmationService.confirm({
        message: `Are you sure that you want to delete Invoice: ${data.tnbillno}?` ,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.spinner.show();
            this.invoiceService.delete(data.tnbillno, data.tnbilltype).subscribe({
                next: response => {
                    if(response.code == 200) {
                        this.messageService.add(successToastr("Invoice deleted successfully"));
                        window.location.reload();
                    }
                    else {
                        this.messageService.add(errorToastr("Error deleting Invoice"));
                        console.error(response);
                    }
                },
                error: error => {
                    this.messageService.add(errorToastr("Error deleting Invoice"));
                    console.error(error);
                    this.spinner.hide();
                },
                complete:() => this.spinner.hide()

            });
        }
      });
    }

    clearBillSummary() {
        this.billSummary.bsfamt = 0;
        this.billSummary.bsnamt = 0;
        this.billSummary.bsroff = 0;
        this.billSummary.bstamt = 0;
        this.billSummary.bstcgst = 0;
        this.billSummary.bstsgst = 0;
    }

    reCalculate(event) {
        this.clearBillSummary();
        event.filteredValue.forEach(e => {
            if(e.gngstp == "Total") {
                this.billSummary.bsnamt += e.gntxable;
                this.billSummary.bstcgst += e.gncamt;
                this.billSummary.bstsgst += e.gnsamt;
                this.billSummary.bsfamt += e.gntamt;
            }
        });
    }
}
