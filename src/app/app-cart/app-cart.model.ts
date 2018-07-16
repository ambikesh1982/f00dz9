
export interface ICartItem {
  id: string;
  title?: string;
  url?: string;
  qty?: number;
  price?: number;
}

export interface ICartDoc {
  id: string;
  name?: string;
  state?: string;
  qty?: number;
  amtPayable?: number;
  discount?: number;
}

export interface ICheckout {
  buyer: {id: string, name: string};
  seller: { id: string, name: string };
  items: ICartItem[];
  currState: IOrderState;
  paymentOption: string;
  deliveryOption: string;
  deliveryAddress?: string;
  checkedOutAt?: Date;
  cancelledAt?: Date;
  rejectedAt?: Date;
  confirmedAt?: Date;
  completedAt?: Date;
}

export interface IOrderState {
  state: string;
  updatedAt: Date;
  reason?: string;
  additionalComments?: string;
}



/*
APPCART --> buyerid
              ORDERS --> sellerid
              {buyerid       ITEMS --> itemid
              name?          sellerid     {id
              state?         name?        title?
              amtPayable?    state?       state?
              discount?      amtPayable?  amtPayable?
              qty? }         discount?    discount?
                             qty? }       qty? }
---------------------------------------------------------------------------------

1. Add first item to the cart:
  a. initialize the cart with (buyerid, name, active, 1, 10, 0)
  b. add first order (selllerid, name, request, 1, 10, 0)
  c. add first item (itemid, title, request, 1, 10, 0)

2. Update item quantity
  a. update amtPayable = amtPayable + item.amtPayable
  b. update amtPayable = amtPayable + item.amtPayable
  c. update qty = qty + 1 and amtPayable + item.amtPayable

3. Add another item from different seller
  a. update qty = qty + 1, amtPayable = amtPayable + item.amtPayable
  b. add second order (selllerid, name, request, 1, 10, 0)
  c. add second item (itemid, title, request, 1, 10, 0)

----------------------------------------------------------------------------------

1. Add item to the cart:
  a. set the itemPath:
    APPCART/buyerid/ORDERS/sellerid/ITEMS/itemid.set(item)

  b. listen to APPCART/buyerid/ORDERS/sellerid1/ITEMS.valueChanges();
  if (ITEMS.length !== 0) {
    const orderDoc = {id = sellerid1
            name = sellername
            state = request
            qty = ITEMS.length
            price = reduce(ITEMS.amtPayable)
            discount = reduce(ITEMS.discount)
          };
    add/update(orderDoc);
    } else {
      delete(orderDoc)
    }

  c. listen to APPCART/buyerid/ORDERS.valueChanges();
  if (ORDERS.length !== 0) {
    const cartDoc = { id = buyerid
            name = buyername
            state = active
            qty = ORDERS.length
            price = reduce(ORDERS.amtPayable)
            discount = reduce(ORDERS.discount)
          };
    add/update(cartDoc);
    } else {
      delete(cartDoc);
    }

TODO: Step b and c should be implemented by cloud functions.
*/
