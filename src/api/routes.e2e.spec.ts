import { OrderModel, OrderProductModel } from "../modules/checkout/repository/order.model";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import Product from "../modules/product-adm/domain/product.entity";
import { ProductModel } from "../modules/product-adm/repository/product.model";
import { app, sequelize } from "./express";
import request from "supertest";

describe("E2E test for customer", () => {
  beforeEach(async () => {
    await sequelize.sync({force: true});
  });

   it("should create an order", async () => {
    const responseProduct = await request(app)
      .post("/products")
      .send({
        "name": "Product 1",
        "description": "Product 1 Description",
        "purchasePrice": 100.00,
        "salesPrice": 150.00,
        "stock": 500
      });

    expect(responseProduct.status).toBe(200);
    expect(responseProduct.body.id).toBeDefined()
    expect(responseProduct.body.name).toBe("Product 1");
    expect(responseProduct.body.description).toBe("Product 1 Description");
    expect(responseProduct.body.purchasePrice).toBe(100)
    expect(responseProduct.body.salesPrice).toBe(150)
    expect(responseProduct.body.stock).toBe(500)
    expect(responseProduct.body.createdAt).toBeDefined()
    expect(responseProduct.body.updatedAt).toBeDefined()

    const responseClient = await request(app)
      .post("/clients")
      .send({
        "name": "Client 1",
        "email": "client1@xpto.com",
        "document": "1234-5678",
        "address": {
            "street": "Rua 123",
            "number": "99",
            "complement": "Casa Verde",
            "city": "Criciúma",
            "state": "SC",
            "zipCode": "88888-888"
        }
      });

    expect(responseClient.status).toBe(200);
    expect(responseClient.body.name).toBe("Client 1")
    expect(responseClient.body.email).toBe("client1@xpto.com");
    expect(responseClient.body.document).toBe("1234-5678");
    expect(responseClient.body.address.street).toBe("Rua 123");
    expect(responseClient.body.address.number).toBe("99");
    expect(responseClient.body.address.complement).toBe("Casa Verde");
    expect(responseClient.body.address.city).toBe("Criciúma");
    expect(responseClient.body.address.state).toBe("SC");
    expect(responseClient.body.address.zipCode).toBe("88888-888");
    expect(responseClient.body.createdAt).toBeDefined()
    expect(responseClient.body.updatedAt).toBeDefined()

    let productId = responseProduct.body.id
    let clientId = responseClient.body.id

    const responseOrder = await request(app)
    .post("/checkout")
     .send({
        "clientId": clientId,
        "products": [
          { "productId": productId}
        ]
    });

    expect(responseOrder.status).toBe(200);
    expect(responseOrder.body.id).toBeDefined()
    expect(responseOrder.body.invoiceId).toBeDefined()
    expect(responseOrder.body.status).toBe("approved")
    expect(responseOrder.body.total).toBe(150)
    expect(responseOrder.body.products[0].productId).toBe(productId)

    let invoiceId = responseOrder.body.invoiceId

    const invoiceResponse = await request(app)
      .get(`/invoice/${invoiceId}`)
      .send();

    expect(invoiceResponse.status).toBe(200);
    expect(invoiceResponse.body.id).toBeDefined()
    expect(invoiceResponse.body.name).toBe("Client 1")
    expect(invoiceResponse.body.document).toBe("1234-5678")
    expect(invoiceResponse.body.address.street).toBe("Rua 123");
    expect(invoiceResponse.body.address.number).toBe("99");
    expect(invoiceResponse.body.address.complement).toBe("Casa Verde");
    expect(invoiceResponse.body.address.city).toBe("Criciúma");
    expect(invoiceResponse.body.address.state).toBe("SC");
    expect(invoiceResponse.body.address.zipCode).toBe("88888-888");
    expect(invoiceResponse.body.items).toBeDefined()
    expect(invoiceResponse.body.items.length).toBe(1)
    expect(invoiceResponse.body.items[0].id).toBeDefined()
    expect(invoiceResponse.body.items[0].name).toBe("Product 1")
    expect(invoiceResponse.body.items[0].price).toBe(150)
    expect(invoiceResponse.body.total).toBe(150)
    expect(invoiceResponse.body.createdAt).toBeDefined()
  });
});