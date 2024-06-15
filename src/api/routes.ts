import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../modules/product-adm/factory/facade.factory";
import ClientAdmFacadeFactory from "../modules/client-adm/factory/client-adm.facade.factory";
import Address from "../modules/@shared/domain/value-object/address";
import InvoiceFacadeFactory from "../modules/invoice/factory/invoice.facade.factory";
import CheckoutFacadeFactory from "../modules/checkout/factory/checkout.facade.factory";

export const routes = express.Router();

routes.post("/products", async (req: Request, res: Response) => {
  let productFacade = ProductAdmFacadeFactory.create()
  try {
    const input = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        purchasePrice: req.body.purchasePrice,
        salesPrice: req.body.salesPrice,
        stock: req.body.stock
    };
    const output = await productFacade.addProduct(input)
    res.send(output);
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
});

routes.post("/clients", async (req: Request, res: Response) => {
  let clientFacade = ClientAdmFacadeFactory.create()
  try {
    const input = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: new Address(
        req.body.address.street,
        req.body.address.number,
        req.body.address.complement,
        req.body.address.city,
        req.body.address.state,
        req.body.address.zipCode,
      )
    }
    const output = await clientFacade.add(input)
    res.send(output);
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
});

routes.post("/checkout", async (req: Request, res: Response) => {
  let checkoutFacade = CheckoutFacadeFactory.create()
  try {
    const input = {
      clientId: req.body.clientId,
      products: req.body.products,
    }
    const output = await checkoutFacade.placeOrder(input)
    res.send(output);
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
});

routes.get("/invoice/:id", async (req: Request, res: Response) => {
  let invoiceFacade = InvoiceFacadeFactory.create()
  try {
    const input = {
      id: req.params.id
    }
    const output = await invoiceFacade.find(input)
    res.send(output);
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
});
