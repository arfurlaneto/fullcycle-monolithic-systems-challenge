import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/invoice-items.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

  async add(entity: Invoice): Promise<Invoice> {

    const invoiceModel = await InvoiceModel.create({
      id: entity.id.id,
      name: entity.name,
      document: entity.document,
      street: entity.address.street,
      number: entity.address.number,
      complement: entity.address.complement,
      city: entity.address.city,
      state: entity.address.state,
      zipCode: entity.address.zipCode,
      items: entity.items.map(item => ({
        id: item.id.id,
        name: item.name,
        price: item.price
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }, { include: ["items"] })

    return new Invoice({
      id: new Id(invoiceModel.id),
      name: invoiceModel.name,
      document: invoiceModel.document,
      address: new Address(
        invoiceModel.street,
        invoiceModel.number,
        invoiceModel.complement,
        invoiceModel.city,
        invoiceModel.state,
        invoiceModel.zipCode,
      ),
      items: invoiceModel.items.map(item => new InvoiceItems({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      })),
      createdAt: invoiceModel.createdAt,
      updatedAt: invoiceModel.createdAt
    })
  }

  async find(id: string): Promise<Invoice> {

    const invoice = await InvoiceModel.findOne({ 
      where: { id },
      include: ["items"],
     })

    if (!invoice) {
      throw new Error("Invoice not found")
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipCode,
      ),
      items: invoice.items.map(item => new InvoiceItems({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      })),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt
    })
  }
}