import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SavedPostsPage } from './saved-posts.page';

describe('SavedPostsPage', () => {
  let component: SavedPostsPage;
  let fixture: ComponentFixture<SavedPostsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedPostsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SavedPostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
