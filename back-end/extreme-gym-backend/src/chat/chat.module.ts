import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { ChatGateway } from "./chat.gateway";

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers:[ChatGateway]
})
export class ChatModule {}
