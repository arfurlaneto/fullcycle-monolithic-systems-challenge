import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Order from "../domain/order.entity";
import { OrderModel, OrderProductModel } from "./order.model";
import OrderRepository from "./order.repository";
import { ProductModel } from "../../product-adm/repository/product.model";
import { ClientModel } from "../../client-adm/repository/client.model";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";

describe("OrderRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([OrderModel, OrderProductModel, ProductModel, ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a order", async () => {

    const client = await ClientModel.create({
      id: '1',
      name: 'Lucian',
      email: 'lucian@123.com',
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipcode: "88888-888",      
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const product = await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product2 = await ProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Product 2 description",
      purchasePrice: 200,
      stock: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const orderProps = {
      id: new Id("1"),
      client: new Client({
        id: new Id(client.id),
        name: client.name,
        email: client.email,
        address: client.street
      }),
      products: [
        new Product({
          id: new Id(product.id),
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice
        }),
        new Product({
          id: new Id(product2.id),
          name: product2.name,
          description: product2.description,
          salesPrice: product2.salesPrice
        })
      ]
    };
    const order = new Order(orderProps);
    const orderRepository = new OrderRepository();
    await orderRepository.addOrder(order)

    const orderDb = await OrderModel.findOne({
      where: { id: orderProps.id.id },
      include: ["products_id"]
    });

    expect(orderProps.id.id).toEqual(orderDb.id);
    expect(orderProps.client.id.id).toEqual(orderDb.client_id);
    expect(orderProps.products.length).toEqual(orderDb.products_id.length);
    expect(orderProps.id.id).toEqual(orderDb.products_id[0].order_id);
    expect(orderProps.products[0].id.id).toEqual(orderDb.products_id[0].product_id);
    expect(orderProps.id.id).toEqual(orderDb.products_id[1].order_id);
    expect(orderProps.products[1].id.id).toEqual(orderDb.products_id[1].product_id);
    expect(order.createdAt).toEqual(orderDb.createdAt);
    expect(order.updatedAt).toEqual(orderDb.updatedAt);
  });
});
