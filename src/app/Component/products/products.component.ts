import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

export interface Products {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string; // Added this field for image URL
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductComponent implements OnInit {
  showForm = false;
  isEditing = false;
  products: Products[] = [];
  currentProduct: Products | null = null;
  productName = '';
  productDescription = '';
  productPrice = 0;
  productCategory = '';
  productImageUrl = ''; // Added this field
  categories = ['Cupcakes', 'Desserts', 'Drinks'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http.get<Products[]>('http://localhost:5000/api/products').subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  addProduct(form: NgForm) {
    if (form.valid) {
      const newProduct: Products = {
        name: this.productName,
        description: this.productDescription,
        price: this.productPrice,
        category: this.productCategory,
        imageUrl: this.productImageUrl // Include this line
      };

      this.http.post<Products>('http://localhost:5000/api/products', newProduct).subscribe({
        next: (product) => {
          this.products.push(product);
          this.resetForm();
        },
        error: (err) => {
          console.error('Error adding product:', err);
        }
      });
    }
  }

  editProduct(product: Products) {
    this.showForm = true;
    this.isEditing = true;
    this.currentProduct = product;
    this.productName = product.name;
    this.productDescription = product.description;
    this.productPrice = product.price;
    this.productCategory = product.category;
    this.productImageUrl = product.imageUrl; // Include this line
  }

  updateProduct(form: NgForm) {
    if (form.valid && this.currentProduct && this.currentProduct._id) {
      const updatedProduct: Products = {
        name: this.productName,
        description: this.productDescription,
        price: this.productPrice,
        category: this.productCategory,
        imageUrl: this.productImageUrl // Include this line
      };

      this.http.put<Products>(`http://localhost:5000/api/products/${this.currentProduct._id}`, updatedProduct).subscribe({
        next: (product) => {
          const index = this.products.findIndex(p => p._id === this.currentProduct!._id);
          this.products[index] = product;
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

  resetForm() {
    this.productName = '';
    this.productDescription = '';
    this.productPrice = 0;
    this.productCategory = '';
    this.productImageUrl = ''; // Reset this field
    this.showForm = false;
    this.isEditing = false;
    this.currentProduct = null;
  }
}
