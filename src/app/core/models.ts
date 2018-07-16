import * as firebase from 'firebase';

export interface Fooditem {
    id: string;
    createdAt?: Date;
    createdBy?: {id: string, name: string, photoUrl: string};
    isModified?: boolean;
    modifiedAt?: Date;
    geoInfoFromAppUser?: boolean;
    // <product form fields>
    title?: string;
    description?: string;
    currency?: string;
    price?: number;
    serving?: number;
    isNonVeg?: boolean;
    category?: string;
    cuisine?: string;
    orderType?: string;
    orderTime?: string;
    availability?: string[];
    deliveryTime?: string;
    cashOnDelivery?: boolean;
    onlinePayment?: boolean;
    takeAway?: boolean;
    homeDelivery?: boolean;
    dineIn?: boolean;
    geoInfo?: IGeoInfo;
    // </product form fields>
    images?: { path: string, url: string }[];
}

export interface AppUser {
    uid: string;
    isAnonymous: boolean;
    displayName?: string;
    geoInfo?: IGeoInfo;
    address?: string;
    photoURL?: string;
    email?: string;
    phoneNumber?: string;
    providerId?: string;
    isSeller?: boolean;
    isBuyer?: boolean;
    hasOrders?: boolean;
    hasUploads?: boolean;
    hasLikes?: boolean;
    hasWishlisth?: boolean;
}

// 23.135469 83.18172000000004

export interface IGeoInfo {
    coordinates?: firebase.firestore.GeoPoint;
    autoAddressFromMap?: string;
    addressFromUser?: string;
}

export interface ChatMessage {
    messageId?: string;
    msgCreatedAt?: number | object;
    createdByUserId?: string;
    message?: string;
}

export interface ChatRoomInfo {
    buyerID?: string;
    buyerName?: string;
    sellerID?:  string;
    sellerName?: string;
    fooditemID?: string;
    roomID?: string;
    imageURL?: string;
}
