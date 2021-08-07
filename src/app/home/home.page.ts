import {
  Component,
  ElementRef,
  ViewChild,
  NgZone,
  OnInit,
  OnDestroy,
} from '@angular/core';
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
// for 3d
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
  // for Three.js
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;
  // public loader: GLTFLoader;
  public cubeObject = '../../assets/3d/scene/root.gltf';

  public listOfImages = [];
  // For file upload
  public file: File;
  public selectedFile: ImageSnippet;
  public form: FormGroup;

  // Adding Drag and Drop
  public htmlToAdd = '';

  public photo: SafeResourceUrl;
  // Check is in browser
  public isDesktop: boolean;

  // Set properties for 3D rendering
  // private canvas: HTMLCanvasElement;
  // private renderer: THREE.WebGLRenderer;
  // private camera: THREE.PerspectiveCamera;
  // private scene: THREE.Scene;
  // private light: THREE.AmbientLight;
  // private cube: THREE.Mesh;
  // private frameId: number = null;

  constructor(
    public fb: FormBuilder,
    private _platform: Platform,
    private _domSanitizer: DomSanitizer,
    private _uploadService: UploadService,
    private ngZone: NgZone
  ) {
    this.initForm();
    this.loadResources();
  }

  ngOnInit() {
    // this.createScene(this.rendererCanvas);
    // this.animate();
    // this.load3dObject(this.rendererCanvas);
  }

  // for Three.js
  // public ngOnDestroy(): void {
  //   if (this.frameId != null) {
  //     cancelAnimationFrame(this.frameId);
  //   }
  // }

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

  addCouch() {
    this.htmlToAdd =
      '<model-viewer src="../../assets/3d/scene/root.gltf" alt="A 3D model of a cube" camera-controls></model-viewer>';
  }

  removeCouch() {
    this.htmlToAdd = '';
  }

  // Load my GLTF Object
  // loadObject(canvas: ElementRef<HTMLCanvasElement>) {
  //   this.loader = new GLTFLoader();
  //   this.scene = new THREE.Scene();
  //   this.loader.load(
  //     this.cubeObject,
  //     (gltf) => {
  //       this.scene.add(gltf.scene);
  //     },
  //     undefined,
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  // createScene(canvas: ElementRef<HTMLCanvasElement>): void {
  // The first step is to get the reference of the canvas element from our HTML document

  //   this.canvas = canvas.nativeElement;

  //   this.renderer = new THREE.WebGLRenderer({
  //     canvas: this.canvas,
  //     alpha: true, // transparent background
  //     antialias: true, // smooth edges
  //   });
  //   this.renderer.setSize(300, 200);

  //   // create the scene
  //   this.scene = new THREE.Scene();

  //   this.camera = new THREE.PerspectiveCamera(
  //     20,
  //     1000 / window.innerHeight,
  //     3,
  //     1000
  //   );
  //   this.camera.position.z = 5;
  //   this.scene.add(this.camera);

  //   // soft white light
  //   this.light = new THREE.AmbientLight(0x404040);
  //   this.light.position.z = 10;
  //   this.scene.add(this.light);

  //   const geometry = new THREE.BoxGeometry(1, 1, 1);
  //   const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  //   this.cube = new THREE.Mesh(geometry, material);
  //   this.scene.add(this.cube);
  // }

  // public animate(): void {
  //   // We have to run this outside angular zones,
  //   // because it could trigger heavy changeDetection cycles.
  //   this.ngZone.runOutsideAngular(() => {
  //     if (document.readyState !== 'loading') {
  //       this.render();
  //     } else {
  //       window.addEventListener('DOMContentLoaded', () => {
  //         this.render();
  //       });
  //     }

  //     window.addEventListener('resize', () => {
  //       this.resize();
  //     });
  //   });
  // }

  // // THREE.JS
  // public render(): void {
  //   this.frameId = requestAnimationFrame(() => {
  //     this.render();
  //   });

  //   this.cube.rotation.x += 0.01;
  //   this.cube.rotation.y += 0.01;
  //   this.renderer.render(this.scene, this.camera);
  // }

  // //THREE.JS
  // public resize(): void {
  //   const width = window.innerWidth;
  //   const height = window.innerHeight;

  //   this.camera.aspect = width / height;
  //   this.camera.updateProjectionMatrix();

  //   this.renderer.setSize(width, height);
  // }

  // Load an images
  // load3dObject(canvas: ElementRef<HTMLCanvasElement>) {
  //   const loader = new GLTFLoader();

  //   loader.load(this.cubeObject, (gltf) => {

  //   });
  // }
}
