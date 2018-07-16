  import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from 'firebase';
// rxjs imports
import { BehaviorSubject, Observable } from 'rxjs';
// local imports
import { ChatMessage, ChatRoomInfo } from '../core/models';





  const APP_ROOT_COLLECTIONS = {
    'PRODUCTS': 'products',
    'USERS': 'appusers',
    'CHATS': 'appchats',
  };

  @Injectable()
  export class ChatService {
    private appUserPath: string;
    private chatroomPath: string;
    private chatMessages: Observable<ChatMessage[]>;
    private chatRoomRef: AngularFirestoreCollection<ChatMessage>;
    FooditemID$: BehaviorSubject<string>;
    chatMessages$: BehaviorSubject<ChatMessage[]>;
    sellerChatMessages: Observable<ChatMessage[]>;

    roomID$: BehaviorSubject<any>;

    ccc: any;

    currentChatPath: any;

    constructor(
      private afs: AngularFirestore,
      private storage: AngularFireStorage,
    ) {
      afs.firestore.settings({ timestampsInSnapshots: true });
      this.FooditemID$ = new BehaviorSubject(null);

      this.appUserPath = APP_ROOT_COLLECTIONS['USERS'];
      this.chatroomPath = APP_ROOT_COLLECTIONS['CHATS'];

      this.chatRoomRef = this.createFirestoreCollectionRef(APP_ROOT_COLLECTIONS['CHATS']);

    }

    createFirestoreCollectionRef(collectionPath: string): AngularFirestoreCollection<any> {
      return this.afs.collection<any>(collectionPath);
    }

    getFirebaseDocumentKey(): string {
      return this.afs.createId();
    }

    get serverTimestampFromFirestore() {
      return firebase.firestore.FieldValue.serverTimestamp();
    }

  async createChatMessages(newMessage: ChatMessage, chatRoominfo: ChatRoomInfo, isBuyer: boolean) {

    if (isBuyer) {
      newMessage.msgCreatedAt = this.serverTimestampFromFirestore;
      this.chatRoomRef.doc(`${chatRoominfo.roomID}`).set(chatRoominfo);
      this.chatRoomRef.doc(`${chatRoominfo.roomID}`).collection('conversation').add(newMessage)
        .then(
        result => {
          console.log('first time login, created new room', result);
        },
        err => console.error(err, 'You do not have access!')
        );
    } else {
      console.log('seller login', this.roomID$);
      newMessage.msgCreatedAt = this.serverTimestampFromFirestore;
      this.chatRoomRef.doc(`${this.roomID$}`).collection('conversation').add(newMessage);
  }
  }

  getChatRoomMetaData(sellerID: string): Observable<any> {
      return this.afs.collection<any>
      ('appchats', ref => ref.where('sellerID', '==', sellerID))
      .valueChanges();
    }

    getChatRoomMessages(chatRoomInfo: any): Observable < ChatMessage[] > {
    this.chatRoomRef.valueChanges().subscribe(docs => {
    });

    // Stored the roomID for further reference
    this.roomID$ = chatRoomInfo.roomID;

    return this.chatRoomRef.
    doc(`${chatRoomInfo.roomID}`).
    collection<ChatMessage>('conversation', ref => ref.orderBy('msgCreatedAt')).
    valueChanges();
  }


  removeRoom(chatroom: ChatMessage): Promise < any > {
    const roomPath = `${this.chatroomPath}/${chatroom.createdByUserId}`;
    return this.afs.doc<ChatMessage>(roomPath).delete();
  }

  }
  // getRoomID(fooditem: Fooditem): Observable<any[]> {
  //   const fooditemId = fooditem.id;
  //   return this.afs.collection<any>('appchats', ref => ref.where('fooditemID', '==', fooditemId)).valueChanges();
  // }

  // getSellerMessages(fooditem: Fooditem): Observable < any > {
  //  const sellerId = fooditem.createdBy;
  //  const fooditemId = fooditem.id;
  //   console.log('seller id from Chatservice', sellerId);

  //   return this.afs.collection<any>('appchats').valueChanges().pipe(
  //     flatMap(res => res),
  //     filter(item => item.fooditemID === fooditemId),
  //     switchMap(s => {
  //       console.log('seller filtered data', s);
  //       this.currentChatPath = `${s.roomID}`;
  //       console.log('this.currentChatPath: ', this.currentChatPath);
  //       this.roomID$ = this.currentChatPath;
  //       return this.chatRoomRef.doc(s.roomID).collection('conversation', ref => ref.orderBy('msgCreatedAt')).valueChanges();
  //     }
  //     )
  //   );
  // }
