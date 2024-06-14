import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "../repository/invoice.model"
import InvoiceRepository from "../repository/invoice.repository"
import InvoiceFacade from "./invoice.facade"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"
import Address from "../../@shared/domain/value-object/address"
import { InvoiceItemModel } from "../repository/invoice-item.model"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase"


describe("Invoice Facade test", () => {

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

    const repository = new InvoiceRepository()
    const addUsecase = new GenerateInvoiceUseCase(repository)
    const facade = new InvoiceFacade({
      generateUsecase: addUsecase,
      findUsecase: undefined,
    })

    const input = {
      name: "Lucian",
      document: "1234-5678",      
      street: "Rua 123",
      number:  "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state:"SC",
      zipCode: "88888-888",
      items: [
        { id: "1", name:"Item 1", price: 10 },
        { id: "2", name:"Item 2", price: 20 }
      ]
    }

    let output = await facade.generate(input)

    const invoice = await InvoiceModel.findOne({ where: { id: output.id }, include: ["items"] })

    expect(invoice.name).toEqual(input.name)
    expect(invoice.document).toEqual(input.document)
    expect(invoice.street).toEqual(input.street)
    expect(invoice.number).toEqual(input.number)
    expect(invoice.complement).toEqual(input.complement)
    expect(invoice.city).toEqual(input.city)
    expect(invoice.state).toEqual(input.state)
    expect(invoice.zipCode).toEqual(input.zipCode)
    expect(invoice.items[0].id).toEqual(input.items[0].id)
    expect(invoice.items[0].name).toEqual(input.items[0].name)
    expect(invoice.items[0].price).toEqual(input.items[0].price)
  })

  it("should find a invoice", async () => {

    const facade = InvoiceFacadeFactory.create()

    const input = {
      name: "Lucian",
      document: "1234-5678",      
      street: "Rua 123",
      number:  "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state:"SC",
      zipCode: "88888-888",
      items: [
        { id: "1", name:"Item 1", price: 10 },
        { id: "2", name:"Item 2", price: 20 }
      ]
    }

    let output = await facade.generate(input)

    const invoice = await facade.find({ id: output.id })

    expect(invoice).toBeDefined()
    expect(invoice.id).toEqual(output.id)
    expect(invoice.name).toEqual(input.name)
    expect(invoice.document).toEqual(input.document)
    expect(invoice.address.street).toEqual(input.street)
    expect(invoice.address.number).toEqual(input.number)
    expect(invoice.address.complement).toEqual(input.complement)
    expect(invoice.address.city).toEqual(input.city)
    expect(invoice.address.state).toEqual(input.state)
    expect(invoice.address.zipCode).toEqual(input.zipCode)
    expect(invoice.items).toBeDefined()
    expect(invoice.items.length).toBe(2)
    expect(invoice.items[0].id).toEqual(input.items[0].id)
    expect(invoice.items[0].name).toEqual(input.items[0].name)
    expect(invoice.items[0].price).toEqual(input.items[0].price)
    expect(invoice.items[1].id).toEqual(input.items[1].id)
    expect(invoice.items[1].name).toEqual(input.items[1].name)
    expect(invoice.items[1].price).toEqual(input.items[1].price)
  })
})