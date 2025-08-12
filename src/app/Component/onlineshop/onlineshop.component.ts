import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../Services/products.service';
import { PopupModalService } from '../../Services/popup-modal.service';
import { Subject, takeUntil } from 'rxjs';

export interface Products {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  rating?: number;
  quantity: number;
}

@Component({
  selector: 'app-onlineshop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onlineshop.component.html',
  styleUrls: ['./onlineshop.component.css']
})
export class OnlineshopComponent implements OnInit {

  private destory$ = new Subject<void>();
  products: Products[] = [];
  filteredProducts: Products[] = [];
  categories: string[] = [];
  cartProducts: Set<string> = new Set();
  loading = false

  constructor(private router: Router, private productsService: ProductsService, private popupModalService: PopupModalService) { }

  ngOnInit() {
    this.fetchProducts();
  }

  ngOnDestroy() {
    this.destory$.next();
    this.destory$.complete();
  }

  fetchProducts() {
    this.loading = true
    this.productsService.getAllProducts().pipe(takeUntil(this.destory$)).subscribe({
      next: (data: Products[]) => {
        this.loading = false;
        this.products = data.map(product => ({
          ...product,
          imageUrl: product.imageUrl,
          quantity: product.quantity || 0
        }));
        this.filteredProducts = this.products;

        this.categories = Array.from(new Set(this.products.map(p => p.category)));
      },
      error: () => {
        this.loading = false;
        this.popupModalService.show('Error fetching products');
      }
    });
  }

  filterByCategory(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCategory = selectElement?.value || '';

    this.filteredProducts = selectedCategory ?
      this.products.filter(product => product.category === selectedCategory) :
      this.products;
  }

  addToCart(product: Products) {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    cart.push(product);
    sessionStorage.setItem('cart', JSON.stringify(cart));
    this.cartProducts.add(product._id || '');
  }

  isProductInCart(product: Products): boolean {
    return this.cartProducts.has(product._id || '');
  }

  private isLoggedIn(): boolean {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  }
}
