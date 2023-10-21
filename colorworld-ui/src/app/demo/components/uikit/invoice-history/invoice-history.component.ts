import * as FileSaver from 'file-saver';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { errorToastr, formatInvoiceData, getInvoiceHeader, saveAsExcelFile, successToastr } from 'src/app/demo/service/apputils.service';
import { InvoiceService } from 'src/app/demo/service/invoice.service';
import { SSTNHDP } from 'src/app/demo/domain/sstnhdp';
import { Table } from 'primeng/table';

@Component({
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class InvoiceHistoryComponent {

    invoiceDetails : SSTNHDP[];
    loading = false;
    filteredData;
    position = "top";
    visible = false;

    constructor(private invoiceService: InvoiceService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
        ) { }

    ngOnInit() {
        this.fetchAll();
    }

    fetchAll() {
        this.loading = true;
        this.invoiceService.fetchAll().subscribe(response => {
            this.invoiceDetails = response.data;
            this.loading = false;
        }, 
        error => {

        })
    }
  
    clear(table: Table) {
        table.clear();
    }

    exportExcel(dataTable: Table) {
        let filteredData = dataTable.filteredValue == null ? this.invoiceDetails : dataTable.filteredValue;
        saveAsExcelFile(formatInvoiceData(filteredData), getInvoiceHeader(), "Invoice History");
    }

    download(data: SSTNHDP) {
        this.invoiceService.downloadByBill(data.tnbillno).subscribe({
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
    
    delete(data: SSTNHDP) {
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
