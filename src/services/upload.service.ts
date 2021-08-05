import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

const baseUrl = 'http://localhost:3000/user';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private imageListState = new BehaviorSubject([]);
  public imageObs = this.imageListState.asObservable();

  constructor(private http: HttpClient) {
    this.getAllImages();
  }

  getAllImages() {
    this.getImages().subscribe(
      (data: any) => {
        this.imageListState.next(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updateObs(resource) {
    const newList = this.imageListState.value;

    newList.push(resource);

    this.imageListState.next(newList);
  }

  getImages() {
    return this.http.get(`${baseUrl}/get-user`);
  }

  uploadImage(payload) {
    const formData = new FormData();
    formData.append('image', payload);
    return this.http.post<any>(`${baseUrl}/upload-single-image`, formData);
  }
}
