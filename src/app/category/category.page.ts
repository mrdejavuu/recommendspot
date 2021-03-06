import { Component, OnInit,ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { Platform, IonContent } from '@ionic/angular'; 

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
	categorytab: string = "category";
	isAndroid: boolean = false;
	categories: any;
	users: any;
	user_name: any;
	user_image: any;
	user_email: any;
 	user_id: any;
 	IMAGES_URL: any = config.IMAGES_URL;
	errors = config.errors;
  counter = 0;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  noti_count = localStorage.getItem('notiCount');
 
	constructor(private ref: ChangeDetectorRef,public apiService: ApiserviceService, public router: Router, public location: Location, private globalFooService: GlobalFooService){ 

  		this.user_name = localStorage.getItem('user_name');
    	this.user_image = localStorage.getItem('user_image');
    	this.user_email = localStorage.getItem('user_email');
    	this.user_id = localStorage.getItem('userId');
    	var self = this;
  		this.globalFooService.getObservable().subscribe((data) => {
          console.log('Data received', data);
          this.user_name = localStorage.getItem('user_name');
          this.user_image = localStorage.getItem('user_image');
          this.user_email = localStorage.getItem('user_email');
          this.user_id = localStorage.getItem('userId');

      });
      //this.ref.detectChanges(); 

	}

	ngOnInit() {

		  this.ref.detectChanges(); 
	}
  gotohome(){
    this.router.navigate(['/tabs/home'])
  }

  ngOnDestroy(){
    // alert('leaveccc');
    this.apiService.stopLoading();
   
  }

  gotofollowing(){
    var user_id = localStorage.getItem('userId');
    localStorage.setItem('clickUserId' , user_id)
  }

  gotToTop() {
    this.content.scrollToTop(1000);
  }

  onSegmentChange(e){
    this.ref.detectChanges(); 
    this.apiService.stopLoading();
    console.log('event = ', e.detail.value);
    this.categorytab = e.detail.value;
    this.getUsers();

    //this.ref.detectChanges();
  }

	getimage(img){
		if(this.errors.indexOf(img) == -1){
		if(img.includes('https') == true){
		  			return true;
		  		}else{
		  			return false;
		  		}
		}else{
			return false;
		}
	}

	ionViewDidEnter() {
    this.noti_count = localStorage.getItem('notiCount');
		this.getCategories();
	}

	getCategories(){

		this.apiService.presentLoading();
		var dict = {
    	user_id: localStorage.getItem('userId')
    }
  
    this.apiService.postData(dict,'categories').subscribe((result) => { 
     this.ref.detectChanges();
     console.log(result.data)
      if(result.status == 1){
        this.categories = result.data;
        this.ref.detectChanges(); 	        
       this.getUsers();
      }
      else{
        this.apiService.presentToast('Error while sending request,Please try after some time','success');
      }
      this.apiService.stopLoading(); 
      this.ref.detectChanges(); 
    },
    err => {
        this.apiService.presentToast('Technical error,Please try after some time','danger');
        this.apiService.stopLoading(); 
    });
	}

	follow_unfollow_cat(cat, status, index){
		this.apiService.presentLoading();
		var dict = {
    	user_id: localStorage.getItem('userId'),
    	cat_id: cat._id,
    	follow_status: status
    }
  
    this.apiService.postData(dict,'followUnfollowCategory').subscribe((result) => { 
     this.apiService.stopLoading();
     this.ref.detectChanges();  
     console.log(result.data)
      if(result.status == 1){
        this.categories[index].cat_follow = parseInt(status);	        
       this.apiService.presentToast(result.error,'success');
       localStorage.setItem('first_login', 'true');
       this.globalFooService.publishSomeData({
            foo: {'data': '', 'page': 'updateprofile'}
        });
      }
      else{
        this.apiService.presentToast('Error while sending request,Please try after some time','danger');
        this.apiService.stopLoading(); 
      }
    },
    err => {
        this.apiService.presentToast('Technical error,Please try after some time','success');
        this.apiService.stopLoading(); 
    });
	}


	follow_unfollow_sub_cat(sub_cat, status, index, sub_index){
		this.apiService.presentLoading();
		var dict = {
    	user_id: localStorage.getItem('userId'),
    	sub_cat_id: sub_cat._id,
    	follow_status: status
    }
  
    this.apiService.postData(dict,'followUnfollowSubCategory').subscribe((result) => { 
     this.apiService.stopLoading();  
     this.ref.detectChanges();
     console.log(result.data)
      if(result.status == 1){
        this.categories[index].sub_cat[sub_index].sub_cat_follow = parseInt(status);	  
        localStorage.setItem('first_login', 'true');
        this.globalFooService.publishSomeData({
            foo: {'data': '', 'page': 'updateprofile'}
        });      
        this.apiService.presentToast(result.error,'success');
      }
      else{
        this.apiService.presentToast('Error while sending request,Please try after some time','danger');
        this.apiService.stopLoading(); 
      }
    },
    err => {
        this.apiService.presentToast('Technical error,Please try after some time','success');
        this.apiService.stopLoading(); 
    });
	}

  viewUser(item){

    //localStorage.setItem('item', JSON.stringify(item));
    localStorage.setItem('clicked_user_id', item._id);
    localStorage.setItem('add_user_type', 'user');
    this.router.navigate(['/user-profile'])
  }
  	
	getUsers(){

		this.apiService.presentLoading();
		var dict = {
    	_id: localStorage.getItem('userId')
    }
  
    this.apiService.postData(dict,'usersListWeb').subscribe((result) => { 
     this.apiService.stopLoading();  
     this.ref.detectChanges();
     console.log(result.data)
      if(result.status == 1){
        this.users = result.data;
      }
      else{
        this.apiService.presentToast('Error while sending request,Please try after some time','success');
        this.apiService.stopLoading(); 
      }
      this.ref.detectChanges();
    },
    err => {
        this.apiService.presentToast('Technical error,Please try after some time','success');
        this.apiService.stopLoading(); 
    });
	}

	follow_unfollow_user(user, status, index)
  {	
  	var str;
  	if(status == '0'){
  		str = 'removeFriend';
  	}else{
  		str = 'addFriend';
  	}

  	let dict = {
      userId: localStorage.getItem('userId'),
      friendId: user._id,
    };
  	this.apiService.presentLoading();
    	this.apiService.postData(dict,str).subscribe((result) => {
      this.apiService.stopLoading();
      
      console.log(result)
      if(result.status == 1)
      {
        this.users[index].isFriend = parseInt(status);

        this.globalFooService.publishSomeData({
          foo: {'data': status, 'page': 'add-post'}
        });
        this.apiService.presentToast( result.error,'success');
      }
      else
      {
        this.apiService.presentToast('Technical error,Please try after some time.','danger');
        this.apiService.stopLoading(); 
      }
      this.ref.detectChanges();
    },
    err => {
      this.apiService.stopLoading();
        this.apiService.presentToast('Technical error,Please try after some time.','danger');
        this.apiService.stopLoading(); 
    });
  }

  logout(){
    var categoryCheck = JSON.parse(localStorage.getItem('categoriesCheck'));
    var lat = localStorage.getItem('lat');
    var lng = localStorage.getItem('long');
    localStorage.clear();

    localStorage.setItem('lat', lat);
    localStorage.setItem('long', lng);
    localStorage.setItem('categoriesCheck', JSON.stringify(categoryCheck));
    this.router.navigate(['/landing-page']);
  }

}
