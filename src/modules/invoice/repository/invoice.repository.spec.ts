import { Sequelize, UpdatedAt } from "sequelize-typescript"
import { InvoiceModel } from "./invoice.model"
import InvoiceRepository from "./invoice.repository"
import Invoice from "../domain/invoice.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import { InvoiceItemModel } from "./invoice-item.model"
import InvoiceItems from "../domain/invoice-items.entity"

describe("Invoice Repository test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create a invoice", async () => {

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Lucian",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      items: [
        new InvoiceItems({ id: new Id("1"), name: "Item 1", price: 10}),
        new InvoiceItems({ id: new Id("2"), name: "Item 2", price: 20})
      ]
    })

    const repository = new InvoiceRepository()
    await repository.add(invoice)

    const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" }, include: ["items"] })

     expect(invoiceDb).toBeDefined()
     expect(invoiceDb.id).toEqual(invoice.id.id)
     expect(invoiceDb.name).toEqual(invoice.name)
     expect(invoiceDb.document).toEqual(invoice.document)
     expect(invoiceDb.street).toEqual(invoice.address.street)
     expect(invoiceDb.number).toEqual(invoice.address.number)
     expect(invoiceDb.complement).toEqual(invoice.address.complement)
     expect(invoiceDb.city).toEqual(invoice.address.city)
     expect(invoiceDb.state).toEqual(invoice.address.state)
     expect(invoiceDb.zipCode).toEqual(invoice.address.zipCode)
     expect(invoiceDb.items).toBeDefined()
     expect(invoiceDb.items.length).toBe(2)
     expect(invoiceDb.items[0].id).toEqual(invoice.items[0].id.id)
     expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name)
     expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price)
     expect(invoiceDb.items[1].id).toEqual(invoice.items[1].id.id)
     expect(invoiceDb.items[1].name).toEqual(invoice.items[1].name)
     expect(invoiceDb.items[1].price).toEqual(invoice.items[1].price)
     expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt)
     expect(invoiceDb.updatedAt).toStrictEqual(invoice.updatedAt)
  })
  
  it("should find a invoice", async () => {

   const invoice = await InvoiceModel.create({
      id: "1",
      name: "Lucian",
      document: "1234-5678",
      street:  "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
      { id: "1", name: "Item 1", price: 10 },
      { id: "2", name: "Item 2", price: 20 }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { include: ["items"] })

    const repository = new InvoiceRepository()
    const result = await repository.find(invoice.id)

    expect(invoice).toBeDefined()
    expect(invoice.id).toEqual(result.id.id)
    expect(invoice.name).toEqual(result.name)
    expect(invoice.document).toEqual(result.document)
    expect(invoice.street).toEqual(result.address.street)
    expect(invoice.number).toEqual(result.address.number)
    expect(invoice.complement).toEqual(result.address.complement)
    expect(invoice.city).toEqual(result.address.city)
    expect(invoice.state).toEqual(result.address.state)
    expect(invoice.zipCode).toEqual(result.address.zipCode)
    expect(invoice.items).toBeDefined()
    expect(invoice.items.length).toBe(2)
    expect(invoice.items[0].id).toEqual(result.items[0].id.id)
    expect(invoice.items[0].name).toEqual(result.items[0].name)
    expect(invoice.items[0].price).toEqual(result.items[0].price)
    expect(invoice.items[1].id).toEqual(result.items[1].id.id)
    expect(invoice.items[1].name).toEqual(result.items[1].name)
    expect(invoice.items[1].price).toEqual(result.items[1].price)
    expect(invoice.createdAt).toStrictEqual(result.createdAt)
    expect(invoice.updatedAt).toStrictEqual(result.updatedAt)
  })
})