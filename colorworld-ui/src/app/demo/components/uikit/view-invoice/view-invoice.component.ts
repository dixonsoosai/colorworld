import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Customer } from 'src/app/demo/domain/customer';
import { BillSummary, GSTSummary, InvoiceItem, ProductItem } from 'src/app/demo/domain/product';
import { errorToastr, getCurrentDate, productUnits, successToastr } from 'src/app/demo/service/apputils.service';
import { CustomersService } from 'src/app/demo/service/customers.service';
import { InvoiceService } from 'src/app/demo/service/invoice.service';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';

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
  
  constructor(
      private messageService: MessageService,
      private confirmationService: ConfirmationService, 
      private route: ActivatedRoute,
      private customerService: CustomersService,
      private invoiceService: InvoiceService
      ) { }

  ngOnInit() {
    this.invoice = this.route.snapshot.queryParams["bill"];
    this.fetchInvoice();
  }

  fetchInvoice() {
  }

  
}
