  import { Component, OnInit } from '@angular/core';
  import { AuthService } from '../core/auth.service';
  import { AppUser, ChatRoomInfo, Fooditem } from '../core/models';
  import { DataService } from '../core/data.service';
  import { Observable } from 'rxjs';
  import { ChatService } from '../app-chat/chat.service';
  import { tap, flatMap } from 'rxjs/operators';

  @Component({
    selector: 'app-app-user',
    templateUrl: './app-user.component.html',
    styleUrls: ['./app-user.component.scss']
  })
  export class AppUserComponent implements OnInit {

    user: Observable<AppUser>;
    userid: string;
    ChatMetaData$: Observable<any>;
    roomMetaData: Observable<ChatRoomInfo[]>;
    fooditems$: Observable<Fooditem>;
    chatMessages$: Observable<any>;
    constructor(private authService: AuthService,
                private dataService: DataService,
                private chatService: ChatService ) {
    }

    getMessage(chatroom: ChatRoomInfo) {
      console.log('I am in getMessage', this.chatMessages$);
      this.chatService.sellerChatMessages = this.chatService.getChatRoomMessages(chatroom);
    }


    ngOnInit() {
      this.userid = this.authService.currUserID;
      console.log(this.userid);
        this.user = this.dataService.getUserFromFirestore(this.userid);
        this.user.subscribe(user => {
        const name = user.displayName;
        const url = user.photoURL;
        this.ChatMetaData$ = this.chatService.getChatRoomMetaData(this.userid);
    });
  }
  }
