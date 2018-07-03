import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { DialogService } from '../../core/dialog.service';
import { AppUser, Fooditem, IGeoInfo } from '../../core/models';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {

  @ViewChild('upload') upload;

  fooditem: Fooditem;
  tempFooditem: Fooditem;
  productForm: FormGroup;

  isNewFooditem: boolean;
  canNavigateAway: boolean;
  imageUploadCompleted: boolean;
  addressFormCompleted: boolean;

  currentAppUser: AppUser;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private auth: AuthService,
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    this.imageUploadCompleted = false;
    this.canNavigateAway = false;

    this.currentAppUser = this.auth.currAppUser;

    this.createForm();

    this.addressFormCompleted = !!this.productForm.get('addressForm').status;

    this.productForm.get('addressForm.coordinates').disable();
  }

  ngOnInit() {
    this.fooditem = this.route.snapshot.data['product'];

    if (this.fooditem) {
      console.log('ngOnInit: Modify fooditem.');
      this.isNewFooditem = false;
      this.imageUploadCompleted = true;
      this.tempFooditem = this.fooditem;
      this.rebuildProductForm(this.tempFooditem);
    } else {
      console.log('ngOnInit: Create New fooditem.');
      this.isNewFooditem = true;
      this.imageUploadCompleted = false;
      // Initialize new fooditem.
      this.tempFooditem = {
        id: this.dataService.getFirebaseDocumentKey(),
        createdBy: {id: this.currentAppUser.uid, name: this.currentAppUser.displayName, photoUrl: this.currentAppUser.photoURL},
        images: [],
        availability: [],
        geoInfo: {},
        createdAt: new Date()
      };
    }
  }

  createForm() {
    // User input values
    this.productForm = this.fb.group({
      form1: this.fb.group({
        title: ['', Validators.required],
        description: '',
        price: [0.0, Validators.required],
        serving: [1, Validators.required],
        isNonVeg: [true, Validators.required],
        category: ['', Validators.required],
        cuisine: ['', Validators.required],
        cashOnDelivery: [true, Validators.required],
        onlinePayment: [false, Validators.required],
      }),

      form2: this.fb.group({
        orderType: ['instant', Validators.required],
        orderTime: ['30', Validators.required],
        availability: [['All Days'], Validators.required],
        takeAway: [true, Validators.required],
        homeDelivery: [false, Validators.required],
        dineIn: [false, Validators.required],
      }),

      addressForm: this.fb.group({
        autoAddressFromMap: ['', Validators.required],
        addressFromUser: ['', Validators.required],
        coordinates: ['']
      })
    });
  }


  prepareFooditem(fooditem: Fooditem, fooditemForm: FormGroup): Fooditem {
    console.log('#### From prepareFooditem ####');

    // 1. User input: urls from image upload component
    // imagesFromImageUpload(images)

    // 2. User input: Formdata (form1)
    fooditem.title = fooditemForm.get('form1.title').value;
    fooditem.description = fooditemForm.get('form1.description').value;
    fooditem.isNonVeg = fooditemForm.get('form1.isNonVeg').value;
    fooditem.price = fooditemForm.get('form1.price').value;
    fooditem.serving = fooditemForm.get('form1.serving').value;
    fooditem.category = fooditemForm.get('form1.category').value;
    fooditem.cuisine = fooditemForm.get('form1.cuisine').value;
    fooditem.cashOnDelivery = fooditemForm.get('form1.cashOnDelivery').value;
    fooditem.onlinePayment = fooditemForm.get('form1.onlinePayment').value;

    // 3. User input: Formdata (form2)
    fooditem.orderType = fooditemForm.get('form2.orderType').value;
    fooditem.orderTime = fooditemForm.get('form2.orderTime').value;
    fooditem.availability = fooditemForm.get('form2.availability').value;
    fooditem.takeAway = fooditemForm.get('form2.takeAway').value;
    fooditem.homeDelivery = fooditemForm.get('form2.homeDelivery').value;
    fooditem.dineIn = fooditemForm.get('form2.dineIn').value;

    // 4. User input: Formdata (addressForm)
    fooditem.geoInfo.autoAddressFromMap = fooditemForm.get('addressForm.autoAddressFromMap').value;
    fooditem.geoInfo.addressFromUser = fooditemForm.get('addressForm.addressFromUser').value;
    fooditem.geoInfo.coordinates = fooditemForm.get('addressForm.coordinates').value;

    // 5. Add a timestamp
    fooditem.createdAt = new Date();

    return fooditem;

  }


  rebuildProductForm(fooditem: Fooditem): Fooditem {
    console.log('Populating productForm with input fooditem data.', fooditem);

    Object.keys(this.productForm.get('form1').value).forEach(item => {
      // if (this.productForm.get(`form1.${item}`)) {
      //   this.productForm.get(`form1.${item}`).patchValue(fooditem[item]);
      // }
      this.productForm.get(`form1.${item}`).patchValue(fooditem[item]);
    });

    Object.keys(this.productForm.get('form2').value).forEach(item => {
      // if (this.productForm.get(`form2.${item}`)) {
      //   this.productForm.get(`form2.${item}`).patchValue(fooditem[item]);
      // }
      this.productForm.get(`form2.${item}`).patchValue(fooditem[item]);
    });

    this.productForm.get('addressForm').patchValue({
      autoAddressFromMap: fooditem.geoInfo.autoAddressFromMap,
      addressFromUser: fooditem.geoInfo.addressFromUser,
      coordinates: fooditem.geoInfo.coordinates,
    });
    return fooditem;
  }

  imagesFromImageUpload(images) {
    if (images.length !== 0) {
      this.imageUploadCompleted = true;
      this.tempFooditem.images = images;
    } else {
      this.imageUploadCompleted = false;
      this.tempFooditem.images = images;
    }
    console.log('Images from ImageUpload: ', images);
  }


  createFooditem(fooditem: Fooditem) {
    console.log('Fooditem to be saved >>>> ', fooditem);
    this.dataService.createProduct(fooditem, fooditem.id).then(
      () => {
        if (!this.currentAppUser.geoInfo) {
          this.updateUserGeoInfo(this.currentAppUser.uid, fooditem.geoInfo);
        }
        this.canNavigateAway = true;
        this.router.navigate(['/']);
      },
    );
  }

  updateFooditem(fooditem: Fooditem) {
    this.dataService.updateProduct(fooditem).then(
      rep => {
        console.log('#### Fooditem updated successfully #### ', fooditem);
        this.canNavigateAway = true;
        this.router.navigate(['/']);
      });
  }

  updateUserGeoInfo(uid: string, geoInfo: IGeoInfo) {
    this.dataService.updateUserData(uid, { geoInfo: geoInfo });
  }


  // createOrUpdateProduct(fooditem: Fooditem) {
  createOrUpdateProduct() {
    if (this.productForm.status === 'VALID') {
      if (this.isNewFooditem) {
        console.log('Create New fooditem: ', this.tempFooditem);
        const newFooditem = this.prepareFooditem(this.tempFooditem, this.productForm);
        this.createFooditem(newFooditem);
      } else {
        console.log('Modify existing fooditem: ', this.tempFooditem);
        const modifiedFooditem = this.prepareFooditem(this.tempFooditem, this.productForm);
        this.updateFooditem(modifiedFooditem);
        // if (modifiedFooditem !== this.fooditem) {
        //   this.updateFooditem(modifiedFooditem);
        // } else {
        //   console.log('No changes made: Do not update ');
        //   this.canNavigateAway = true;
        //   this.router.navigate(['/']);
        // }
      }
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.canNavigateAway) {
      return this.dialogService.openDialog('Discard changes for this Product?');
    }
    return this.canNavigateAway;
  }

  ngOnDestroy() {
    if (!this.canNavigateAway) {
      console.log('this.canNavigateAway >>>>> ', this.canNavigateAway);
      this.upload.cleanupOnDiscard();
    } else {
      this.upload.cleanupOnSave();
      console.log('this.canNavigateAway >>>>> ', this.canNavigateAway);
    }
  }

}
