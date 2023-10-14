import * as FileSaver from 'file-saver';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { errorToastr, successToastr } from 'src/app/demo/service/apputils.service';
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

    exportFilteredData(dataTable: Table): void {
        this.filteredData = dataTable.filteredValue;
    }

    exportExcel(dataTable: Table) {
        let filteredData = [];
        if(dataTable.filteredValue == null) {
            filteredData = this.invoiceDetails;
        }
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(filteredData);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['Purchase History'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'Purchase History');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
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
