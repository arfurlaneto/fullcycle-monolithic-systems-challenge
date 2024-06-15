import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";
import {
  GenerateInvoiceFacadeInputDto,
  FindInvoiceFacadeInputDto,
  FindInvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  generateUsecase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _findUsecase: UseCaseInterface;
  private _generateUsecase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._generateUsecase = usecaseProps.generateUsecase;
  }

  async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
    return this._generateUsecase.execute(input);
  }

  async find(
    input: FindInvoiceFacadeInputDto
  ): Promise<FindInvoiceFacadeOutputDto> {
    let output = await this._findUsecase.execute(input);
    return {
      ...output,
      address: {
        street: output.address.street,
        number: output.address.number,
        complement: output.address.complement,
        city: output.address.city,
        state: output.address.state,
        zipCode: output.address.zipCode,
      }
    }
  }
}
