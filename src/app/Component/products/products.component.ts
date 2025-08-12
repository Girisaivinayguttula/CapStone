import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductsService } from '../../Services/products.service';
import { Products } from '../onlineshop/onlineshop.component';
import { takeUntil, Subject, pipe, take } from 'rxjs';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductComponent implements OnInit {
  private destroy$ = new Subject<void>();
  showForm = false;
  products: Products[] = [];
  currentProduct: Products | null = null;
  productForm: FormGroup;
  categories = ['Cupcakes', 'Desserts', 'Pastries'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private productsService: ProductsService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.fetchProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchProducts() {
    this.productsService.getAllProducts().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  toggleModal() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  addProduct() {
    if (this.productForm.valid) {
      const newProduct: Products = this.productForm.value;
      this.productsService.addProduct(newProduct).pipe(takeUntil(this.destroy$)).subscribe({
        next: (product) => {
          this.products.push(product);
          this.toggleModal();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error adding product:', err);
        }
      });
    }
  }

  editProduct(product: Products) {
    this.currentProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      quantity: product.quantity || 0
    });
  }

  saveProduct() {
    if (this.productForm.valid && this.currentProduct && this.currentProduct._id) {
      const updatedProduct: Products = this.productForm.value;
      this.productsService.saveProduct({ _id: this.currentProduct._id, ...updatedProduct }).subscribe({
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p._id === updatedProduct._id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
          this.currentProduct = null;
          this.resetForm();
        },
        error: (err) => {
          console.error('Error updating product:', err);
        }
      });
    }
  }

  deleteProduct(product: Products) {
    if (product._id) {
      const isConfirmed = window.confirm("Are you sure you want to delete this product?");
      if (isConfirmed) {
        this.http.delete(`http://localhost:5000/api/products/${product._id}`).subscribe({
          next: () => {
            this.products = this.products.filter(p => p._id !== product._id);
          },
          error: (err) => {
            console.error('Error deleting product:', err);
          }
        });
      }
    }
  }

  resetForm() {
    this.productForm.reset();
  }
}
