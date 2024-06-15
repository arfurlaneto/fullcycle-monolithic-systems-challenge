import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import Order from "../domain/order.entity";
import { OrderModel } from "./order.model";
import CheckoutGateway from "../gateway/checkout.gateway";

export default class OrderRepository implements CheckoutGateway {

  findOrder(id: string): Promise<Order | null> {
    throw new Error("Not implemented.")
  }

  async addOrder(order: Order): Promise<void> {
     await OrderModel.create({
        id: order.id.id,
        client_id: order.client.id.id,
        products_id: order.products.map(p => ({
          product_id: p.id.id,
        })),
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
     }, { include: ["products_id"]});
   }
}
