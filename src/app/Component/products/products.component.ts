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
  imageUrl: string;
  quantity?: number;
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
  productImageUrl = '';
  productQuantity = 0;  // New property for quantity
  categories = ['Cupcakes', 'Desserts', 'Pastries'];

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

  toggleModal() {
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
        imageUrl: this.productImageUrl,
        quantity: this.productQuantity // Set quantity,
      };

      this.http.post<Products>('http://localhost:5000/api/products', newProduct).subscribe({
        next: (product) => {
          this.products.push(product);
          this.toggleModal(); // Close the modal after adding
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
    this.productName = product.name;
    this.productDescription = product.description;
    this.productPrice = product.price;
    this.productCategory = product.category;
    this.productImageUrl = product.imageUrl;
    this.productQuantity = product.quantity || 0; // Set quantity
  }

  saveProduct(product: Products) {
    if (this.currentProduct && this.currentProduct._id) {
      const updatedProduct: Products = {
        name: this.productName,
        description: this.productDescription,
        price: this.productPrice,
        category: this.productCategory,
        imageUrl: this.productImageUrl,
        quantity: this.productQuantity // Set quantity
      };

      this.http.put<Products>(`http://localhost:5000/api/products/${this.currentProduct._id}`, updatedProduct).subscribe({
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
    this.productName = '';
    this.productDescription = '';
    this.productPrice = 0;
    this.productCategory = '';
    this.productImageUrl = '';
    this.productQuantity = 0;  // Reset quantity
  }
}
