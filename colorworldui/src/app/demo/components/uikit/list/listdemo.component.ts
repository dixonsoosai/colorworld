import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Customer } from '../../domain/customer';
import { Products } from '../../domain/products';
import { InvoiceItem } from '../../domain/product';
import { ProductsService } from './product.service';
import { CustomersService } from '../customer/customer.service';

@Component({
  selector: 'app-tax-invoice',
  templateUrl: './listdemo.component.html',
  styleUrls: ['./taxinvoice.component.scss'],
  providers: [MessageService]
})

export class TaxInvoiceComponent {
  isLoading: boolean;
  searchText !: string;
  productList: Array<Products>;
  selectedProducts = [];
  isInvoiceScreen: boolean = false;
  product: InvoiceItem = new InvoiceItem();
  clonedProducts: { [s: string]: any } = {};
  selectedDate: Date = new Date();
  customer: Customer = new Customer();
  customers: Array<Customer> = [];
  listView: boolean = false;
  gstdetails:any = [{type: '', gstp: 0.0, total: 0.0}];

  constructor(private productService: ProductsService, private messageService: MessageService, private customerService: CustomersService) {}

  ngOnInit(): void {
    this.fetchAllProducts();
  }  
  
  fetchAllProducts() {
    this.isLoading = false;
    this.productService.fetchAllProducts().subscribe({  
      next: response => {
        if(response.code === 200) {
          console.log(response);
          this.productList = response.data;
        }
      },  
      error: err => console.error('An error occurred :', err.errorMessage),  
      complete: () => this.isLoading = true
    });
  }

  addToInvoice(product: Products) {
    console.log(product);
    let temp = new InvoiceItem();
    temp.pnpdcd = product.pnpdcd;
    temp.pnscnm = product.pnscnm;
    temp.pnhsnc = product.pnhsnc;
    temp.pnuqty = 1;
    temp.pnunit = product.pnunit;
    temp.pncgst = product.pncgst;
    temp.pncgstam = ((product.pncgst * product.pnmrp)/100.0);
    temp.pnsgst = product.pnsgst;
    temp.pnsgstam = ((product.pnsgst * product.pnmrp)/100.0);
    temp.pnmrp = product.pnmrp;
    temp.pnfmrp = product.pnmrp + temp.pnsgstam + temp.pncgstam;
    this.selectedProducts.push(temp);
    this.isProductSelected(temp);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added in cart.' });
    this.gstCalculation();
  }

  goToInvoice() {
    console.log(this.selectedProducts);
    this.isInvoiceScreen = true;
  }
  
  back() {
    console.log(this.selectedProducts);
    this.isInvoiceScreen = false;
  }

  addNewProduct() {
    console.log(this.product);
    let temp = new InvoiceItem();
    temp.pnscnm = this.product.pnscnm;
    temp.pnhsnc = this.product.pnhsnc;
    temp.pnuqty = this.product.pnuqty;
    temp.pnunit = this.product.pnunit;
    temp.pncgst = this.product.pncgst;
    temp.pncgstam = ((this.product.pncgst * this.product.pnmrp)/100.0);
    temp.pnsgst = this.product.pnsgst;
    temp.pnsgstam = ((this.product.pnsgst * this.product.pnmrp)/100.0);
    temp.pnmrp = this.product.pnmrp;
    temp.pnfmrp = this.product.pnmrp + temp.pnsgstam + temp.pncgstam;
    this.selectedProducts.push(temp);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added successfully.' });
    this.gstCalculation();
  }

  clear() {
    this.product = new InvoiceItem();
  }

  isProductSelected(product: any) {
      return this.selectedProducts.some(p =>  p.pnpdcd === product.pnpdcd)
  }

  onRowEditInit(product: InvoiceItem, index: number) {
      console.log(product);
      console.log(index);
      this.clonedProducts[index] = { ...this.selectedProducts[index] };
  }

  onRowEditSave(product: InvoiceItem, index: number) {
      if (product.pnmrp > 0) {
          delete this.clonedProducts[index];
          this.gstCalculation();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
      } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
      }
  }

  onRowEditCancel(product: any, index: number) {
      this.selectedProducts[index] = this.clonedProducts[product.id as string];
      delete this.clonedProducts[product.pnhsnc];
      console.log(this.selectedProducts);
  }

  fetchCustomers(name: string) {
    this.customerService.fetchByName(name).subscribe({  
      next: response => {
        if(response.code === 200) {
          console.log(response);
          this.customers = response.data;
          if (this.customers.length > 0) {
            this.listView = true;
          } else {
            this.listView = false;
            // this.messageService.add({severity: 'info', detail: 'Customer not found!'})
          }
        }
      },  
      error: err => console.error('An error occurred :', err.errorMessage),
    });
  }

  selectCust(customer: Customer) {
    console.log(this.customer);
    this.listView = false;
  }

  gstCalculation() {
    this.gstdetails = [];
    const gsts = [...new Set(this.selectedProducts.map(item => item.pncgst))];
    gsts.forEach(g => {
      let gst = 0.0;
      this.selectedProducts.map((item) => {
        if (item.pncgst === g) {
          gst = gst + item.pncgstam;
        }
      })
      this.gstdetails.push({type: g, gstp: gst, total: gst * 2});
    }) 
    console.log(this.gstdetails);
  }
}
