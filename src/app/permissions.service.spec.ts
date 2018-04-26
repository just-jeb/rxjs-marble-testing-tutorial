import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';

import {PermissionsService} from './permissions.service';
jest.mock('./users.service');
import {UsersService} from './users.service';

describe('PermissionsService', () => {
  let permissions;
  let usersMock;
  let httpMock;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PermissionsService, UsersService]
    });
  });

  beforeEach(
    inject([PermissionsService, UsersService, HttpTestingController], (_permissions, _usersMock, _httpMock) => {
      permissions = _permissions;
      usersMock = _usersMock;
      httpMock = _httpMock;
    }));

  it('should be created', () => {
    expect(permissions).toBeTruthy();
    expect(usersMock).toBeTruthy();
    expect(httpMock).toBeTruthy();
  });
});
