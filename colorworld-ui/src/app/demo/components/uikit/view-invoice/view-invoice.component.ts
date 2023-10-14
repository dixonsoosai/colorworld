import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Customer } from 'src/app/demo/domain/customer';
import { BillSummary, GSTSummary, InvoiceItem, ProductItem } from 'src/app/demo/domain/product';
import { errorToastr, productUnits } from 'src/app/demo/service/apputils.service';
import { CustomersService } from 'src/app/demo/service/customers.service';
import { InvoiceService } from 'src/app/demo/service/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { SSTNHDP } from 'src/app/demo/domain/sstnhdp';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ViewInvoiceComponent {

  isLoading = false;
  
  customerDetails: Customer = new Customer();
  selectedProducts: InvoiceItem[] = [];
  newProduct: ProductItem = new ProductItem();

  billSummary = new BillSummary();
  gstSummary = new Map<string, GSTSummary>();

  searchText !: string;
  units = productUnits;
  filteredUnits:any  = {};

  visible: boolean = false;
  invoice: string;

  header:SSTNHDP = new SSTNHDP();

  invoiceNumber: number = 0;
  invoiceDate: Date;
  constructor(
      private messageService: MessageService,
      private confirmationService: ConfirmationService, 
      private route: ActivatedRoute,
      private customerService: CustomersService,
      private invoiceService: InvoiceService
      ) { }

  ngOnInit() {
    this.invoice = this.route.snapshot.paramMap.get("bill");
    this.fetchInvoice();
  }

  fetchInvoice() {
    this.invoiceService.fetchBillDetails(this.invoice).subscribe({
      next: response => {
        console.log(response);
        
        this.header = response["data"].header;
        this.invoiceNumber = this.header.tnbillno;
        this.customerDetails.jpname = this.header.tnname;
        this.customerDetails.jppgst = this.header.tnpgst;
        this.invoiceDate = new Date(this.header.tntime);

        this.gstSummary = response["data"].gst;
        this.selectedProducts = response["data"].details;
        this.computeBillSummary();
      }
    });
  }

  computeBillSummary() {
    this.billSummary = new BillSummary();
    this.selectedProducts.forEach(element => {
        this.billSummary.bsnamt += element.tntxable;
        this.billSummary.bstcgst += element.tncamt;
        this.billSummary.bstsgst += element.tnsamt;
        this.billSummary.bstamt += element.tntamt;
        this.billSummary.bsfamt = Math.round(this.billSummary.bstamt);
        this.billSummary.bsroff = this.billSummary.bsfamt - this.billSummary.bstamt;
    });
  }

  download() {
    let billData = {
      header: this.header,
      details: this.selectedProducts,
      gst: [...this.gstSummary.values()]
    };

    this.invoiceService.download(billData).subscribe({
        next:response => {
            let htmlContent = response;
            const newWindow = window.open('', '_blank');
            newWindow.document.write(htmlContent);
            newWindow.document.close();
        },
        error : error => {
            this.messageService.add(errorToastr("Error generating Invoice"));
            console.error(error);
        }
    });
}
}
