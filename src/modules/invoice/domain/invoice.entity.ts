import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "./invoice-items.entity";

type InvoiceProps = {
  id?: Id 
  name: string
  document: string
  address: Address
  items: InvoiceItems[]
  createdAt?: Date
  updatedAt?: Date
};

export default class Invoice extends BaseEntity implements AggregateRoot {
  _name: string
  _document: string
  _address: Address
  _items: InvoiceItems[]

  constructor(props: InvoiceProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name
    this._document = props.document
    this._address = props.address
    this._items = props.items
    this.validate();
  }

  validate(): void {
    if (!this.name) {
      throw new Error("Name is required");
    }
    if (!this.document) {
      throw new Error("Document is required");
    }
    if (!this._address) {
      throw new Error("Address is required");
    }
    if (!this._items || !this._items.length) {
      throw new Error("Items is required");
    }
  }
 
  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get address(): Address {
    return this._address;
  }

  get items(): InvoiceItems[] {
    return this._items;
  }

  get total(): number {
    return this._items.reduce(
      (total, item) => total + item.price,
      0
    );
  }
}
