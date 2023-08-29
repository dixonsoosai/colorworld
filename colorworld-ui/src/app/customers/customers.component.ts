import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Product } from 'src/domain/product';
import { ProductService } from 'src/service/productservice';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [MessageService]
})
export class CustomersComponent implements OnInit {
  products!: Product[];

  constructor(private messageService: MessageService,
    private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().then((data) => (this.products = data.slice(0, 5)));
    console.log("Entered");
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }

  getSeverity (product: Product) {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};
}
