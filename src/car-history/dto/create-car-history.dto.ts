export class CreateCarHistoryDto {
  buyed_at: Date;
  sold_at?: Date;
  ownerId?: number;
  carId?: number;
}
