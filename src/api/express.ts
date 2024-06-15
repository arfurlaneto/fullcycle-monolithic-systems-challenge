import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../modules/invoice/repository/invoice-item.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import { ProductModel } from "../modules/product-adm/repository/product.model";
import ProductModelCatalog from "../modules/store-catalog/repository/product.model"
import { routes } from "./routes";
import { OrderModel, OrderProductModel } from "../modules/checkout/repository/order.model";

export const app: Express = express();
app.use(express.json());
app.use("/", routes);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels([
    ClientModel,
    InvoiceModel,
    InvoiceItemModel,
    TransactionModel,
    ProductModel,
    OrderModel,
    OrderProductModel,
  ]);
  await sequelize.sync();
  sequelize.addModels([ ProductModelCatalog ]);
}
setupDb();
