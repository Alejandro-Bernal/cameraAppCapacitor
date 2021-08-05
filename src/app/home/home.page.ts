import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  FormArray,
} from '@angular/forms';
import { Platform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
// Services
import { UploadService } from '../../services/upload.service';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('filePicker', { static: false })
  filePickerRef: ElementRef<HTMLInputElement>;

  public listOfImages = [];
  // For file upload
  public file: File;
  public selectedFile: ImageSnippet;
  public form: FormGroup;

  public photo: SafeResourceUrl;
  // Check is in browser
  public isDesktop: boolean;

  constructor(
    public fb: FormBuilder,
    private _platform: Platform,
    private _domSanitizer: DomSanitizer,
    private _uploadService: UploadService
  ) {
    this.initForm();
    this.loadResources();
  }

  ngOnInit() {
    // Check for the type of platform being used,
    if (
      (this._platform.is('mobile') && this._platform.is('hybrid')) ||
      this._platform.is('desktop')
    ) {
      this.isDesktop = true;
    }
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      avatar: ['', Validators.required],
      cloudinary_id: ['', Validators.required],
    });
  }

  async takePicture() {
    if (!Capacitor.isPluginAvailable('Camera') || this.isDesktop) {
      this.filePickerRef.nativeElement.click();
      return;
    }

    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });

    this.photo = this._domSanitizer.bypassSecurityTrustResourceUrl(
      image && image.dataUrl
    );
  }

  onChooseFile(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if (!file.type.match(pattern)) {
      console.log('File format not supported');
      return;
    }

    reader.onload = () => {
      this.photo = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  loadResources() {
    this._uploadService.imageObs.subscribe((data) => {
      this.listOfImages = data;
    });
  }

  showResources(test) {
    console.log(test, '<<<<<test');
  }

  readFile(element) {
    this.file = element.target.files[0];
    console.log(this.file);
  }

  uploadFile() {
    this._uploadService.uploadImage(this.file).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
