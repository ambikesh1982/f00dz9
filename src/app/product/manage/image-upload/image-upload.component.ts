import { Component, OnInit, Input, OnDestroy, OnChanges, EventEmitter, Output, } from '@angular/core';
import { DataService } from '../../../core/data.service';
import { Fooditem } from '../../../core/models';
import { Observable, Subscription } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize, tap, map } from 'rxjs/operators';


@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})

export class ImageUploadComponent implements OnInit, OnChanges, OnDestroy {

  @Input() fooditem: Fooditem;
  @Output() imageUploaded = new EventEmitter();

  actions = ['SUCCESS', 'DISCARD', 'FAIL'];

  manageProductActions$: Observable<string>;

  maxFileUploadCount: number;
  selectedFileCount: number;

  /** STORAGE **/
  upload$;
  uploadPercent$: Observable<number>;
  subscription: Subscription;

  storagePath: string;

  preview: { path: string, url: string };
  images: { path: string, url: string }[];
  imagesDeleted: { path: string, url: string }[];
  imagesAdded: { path: string, url: string }[];


  constructor(private dataService: DataService, private storage: AngularFireStorage) {
    this.storagePath = 'foodz9test';
    this.maxFileUploadCount = 4;
    this.imagesAdded = [];
    this.imagesDeleted = [];
  }

  ngOnChanges() { }

  ngOnInit() {
    if (this.fooditem.images.length === 0) {
      this.images = [];
      this.selectedFileCount = 0;
    } else {
      this.preview = this.fooditem.images[0];
      this.images = this.fooditem.images;
      this.selectedFileCount = this.images.length;
    }
    console.log('from ngOnInit');
  }

  // <Storage...>
  fileController(imageFiles: FileList) {
    console.log('From fileController');
    if (imageFiles[0]) {

      const image = imageFiles[0];
      const imagePath = `${this.storagePath}/${this.fooditem.id}/${new Date().getTime()}_${image.name}`;
      const storageRef = this.storage.ref(imagePath);
      const uploadTask = this.storage.upload(imagePath, image);

      // Watch file upload process...
      this.uploadPercent$ = uploadTask.percentageChanges();

      // Get download url
      this.subscription = uploadTask.snapshotChanges().pipe(
        tap(snap => {
          if (snap.bytesTransferred === snap.totalBytes) {
            this.manageFileCount(1);
          }
        }),
        finalize(() => {
          this.upload$ = storageRef.getDownloadURL().pipe(
            map( (url: string) => {
              if ( url ) {
                this.preview = { path: imagePath, url: url };
                this.images.push(this.preview);
                this.imagesAdded.push(this.preview);
                this.imageUploaded.emit(this.images);
              }
            })
          );
        })
      ).subscribe();
    }
  }

  deleteImage(img: any) {
    const index = this.images.indexOf(img);
    if (index !== -1) {
      this.imagesDeleted.push(img);         // 1. Add the image to imagesDeleted array.
      this.images.splice(index, 1);         // 2. Soft delete: Remove the image form images array.
      this.preview = this.images[0];        // 3. Set the preview to first image of the images array.
      this.manageFileCount(-1);             // 4. Set the selected file count.
      this.imageUploaded.emit(this.images); // 5. Emit the images array to parent component.
      console.log('TODO: CLEANUP >> imagesDeleted[]: ', this.imagesDeleted);
    }
  }

  manageFileCount(counter: number) {
    this.selectedFileCount = this.selectedFileCount + counter;
  }


  storageCleanup(images: any) {
    // Pass imagesDeleted[] on product save action.
    // Pass imagesAdded[]   on product cancle action.
    console.log(' #### Cleanup: Free storage for these images ####');
    images.forEach(image => {
      this.storage.ref(image.path).delete();
    });
  }

  cleanupOnSave() {
    this.storageCleanup(this.imagesDeleted);
  }

  cleanupOnDiscard() {
    this.storageCleanup(this.imagesAdded);
  }

  ngOnDestroy() {
    console.log('from ngOnDestroy');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
