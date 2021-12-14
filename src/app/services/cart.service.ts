import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public cartItemList: any = [];
  public productList: any = new BehaviorSubject<any>([]);
  public searchKey = new BehaviorSubject<String>('');
  constructor() {}

  getProducts() {
    return this.productList.asObservable();
  }

  setProduct(product: any) {
    this.cartItemList.push(...product);
    this.productList.next(product);
  }

  addToCart(product: any) {
    let isExist = false;
    isExist = this.cartItemList.indexOf(product) > -1 ? true : false;
    if (!isExist) this.cartItemList.push(product);
    for (let cartItem of this.cartItemList) {
      if (cartItem.id === product.id) {
        cartItem.quantity++;
        cartItem.total = cartItem.quantity * product.price;
        break;
      }
    }

    this.productList.next(this.cartItemList);
    this.getTotalAmount();
    console.log(this.cartItemList);
  }

  getTotalAmount(): number {
    let total = 0;
    this.cartItemList.map((item: any) => (total += item.total));
    return total;
  }

  removeCartItem(product: any) {
    this.cartItemList.map((item: any, index: number) => {
      if (item.id === product.id) {
        item.quantity = 0;
        item.total = 0;
        this.cartItemList.splice(index, 1);
      }
    });
    this.productList.next(this.cartItemList);
  }

  removeAllItems() {
    this.cartItemList = [];
    this.productList.next(this.cartItemList);
  }

  decrease(product: any) {
    for (let cartItem of this.cartItemList) {
      if (cartItem.id === product.id) {
        if(cartItem.quantity > 1) {
        cartItem.quantity--;
        cartItem.total = cartItem.quantity * product.price;
        } else {
         cartItem.quantity = 0;
         cartItem.total = 0;
         cartItem.showQuantity = false;
         let i = this.cartItemList.indexOf(cartItem);
         this.cartItemList.splice(i,1);
        }
        break;
      }
    }
    this.productList.next(this.cartItemList);
    this.getTotalAmount();
  }

  increase(product: any) {
    for (let cartItem of this.cartItemList) {
      if (cartItem.id === product.id) {
        cartItem.quantity++;
        cartItem.total = cartItem.quantity * product.price;
        break;
      }
    }

    this.productList.next(this.cartItemList);
    this.getTotalAmount();
  }
}