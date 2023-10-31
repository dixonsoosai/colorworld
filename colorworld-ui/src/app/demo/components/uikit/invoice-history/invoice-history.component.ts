import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { errorToastr, formatInvoiceData, getInvoiceHeader, getLastDay, saveAsExcelFile, successToastr } from 'src/app/demo/service/apputils.service';
import { InvoiceService } from 'src/app/demo/service/invoice.service';
import { Table } from 'primeng/table';
import { InvoiceSummary } from 'src/app/demo/domain/product';

@Component({
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.scss'],
  providers: [ConfirmationService, FilterService, MessageService]
})
export class InvoiceHistoryComponent {

    invoiceDetails : InvoiceSummary[];
    loading = false;
    filteredData;
    position = "top";
    visible = false;

    filterDate;

    @ViewChild('dt1') dt: Table;

    @ViewChild('filter') filter!: ElementRef;
    overflowLimit: number  = 17;

    constructor(private invoiceService: InvoiceService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private filterService: FilterService
        ) { }

    ngOnInit() {
        this.fetchAll();
        this.configureFilter();
    }

    fetchAll() {
        this.loading = true;
        this.invoiceService.fetchAll().subscribe({
            next: response => {
                response.data.forEach(item => {
                    if(item != null) {
                        item.tntime = item.tntime == null ? "" : new Date(item.tntime.substring(0,10));
                    }
                });
                this.invoiceDetails = response.data;
                this.loading = false;
            }, 
            error: error => {
                this.loading = false;
            },
            complete() {
                
            },
        });
    }
    
    filterInvoice() {
        let startDate = new Date(this.filterDate);
        let endDate = getLastDay(startDate);
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
    }

    exportExcel(dataTable: Table) {
        let filteredData = dataTable.filteredValue == null ? this.invoiceDetails : dataTable.filteredValue;
        saveAsExcelFile(formatInvoiceData(filteredData), getInvoiceHeader(), "Invoice History");
    }

    download(data: InvoiceSummary) {
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
            }
        });
    }
    
    delete(data: InvoiceSummary) {
        this.confirmationService.confirm({
            message: `Are you sure that you want to delete Invoice: ${data.tnbillno}?` ,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.invoiceService.delete(data.tnbillno).subscribe({
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
                    },
                    complete:() => {}

                });
            }
        });
    }
}
