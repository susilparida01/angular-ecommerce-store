# SmartShop - Angular E-Commerce Store

Welcome to the **SmartShop** project! This project has been fully converted from a traditional HTML, CSS, and JavaScript website into a modern, single-page **Angular 20** web application. 

This guide provides a detailed, step-by-step walkthrough of how to build and develop this application from scratch.

---

## ⚡ Key Features Implemented

1. **Modern Standalone Architecture**: Built using Angular's latest standalone component APIs without `NgModules`.
2. **Signals-Driven State**: The shopping cart counter and UI notification states use Angular `signal()` for highly reactive, lightweight performance.
3. **Reactive Form Validation**: Checkout details (Full Name, Email, Address, and Payment Method) are validated reactively in real time.
4. **Premium Design System**: Includes CSS variable-based styling, glassmorphism, responsive grid layout, card-hover transitions, and interactive visual feedback.
5. **Non-blocking Custom Toast Notifications**: Replaced standard blocking browser alerts with sleek, self-dismissing toast notifications.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:
* **Node.js** (v18.x or higher)
* **npm** (v9.x or higher)
* **Angular CLI** (v17.x or higher) installed globally:
  ```bash
  npm install -g @angular/cli
  ```

---

## 🛠️ Step-by-Step Development Guide

### Step 1: Initialize the Project
Create a new Angular workspace and standalone application:
```bash
ng new angular-ecommerce-store --style=css --routing=false --ssr=false --standalone=true
```
* `--style=css`: Configures standard vanilla CSS styling.
* `--routing=false`: Simple single-page layout without multi-page router setup.
* `--ssr=false`: Client-side rendering only.

Navigate to the project root:
```bash
cd angular-ecommerce-store
```

---

### Step 2: Manage Static Assets (Images)
In Angular, static assets like images, icons, and logos are served from the root `public` directory.
1. Create an `images` folder under the `public` directory.
2. Put the following product and logo images inside `public/images/`:
   - `logo.jpg`
   - `laptop.jpg`
   - `smartwatch.jpg`
   - `headphones.jpg`

These assets will be accessible via the relative route path `/images/filename.jpg`.

---

### Step 3: Implement Web Fonts
Open `src/index.html` and update the title and load the premium **Outfit** typeface from Google Fonts:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SmartShop - Online Store</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <!-- Google Fonts Connection -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

---

### Step 4: Configure the Global Design System (`src/styles.css`)
Open `src/styles.css` and paste the following styles to configure the core typography, custom color palette variables, animations, and baseline resets:

```css
/* Global Design System & Variables */
:root {
  --primary: #1a73e8;
  --primary-hover: #1557b0;
  --primary-light: #e8f0fe;
  --success: #34a853;
  --success-hover: #2b8c45;
  --text-dark: #1f2937;
  --text-light: #4b5563;
  --bg-main: #f8fafc;
  --bg-card: #ffffff;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --border-radius-sm: 6px;
  --border-radius-md: 12px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Outfit', -apple-system, sans-serif;
  background-color: var(--bg-main);
  color: var(--text-dark);
  line-height: 1.5;
  scroll-behavior: smooth;
}

/* Custom Premium Scrollbar */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: var(--bg-main);
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn var(--transition-normal) forwards;
}
```

---

### Step 5: Build Component Logic (`src/app/app.ts`)
Implement the product data models, cart and toast signals, and the reactive checkout validation form in `src/app/app.ts`:

```typescript
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
})
export class App {
  private readonly fb = inject(FormBuilder);

  // Cart Signal
  protected readonly cartCount = signal(0);
  
  // Custom non-blocking Toast System
  protected readonly toastMessage = signal<string | null>(null);
  
  // Product List
  protected readonly products: Product[] = [
    { id: 1, name: 'Dell Inspiron Laptop', price: 59999, image: 'images/laptop.jpg', alt: 'Laptop' },
    { id: 2, name: 'Noise Smartwatch', price: 4999, image: 'images/smartwatch.jpg', alt: 'Smartwatch' },
    { id: 3, name: 'JBL Headphones', price: 2999, image: 'images/headphones.jpg', alt: 'Headphones' }
  ];

  // Checkout Form Group
  protected readonly checkoutForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
    payment: ['', Validators.required]
  });

  // Add Item to Cart
  protected addToCart(product: Product): void {
    this.cartCount.update(count => count + 1);
    this.showToast(`"${product.name}" added to cart successfully!`);
  }

  // Toast Helper
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

    this.showToast('Order placed successfully! Thank you for shopping with SmartShop.');
    this.checkoutForm.reset({ name: '', email: '', address: '', payment: '' });
  }

  // Currency Formatter Utility
  protected formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }
}
```

---

### Step 6: Create the Template (`src/app/app.html`)
Use modern Angular 17+ Control Flow directives (`@for` and `@if`) for optimal, tag-less templating:

