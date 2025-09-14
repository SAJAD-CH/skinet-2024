import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/Models/cart';
import { Product } from '../../shared/Models/product';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  baseUrl = environment.apiUrl;

  cart = signal<Cart | null>(null)

  itemCount = computed(() => {
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0)
  })
  //cartil ende update aayalum appo thanne itemcountile computed work aakum and namma kodtha logic pole quantity ennam eduth verum

  totals = computed(() => {
    const cart = this.cart()
    if (!cart) return null
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = 0
    const discount = 0
    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount
    }
  })
  constructor(private http: HttpClient) { }


  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe(
      map(cart => {
        this.cart.set(cart);
        return cart;
      })//pipe  use aakunnad raw aay verunna datane map aakan 
    )
    //Flow from front to back
    // User visits site.
    // Angular checks localStorage for a cart_id.
    // If found → calls getCart(cart_id).
    // If not found → a new cart id will eventually be created.
    // API returns either an existing cart or a new one.
    // Angular stores it in state (this.cart.set(cart)).
    // UI (like cart badge, cart page) automatically updates because it’s bound to that state.

  }

  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + 'cart', cart)
      .subscribe((res) => {
        this.cart.set(res)
      })
  }

  removeItemFromCart(productId: number, quantity = 1) {
    const cart = this.cart();
    if (!cart) return;
    const index = cart.items.findIndex(x => x.productId === productId)
    if (index !== -1) { //product undenkil
      if (cart.items[index].quantity > quantity) {
        cart.items[index].quantity -= quantity;
      } else {
        cart.items.splice(index, 1)
      }
      if (cart.items.length === 0) {
        this.deleteCart()
      } else {
        this.setCart(cart)
      }
    }

  }
  deleteCart() {
    this.http.delete(this.baseUrl + 'cart?id=' + this.cart()?.id)
      .subscribe((res) => {
        localStorage.removeItem('cart_id');
        this.cart.set(null)
      })
  }

  addItemToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart()
    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }
    cart.items = this.addOrUpdateItem(cart.items, item, quantity) //cart.items nammal createcartil create aakyad and item verunnad so already ulla product annenki quantity increase aaki kodkum and illatha prodcut enki new item aayt create aakum
    this.setCart(cart)
    console.log(this.cart);

  }

  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index = items.findIndex(x => x.productId === item.productId);
    if (index === -1) {
      item.quantity = quantity
      items.push(item)
    } else {
      items[index].quantity += quantity
    }
    return items;
  }

  private mapProductToCartItem(item: Product): CartItem { //here we are returning cartItem 
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type
    }
  }

  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id) //create akumbo thanne cartid localil vekkum
    return cart;
  }

  private isProduct(item: CartItem | Product): item is Product { //product anno cartItema anno verunnad check aakan use aakunna function
    return (item as Product).id !== undefined //product anne verunnadenki athinte idyil data undo nokkum and undenki then product anne verunnad ennu true aaki retunr aakum
  }







}
