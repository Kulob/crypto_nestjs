import { Injectable } from '@nestjs/common';
import { Watchlist } from './models/watchlist.module';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAssetResponse } from './response';
import { WatchListDTO } from './dto';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(Watchlist)
    private readonly watchlistRepository: typeof Watchlist,
  ) {}

  async createAsset (user: { id: any; }, dto: WatchListDTO): Promise<CreateAssetResponse> {
    const watchlist = {
      user: user.id,
      name: dto.name,
      assetId: dto.assetId
    }
    await this.watchlistRepository.create(watchlist)
    return watchlist
  }

  async deleteAsset(userId: number, assetId: string): Promise<boolean> {
    await this.watchlistRepository.destroy({
      where: { id: assetId, user: userId },
    });
    return true;
  }
}
