import Invoice from "../domain/invoice.entity";

export default interface ClientGateway {
  add(invoice: Invoice): Promise<Invoice>;
  find(id: string): Promise<Invoice>;
}
