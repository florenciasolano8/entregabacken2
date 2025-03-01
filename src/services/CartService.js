import CartRepository from "../repositories/CartRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import TicketRepository from "../repositories/TicketRepository.js";
import TicketDTO from "../dto/TicketDTO.js";

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

    // Verificar el stock de cada producto
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
        // Agregar a productos no comprados
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
