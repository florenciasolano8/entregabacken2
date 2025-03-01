class CartDTO {
    constructor(cart) {
      this.id = cart._id;
      this.products = cart.products.map(product => ({
        productId: product.product._id,
        quantity: product.quantity
      }));
    }
  }
  
  export default CartDTO;