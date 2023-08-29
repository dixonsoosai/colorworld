import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { error } from 'console';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit{
  
  isLoading = false;

  constructor(private productService: ProductsService) {
  }
  ngOnInit() {
    console.log("Entered");
    this.fetchProduct("#FFFF00001");
  }

  fetchAllProducts() {
    this.isLoading = false;
    this.productService.fetchAllProducts().subscribe({  
      next: response => {
        if(response.code === 200) {
          console.log(response);
        }
      },  
      error: err => console.error('An error occurred :', err.errorMessage),  
      complete: () => this.isLoading = true
    });
  }

  fetchProduct(productCode : string) {
    this.isLoading = false;
    this.productService.fetchProductByCode(productCode).subscribe({  
      next: response => {
        if(response.code === 200) {
          console.log(response);
        }
      },  
      error: err => console.error('An error occurred :', err.errorMessage),  
      complete: () => this.isLoading = true
    });
  }

  addProduct() {
    this.isLoading = false;
    let product = "";
    this.productService.addProduct(product).subscribe({  
      next: response => {
        if(response.code === 200) {
          console.log(response);
        }
      },  
      error: err => console.error('An error occurred :', err.errorMessage),  
      complete: () => this.isLoading = true
    });
  } 

  deleteProduct(productCode : string) {
    this.isLoading = false;
    this.productService.deleteProductByCode(productCode).subscribe({  
      next: response => {
        if(response.code === 200) {
          console.log(response);
        }
      },  
      error: err => console.error('An error occurred :', err.errorMessage),  
      complete: () => this.isLoading = true 
    });
  }

}
