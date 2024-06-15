import { Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ClientModel } from "../../client-adm/repository/client.model";
import { ProductModel } from "../../product-adm/repository/product.model";

@Table({ tableName: "orders", timestamps: false })
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @ForeignKey(() => ClientModel)
  @Column({ allowNull: false })
  declare client_id: string;

  @HasMany(() => OrderProductModel, 'order_id')
  declare products_id: OrderProductModel[];

  @Column({ allowNull: false })
  status: string;

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;
}

@Table({ tableName: 'order_product', timestamps: false })
export class OrderProductModel extends Model {
  @PrimaryKey
  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false })
  declare order_id: string;

  @PrimaryKey
  @ForeignKey(() => ProductModel)
  @Column({ allowNull: false })
  declare product_id: string;
}
