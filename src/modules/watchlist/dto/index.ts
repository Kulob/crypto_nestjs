import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class WatchListDTO {
  @ApiProperty()
  @IsString()
  name: string | null

  @ApiProperty()
  @IsString()
  assetId: number | null
}