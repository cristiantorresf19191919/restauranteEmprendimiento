import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from 'src/models/user.schema';
import { UserController } from './accounts.controller';
import { AccountService } from './accounts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name:'Accounts', schema: AccountSchema}])
  ],
  controllers: [UserController],
  providers: [AccountService],
  exports:[AccountService]
})
export class AccountsModule {}
