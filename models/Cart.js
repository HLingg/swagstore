'use strict';

class Cart {
  constructor(sessionCart = {}) {
    this.items = sessionCart.items || {};
    // Phục hồi mã giảm giá từ session nếu có
    this.discountCode = sessionCart.discountCode || null;
  }

  add(product, qty = 1) {
    const id = String(product.id);
    if (this.items[id]) {
      this.items[id].qty += qty;
    } else {
      this.items[id] = { product, qty };
    }
  }

  remove(productId) {
    delete this.items[String(productId)];
  }

  updateQty(productId, qty) {
    const id = String(productId);
    if (qty <= 0) {
      this.remove(productId);
    } else if (this.items[id]) {
      this.items[id].qty = qty;
    }
  }

  clear() {
    this.items = {};
    this.discountCode = null; // Xóa mã giảm giá khi clear giỏ hàng
  }

  // Thêm hàm xử lý áp dụng mã giảm giá
  applyDiscount(code) {
    if (code === 'SWAG20') { // Hardcode mã SWAG20 giảm 20%
      this.discountCode = code;
      return true;
    }
    this.discountCode = null;
    return false;
  }

  get lines() {
    return Object.values(this.items).map(({ product, qty }) => ({
      product,
      qty,
      subtotal: +(product.price * qty).toFixed(2),
    }));
  }

  get count() {
    return Object.values(this.items).reduce((s, i) => s + i.qty, 0);
  }

  get subtotal() {
    return +this.lines.reduce((s, l) => s + l.subtotal, 0).toFixed(2);
  }

  get tax() {
    return +(this.subtotal * 0.08).toFixed(2);
  }

  // Thuộc tính mới: Tính số tiền được giảm
  get discount() {
    if (this.discountCode === 'SWAG20') {
      return +(this.subtotal * 0.2).toFixed(2); // Giảm 20% trên subtotal
    }
    return 0;
  }

  // Cập nhật hàm total để trừ đi tiền discount
  get total() {
    return +(this.subtotal + this.tax - this.discount).toFixed(2);
  }

  toJSON() {
    // Lưu thêm discountCode vào session
    return { 
      items: this.items,
      discountCode: this.discountCode 
    };
  }
}

module.exports = Cart;