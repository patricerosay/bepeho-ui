import {Injectable} from '@angular/core';

declare var document: any;

@Injectable()
export class WebRTCService {
    public cloudUrl = 'https://cloud.apizee.com';
    currentLocalStream: any;
    connectedConversation: any;
    connectedSession: any;
    isConnected: boolean;
    isLive: boolean;

    constructor() {
    }

    hangup(): void {
        if (this.currentLocalStream) {
          this.currentLocalStream.release();
          this.currentLocalStream = null;
        }
        if (this.connectedConversation) {
          this.connectedConversation
            .leave()
            .then(function () {
              console.log('conversation successfully left');
            })
            .catch(function (err) {
              console.error('error whil leaving conversation', err);
            });
          this.connectedConversation = null;
        }
        if (this.connectedSession) {
          this.connectedSession.disconnect();
          this.connectedSession = null;
        }
        this.isLive = false;
        this.isConnected = false;
    
        if (this.ua) {
          this.ua
            .unregister({
              cloudUrl: this.cloudUrl
            })
            .then(() => {
              // OK : UserAgent is disconnected from the Apizee platform
            })
            .catch(error => {
              // this.errorMsg = ' disconnection error ' + error;
              console.error(error);
            });
        }
        // this.contactCount = 'Disconnected';
      }

}
