import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpRequest, HttpEventType } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UploadFileService {
  progress: BehaviorSubject<number> = new BehaviorSubject(0);
  loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  result: BehaviorSubject<Object> = new BehaviorSubject({});
  private data: any;
  private endpoint: string;
  constructor(private http: HttpClient) {}

  public uploadfile(file, endpoint, data = {}) {
    // console.dir(files);
    this.progress.next(0);
    this.endpoint = endpoint;
    this.data = data;
    const result = this.getFileBase64(file).then(uploadResult => {
      console.log('result:', uploadResult);
      this.postFile(uploadResult);
    });
  }

  postFile(fileData) {
    this.data.fileData = fileData;
    const req = new HttpRequest(
      'POST',
      environment.firebaseFunctionURL + this.endpoint,
      this.data,
      {
        reportProgress: true
      }
    );
    this.loading.next(true);
    console.log('loading');
    this.http.request(req).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log('progress: ', event.loaded, '/', event.total);
        this.progress.next(event.loaded / event.total * 100);
      } else if (event.type === HttpEventType.Response) {
        this.loading.next(false);
        this.result.next(event.body);
        console.log(event.body);
      }
    });
  }

  getFileBase64(inputFile) {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsDataURL(inputFile);
    });
  }

  // getBase64(file): string {
  //   let result = '';

  //   const reader = new FileReader();
  //   reader.onprogress = progress => {
  //     // console.log('progress: ', progress.loaded, '/', progress.total);
  //     // this.progress = progress.loaded / progress.total * 100;
  //   };

  //   reader.onloadstart = () => {
  //     this.loading.next(true);
  //   };

  //   reader.onloadend = () => {
  //     // this.loading = false;
  //     // console.log(reader.result.length);
  //     // this.postFile(reader.result);
  //     return reader.result;
  //   };

  //   reader.onload = () => {};

  //   reader.onerror = function(error) {
  //     console.log('Error: ', error);
  //     result = 'error';
  //     return reader.result;
  //   };

  //   reader.readAsDataURL(file);
  // }
}
