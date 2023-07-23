import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LendingPoolsComponent } from './lendingPools.component';

describe('LendingPoolsComponent', () => {
  let component: LendingPoolsComponent;
  let fixture: ComponentFixture<LendingPoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LendingPoolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LendingPoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
