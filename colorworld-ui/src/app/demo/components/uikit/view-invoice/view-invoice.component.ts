import { ActivatedRoute } from '@angular/router';
import {
    BillSummary,
    GSTSummary,
    InvoiceItem,
    ProductItem,
} from 'src/app/demo/domain/product';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Customer } from 'src/app/demo/domain/customer';
import {
    errorToastr,
    getISTDate,
    productUnits,
} from 'src/app/demo/service/apputils.service';
import { InvoiceService } from 'src/app/demo/service/invoice.service';
import { SSTNHDP } from 'src/app/demo/domain/sstnhdp';
import { SSGNJNP } from 'src/app/demo/domain/ssgnjnp';

@Component({
    selector: 'app-view-invoice',
    templateUrl: './view-invoice.component.html',
    styleUrls: ['./view-invoice.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class ViewInvoiceComponent {
  isLoading = false;

  customerDetails: Customer = new Customer();
  selectedProducts: InvoiceItem[] = [];
  newProduct: ProductItem = new ProductItem();

  billSummary = new BillSummary();
  gstSummary = new Map<string, SSGNJNP>();

  searchText!: string;
  units = productUnits;
  filteredUnits: any = {};

  visible: boolean = false;
  invoice: string;

  header: SSTNHDP = new SSTNHDP();

  invoiceNumber: number = 0;
  invoiceDate: Date;
  overflowLimit: number = 17;

  constructor(
      private messageService: MessageService,
      private route: ActivatedRoute,
      private invoiceService: InvoiceService
  ) {}

  ngOnInit() {
      this.invoice = this.route.snapshot.paramMap.get('bill');
      this.fetchInvoice();
  }

  fetchInvoice() {
      this.invoiceService.fetchBillDetails(this.invoice).subscribe({
          next: (response) => {
              this.header = response['data'].header;
              this.invoiceNumber = this.header.tnbillno;
              this.customerDetails.jpname = this.header.tnname;
              this.customerDetails.jppgst = this.header.tnpgst;
              this.invoiceDate = new Date(this.header.tntime.substring(0,10));

              this.gstSummary = response['data'].gst;
              this.selectedProducts = response['data'].details;
              this.computeBillSummary();
          },
      });
  }

  computeBillSummary() {
      this.billSummary = new BillSummary();
      this.selectedProducts.forEach((element) => {
          this.billSummary.bsnamt += element.tntxable;
          this.billSummary.bstcgst += element.tncamt;
          this.billSummary.bstsgst += element.tnsamt;
          this.billSummary.bstamt += element.tntamt;
          this.billSummary.bsfamt = Math.round(this.billSummary.bstamt);
          this.billSummary.bsroff =
              this.billSummary.bsfamt - this.billSummary.bstamt;
      });
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
        gst.gnbill = this.invoiceNumber;
        gst.gntxable += parseFloat((element.tntxable).toFixed(2));
        gst.gncamt += parseFloat((element.tncamt).toFixed(2));
        gst.gnsamt += parseFloat((element.tnsamt).toFixed(2));
        gst.gntamt += parseFloat((element.tntamt).toFixed(2));
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

  download() {
      let billData = {
          header: this.header,
          details: this.selectedProducts,
          gst: [...this.gstSummary.values()],
      };
      billData.header.tntime = getISTDate(new Date(this.header.tntime));
      this.invoiceService.generate(billData, this.overflowLimit).subscribe({
          next: (response) => {
              let htmlContent = response;
              const newWindow = window.open('', '_blank');
              newWindow.document.write(htmlContent);
              newWindow.document.close();
          },
          error: (error) => {
              this.messageService.add(
                  errorToastr('Error generating Invoice')
              );
              console.error(error);
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

  copy(product: InvoiceItem) {
    this.selectedProducts.push(product);
  }

  delete(rowIndex: number) {
      this.selectedProducts.splice(rowIndex,1);
  }
}
