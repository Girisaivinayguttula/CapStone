import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductsService } from '../../Services/products.service';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  quantity?: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductComponent implements OnInit {
  showForm = false;
  products: Product[] = [];
  currentProduct: Product | null = null;
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

  fetchProducts() {
    this.http.get<Product[]>('http://localhost:5000/api/products').subscribe({
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
      const newProduct: Product = this.productForm.value;
      this.http.post<Product>('http://localhost:5000/api/products', newProduct).subscribe({
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

  editProduct(product: Product) {
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
      const updatedProduct: Product = this.productForm.value;
      this.http.put<Product>(`http://localhost:5000/api/products/${this.currentProduct._id}`, updatedProduct).subscribe({
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

  deleteProduct(product: Product) {
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
