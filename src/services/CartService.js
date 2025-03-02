import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import TicketRepository from "../repositories/ticket.repository.js";
import TicketDTO from "../dto/ticket.dto.js";

class CartService {
  async createCart() {
    return await CartRepository.createCart();
  }

  async getCartById(id) {
    return await CartRepository.getCartById(id);
  }

  async addProductToCart(cartId, product) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const existingProduct = cart.products.find(p => p.productId.equals(product.productId));
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      cart.products.push(product);
    }

    return await CartRepository.updateCart(cart);
  }

  /**
   * Finaliza la compra verificando el stock y generando el ticket
   */
  async finalizePurchase(cartId, userEmail) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    let totalAmount = 0;
    let purchasedProducts = [];
    let notPurchasedProducts = [];

    // Verifica el stock de cada producto
    for (const item of cart.products) {
      const product = await ProductRepository.getProductById(item.productId);

      if (product && product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await ProductRepository.updateProduct(product);

        // Agrego  productos comprados
        totalAmount += product.price * item.quantity;
        purchasedProducts.push({
          productId: product._id,
          quantity: item.quantity
        });
      } else {
        // Agrega a productos no comprados
        notPurchasedProducts.push({
          productId: product._id,
          quantity: item.quantity
        });
      }
    }

    // Generar ticket solo si hay productos comprados
    let ticket = null;
    if (purchasedProducts.length > 0) {
      ticket = await TicketRepository.createTicket({
        amount: totalAmount,
        purchaser: userEmail
      });
    }

    cart.products = notPurchasedProducts;
    await CartRepository.updateCart(cart);

    return {
      ticket: ticket ? new TicketDTO(ticket) : null,
      notPurchasedProducts
    };
  }
}

export default new CartService();
