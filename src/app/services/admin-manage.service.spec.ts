import { TestBed } from '@angular/core/testing';

import { AdminManageService } from './admin-manage.service';

describe('AdminManageService', () => {
  let service: AdminManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
