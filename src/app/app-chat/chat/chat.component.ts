  import { Component, OnInit, Input} from '@angular/core';
  import { ChatMessage, Fooditem, ChatRoomInfo, AppUser } from '../../core/models';
  import { Observable } from 'rxjs';
  import { ActivatedRoute } from '@angular/router';
  import { AuthService } from '../../core/auth.service';
  import { map } from 'rxjs/operators';
  import { ChatService } from '../chat.service';

  @Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
  })
  export class ChatComponent implements OnInit {

  // @Input() sellerChatMessages: Observable<ChatMessage[]>;
    private newChatMessage: ChatMessage;
    chatMessages$: Observable<ChatMessage[]>;
    chatRoomInfo$: Observable<ChatRoomInfo[]>;
    chatMessage: ChatMessage[];
    chatRoomInfo: ChatRoomInfo;
    private fooditem: Fooditem;
    isBuyer: boolean;
    isSeller: boolean;
    currentUser: AppUser;

    constructor(private route: ActivatedRoute,
      private chatService: ChatService,
      private authService: AuthService

    ) {
      this.currentUser = this.authService.currAppUser;
      this.newChatMessage = {};
      // this.roomMessages = [];
      this.isBuyer = false;
    }

    inputMessageText: string;

    scrollToBottom() {
      try {
        document.getElementById('inner').scrollTop = document.getElementById('inner').scrollHeight;
      } catch (err) {
        console.error(err);
      }
    }

    isBuyerSeller() {
      if (this.authService.currentUserId === this.fooditem.createdBy.id) {
        this.isSeller = true;
      } else {
        this.isBuyer = true;
      }
    }

    sendRoomMessage($event) {
      // this.chatService.createchatMessages()
      event.preventDefault();
      event.stopPropagation();

      this.newChatMessage.message = this.inputMessageText;
      this.newChatMessage.createdByUserId = this.authService.currentUserId;
      this.isBuyerSeller();

          const chatroomName = this.fooditem.id + this.authService.currentUserId;
          this.chatRoomInfo = {
            buyerID:    this.authService.currentUserId,
            buyerName: this.currentUser.displayName,
            sellerID:   this.fooditem.createdBy.id,
            fooditemID: this.fooditem.id,
            roomID:     chatroomName,
            imageURL:   this.fooditem.images[0].url};

      console.log('chat-message buyer + fooditem id', chatroomName);
      this.chatService.createChatMessages(this.newChatMessage, this.chatRoomInfo, this.isBuyer);

      this.newChatMessage = {};
      this.inputMessageText = '';
      return false;
    }

    getChatbyQuery() {
      const buyerid = this.authService.currentUserId;
      const chatroomName = this.fooditem.id + buyerid;
      const sellerid = this.fooditem.createdBy;

      this.isBuyerSeller();
      this.chatRoomInfo = {
        buyerID: buyerid,
        fooditemID: this.fooditem.id,
        roomID: chatroomName
      };

      if (this.isBuyer) {
      this.chatMessages$ = this.chatService.getChatRoomMessages(this.chatRoomInfo);
      console.log ('I am a buyer-', this.isBuyer);
      } else {
        console.log('I am seller- ', this.isSeller);
        this.chatMessages$ = this.chatService.sellerChatMessages;
      }

        this.chatMessages$.subscribe(messages => {
        console.log('new chat messages observable', messages);
        this.chatMessage = messages;
    });
    }

    ngOnInit() {
      console.log('Chat-Room route', this.route);
      console.log('input Message=', this.inputMessageText);

      // this.scrollToBottom();
      this.fooditem = this.route.snapshot.data['chat'];
      console.log('FoodItem from Router in chat=', this.fooditem);

      this.getChatbyQuery();
    }

  }
