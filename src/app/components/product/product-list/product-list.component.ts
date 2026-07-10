import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-list'
  , standalone: true
  , imports: [
    CommonModule
    , RouterLink
    , FormsModule
  ]
  , templateUrl: './product-list.component.html'
  , styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  public searchTerm = signal('');

  public constructor(public productService: ProductService) {}

  public get filteredProducts(): Product[] {
    return this.productService.search(this.searchTerm());
  }

  public get totalValue(): number {
    return this.filteredProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }

  public onDelete(product: Product): void {
    const confirmed = confirm(`ต้องการลบสินค้า "${product.name}" ใช่หรือไม่?`);
    if (confirmed) {
      this.productService.delete(product.id);
    }
  }

  public onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }
}