```html
<!-- Header -->
<header id="home">
  <div class="logo">
    <img src="images/logo.jpg" alt="SmartShop Logo">
    <h1>SmartShop</h1>
  </div>
  <nav>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#products">Products</a></li>
      <li><a href="#cart">Cart<span class="cart-badge">{{ cartCount() }}</span></a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
</header>

<!-- Hero Section -->
<section class="hero-section">
  <h2>Smart Tech. Simplified Shopping.</h2>
  <p>Discover the latest and greatest devices at unbeatable prices. Fast shipping and premium support guaranteed.</p>
</section>

<!-- Product List -->
<section id="products">
  <h2 class="section-title">Featured Products</h2>
  <div class="product-container">
    @for (product of products; track product.id) {
      <div class="product-card">
        <div class="image-wrapper">
          <img [src]="product.image" [alt]="product.alt">
        </div>
        <h3>{{ product.name }}</h3>
        <p class="price">{{ formatPrice(product.price) }}</p>
        <button (click)="addToCart(product)">Add to Cart</button>
      </div>
    }
  </div>
</section>

<!-- Checkout Form -->
<section id="cart" class="checkout-section">
  <h2>Checkout Details</h2>
  <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="checkout-form">
    
    <div class="form-group">
      <label for="name">Full Name</label>
      <input type="text" id="name" formControlName="name" placeholder="Enter your name">
      @if (checkoutForm.get('name')?.invalid && checkoutForm.get('name')?.touched) {
        <span class="error-message">Please enter your full name.</span>
      }
    </div>

    <div class="form-group">
      <label for="email">Email Address</label>
      <input type="email" id="email" formControlName="email" placeholder="Enter your email">
      @if (checkoutForm.get('email')?.invalid && checkoutForm.get('email')?.touched) {
        <span class="error-message">Please enter a valid email address.</span>
      }
    </div>

    <div class="form-group">
      <label for="address">Shipping Address</label>
      <textarea id="address" formControlName="address" rows="3" placeholder="Enter address"></textarea>
      @if (checkoutForm.get('address')?.invalid && checkoutForm.get('address')?.touched) {
        <span class="error-message">Please enter shipping address.</span>
      }
    </div>

    <div class="form-group">
      <label for="payment">Payment Method</label>
      <select id="payment" formControlName="payment">
        <option value="" disabled selected>--select payment method--</option>
        <option value="credit-card">Credit Card</option>
        <option value="debit-card">Debit Card</option>
        <option value="upi">UPI</option>
        <option value="cod">Cash on Delivery</option>
      </select>
      @if (checkoutForm.get('payment')?.invalid && checkoutForm.get('payment')?.touched) {
        <span class="error-message">Please select a payment method.</span>
      }
    </div>

    <button type="submit" [disabled]="checkoutForm.invalid && checkoutForm.touched">Place Order</button>
  </form>
</section>

<!-- Footer -->
<footer id="contact">
  <p class="contact-info">Email: support@smartshop.com | Contact: +91 1234567890</p>
  <div class="social-media">
    <a href="#" target="_blank">Facebook</a>
    <a href="#" target="_blank">Twitter</a>
    <a href="#" target="_blank">Instagram</a>
  </div>
  <p class="copyright">&copy; 2026 SmartShop. All rights reserved.</p>
</footer>

<!-- Toast Notifications -->
@if (toastMessage(); as message) {
  <div class="toast animate-fade-in">
    <span>{{ message }}</span>
  </div>
}
```

---

### Step 7: Define Styles (`src/app/app.css`)
Open `src/app/app.css` and add visual properties for grid positioning, transitions, glowing state active shadows, validation visual classes (`ng-invalid.ng-touched`), and toaster overlays:

```css
/* Layout and Components styling */
header {
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-md);
}

header .logo img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  object-fit: cover;
}

header nav ul {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

header nav ul li a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
}

header nav ul li a:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.15);
}

.cart-badge {
  background-color: #ff4757;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  margin-left: 0.5rem;
  display: inline-block;
  box-shadow: 0 2px 5px rgba(255, 71, 87, 0.4);
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem 2rem 2rem;
}

.hero-section h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-dark);
}

.hero-section p {
  color: var(--text-light);
  max-width: 600px;
  margin: 0.5rem auto 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.product-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto 4rem auto;
  padding: 0 1.5rem;
}

.product-card {
  background-color: var(--bg-card);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all var(--transition-normal);
  border: 1px solid var(--border-color);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.image-wrapper {
  width: 100%;
  height: 200px;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  margin-bottom: 1.25rem;
}

.product-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.product-card:hover img {
  transform: scale(1.08);
}

.product-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.product-card .price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 1.25rem;
}

.product-card button {
  width: 100%;
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.product-card button:hover {
  background-color: var(--primary-hover);
}

.checkout-section {
  background-color: var(--bg-card);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  padding: 2.5rem;
  margin: 0 auto 5rem auto;
  max-width: 600px;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background-color: #f8fafc;
  outline: none;
  transition: all var(--transition-fast);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--primary);
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.15);
}

.form-group input.ng-invalid.ng-touched,
.form-group select.ng-invalid.ng-touched,
.form-group textarea.ng-invalid.ng-touched {
  border-color: #ea4335;
  background-color: #fdf2f2;
}

.error-message {
  color: #ea4335;
  font-size: 0.8rem;
  font-weight: 500;
}

.checkout-section button[type="submit"] {
  background-color: var(--success);
  color: white;
  border: none;
  padding: 0.85rem 1.5rem;
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-top: 1rem;
}

.checkout-section button[type="submit"]:hover:not(:disabled) {
  background-color: var(--success-hover);
}

.checkout-section button[type="submit"]:disabled {
  background-color: #cbd5e1;
  color: #64748b;
  cursor: not-allowed;
}

footer {
  background: #0f172a;
  color: #94a3b8;
  padding: 3rem 1.5rem;
  text-align: center;
}

footer .social-media {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 1rem 0;
}

footer .social-media a {
  color: #38bdf8;
  text-decoration: none;
  font-weight: 600;
}

.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #1e293b;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-xl);
  z-index: 1000;
  border-left: 4px solid var(--success);
}
```

---

## 🚀 Running the Local Development Server

To view the conversion and launch the application:
1. Start the Angular dev server:
   ```bash
   npm run start
   ```
   *(Or run `npx ng serve`)*
2. Open your web browser and navigate to:
   ```
   http://localhost:4200/
   ```
3. The page will auto-reload whenever files are updated.
