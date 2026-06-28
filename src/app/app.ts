import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
}) // Cast as any or just standard decorator
export class App {
  private readonly fb = inject(FormBuilder);

  // Cart Signal
  protected readonly cartCount = signal(0);
  
  // Custom non-blocking Toast System
  protected readonly toastMessage = signal<string | null>(null);
  
  // Product List
  protected readonly products: Product[] = [
    {
      id: 1,
      name: 'Dell Inspiron Laptop',
      price: 59999,
      image: 'images/laptop.jpg',
      alt: 'Laptop'
    },
    {
      id: 2,
      name: 'Noise Smartwatch',
      price: 4999,
      image: 'images/smartwatch.jpg',
      alt: 'Smartwatch'
    },
    {
      id: 3,
      name: 'JBL Headphones',
      price: 2999,
      image: 'images/headphones.jpg',
      alt: 'Headphones'
    }
  ];

  // Checkout Form Group
  protected readonly checkoutForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/.*\S.*/)]], // check that it is not only whitespace
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
    payment: ['', Validators.required]
  });

  // Add Item to Cart
  protected addToCart(product: Product): void {
    this.cartCount.update(count => count + 1);
    this.showToast(`"${product.name}" added to cart successfully!`);
  }

  // Toast helper
  private showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => {
      if (this.toastMessage() === message) {
        this.toastMessage.set(null);
      }
    }, 4000);
  }

  // Form Submit Action
  protected onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.showToast('Please fill in all fields correctly before placing order.');
      return;
    }

    // Success order placement
    this.showToast('Order placed successfully! Thank you for shopping with SmartShop.');
    this.checkoutForm.reset({
      name: '',
      email: '',
      address: '',
      payment: ''
    });
  }

  // Utility to format INR prices nicely
  protected formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }
}
