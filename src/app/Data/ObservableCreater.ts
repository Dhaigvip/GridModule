import { Observable, Subject, AsyncSubject } from 'rxjs/Rx';
 
 export class ObservableCreator {
   public static createFromData(data: any) {
     let observable = new Observable((observer: any) => {
       observer.next(data);
       observer.complete();
     });
     return observable;
   }
 }


