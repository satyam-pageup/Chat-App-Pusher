import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from '../environments/environment';
import { ComponentBase } from '../app/shared/class/ComponentBase.class';
import { IResponseG } from '../app/response/responseG.response';
import { APIRoutes } from '../app/shared/constants/apiRoutes.constant';
import { INotificationModel, NotificationResponse } from '../app/model/notification.model';
import { NumberString } from '../app/model/util.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService extends ComponentBase {

  constructor() {
    super();
  }

  public requestPermission() {
    const messaging = getMessaging();
    getToken(messaging,
      { vapidKey: environment.firebase.vapidKey }).then(
        (currentToken) => {
          if (currentToken) {
            this._toastreService.success('Hurraaa!!! we got the token.....');
          } else {
            this._toastreService.error('No registration token available. Request permission to generate one.')
          }
        }).catch((err) => {

          this._toastreService.error('Error retrieving token. ', err);
          if (err.code === 'messaging/permission-blocked') {
            console.log('Notification access denied by the user.');
          }
        });
  }

  public listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      const nofication = payload as NotificationResponse;
      const senderID: number = parseInt(nofication.data['gcm.notification.userId']);
      const data: NumberString = {
        id: senderID,
        data: nofication.notification.body
      }
    });
  }



  public sendNotification(obj: { receiverSystemToken: string, title: string, body: string }, loggedInUserId: number) {

    const url = 'https://fcm.googleapis.com/fcm/send';
    const newMsg: INotificationModel = {
      notification: {
        title: obj.title,
        body: obj.body,
        userId: loggedInUserId
      },

      to: obj.receiverSystemToken
    }

    if (obj.receiverSystemToken != null) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'key=AAAA5N9GikU:APA91bE6i7bh3atMvh671HBpD7ab3H6BHG9qbwJHpNOeING93nOfRCHt-XHdoGFcOujelFyN1EGleLaWoCFquNQxRkWFLwM6d_PIoloeJh7Ngtw2J0z5kOufWtx8Lz3OLIHTx7in8oD1',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMsg)
      })
    }

  }

  private saveToken(token: string) {
    const newToken: { systemToken: string } = {
      systemToken: token
    };

    this.putAPICallPromise<{ systemToken: string }, IResponseG<null>>(APIRoutes.updateSystemToken, newToken, this.headerOption).then(
      (res) => {
        console.log(res);
      }
    )
  }
}
