import { Body, Controller, Post } from '@nestjs/common';
import { DataService } from 'src/websocket/data/data.service';

@Controller('nickname')
export class NicknameController {
    constructor(private data: DataService) { }
    @Post()
    findAll(
        @Body() nickname: any
    ): Boolean {
        nickname = nickname.nickname
        console.log(nickname, this.data.clients);
        if (typeof nickname == "string") {
            return !this.data.clients.some(el => el.name == nickname && el.socket != null);
        }
        return false;
    }
}
