import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpRequest, HttpEventType } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class UploadFileService {
  progress: Observable<number> = new BehaviorSubject<number>(0);
  loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  result: BehaviorSubject<Object> = new BehaviorSubject({});
  private data: any;
  private endpoint: string;
  constructor(
    private http: HttpClient,
    private afs: AngularFireStorage,
    private db: AngularFirestore
  ) {}

  public uploadMemberImage(file, MemberId) {
    this.loading.next(true);
    const task = this.afs.ref('MemberImages/' + MemberId).put(file);
    this.progress = task.percentageChanges();
    task
      .then(data => {
        this.result.next(data);
        this.loading.next(false);
        this.progress = new BehaviorSubject(0);
      })
      .catch(err => console.log(err));
    task.downloadURL().subscribe(url => this.updateUserRecord(url, MemberId));
  }

  private updateUserRecord(url: string, MemberId: string) {
    this.db.doc('Members/' + MemberId).update({ picture: url });
  }

  // public uploadfile(file, endpoint, data = {}) {
  //   // console.dir(files);
  //   this.progress.next(0);
  //   this.endpoint = endpoint;
  //   this.data = data;
  //   const result = this.getFileBase64(file).then(uploadResult => {
  //     console.log('result:', uploadResult);
  //     this.postFile(uploadResult);
  //   });
  // }

  // postFile(fileData) {
  //   this.data.fileData = fileData;
  //   const req = new HttpRequest(
  //     'POST',
  //     environment.firebaseFunctionURL + this.endpoint,
  //     this.data, // any metadata stored with the file
  //     {
  //       reportProgress: true
  //     }
  //   );
  //   this.loading.next(true);
  //   console.log('loading');
  //   this.http.request(req).subscribe(event => {
  //     if (event.type === HttpEventType.UploadProgress) {
  //       console.log('progress: ', event.loaded, '/', event.total);
  //       this.progress.next(event.loaded / event.total * 100);
  //     } else if (event.type === HttpEventType.Response) {
  //       this.loading.next(false);
  //       this.result.next(event.body);
  //       console.log(event.body);
  //     }
  //   });
  // }

  // getFileBase64(inputFile) {
  //   const temporaryFileReader = new FileReader();

  //   return new Promise((resolve, reject) => {
  //     temporaryFileReader.onerror = () => {
  //       temporaryFileReader.abort();
  //       reject(new DOMException('Problem parsing input file.'));
  //     };

  //     temporaryFileReader.onload = () => {
  //       resolve(temporaryFileReader.result);
  //     };
  //     temporaryFileReader.readAsDataURL(inputFile);
  //   });
  // }
}
