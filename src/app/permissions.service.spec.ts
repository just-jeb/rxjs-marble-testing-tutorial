import { inject, TestBed } from '@angular/core/testing';

import { PermissionsService } from './permissions.service';
import { UsersService } from './users.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { LoggingService } from './logging.service';

jest.mock('./users.service');
jest.mock('./logging.service');
jest.mock('@angular/common/http');

const httpResponse1 = {
  data: JSON.stringify({
    permissions: ['blah1', 'blah2']
  })
};

const httpResponse2 = {
  data: JSON.stringify({
    permissions: ['blah3']
  })
};

const users = ['1', '2'];

describe('PermissionsService.getAllUsersPermissions', () => {
  let permissions;
  let usersMock;
  let httpMock;
  let loggerMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionsService, UsersService, HttpClient, LoggingService]
    });
  });

  beforeEach(inject(
    [PermissionsService, UsersService, LoggingService, HttpClient],
    (permissionsInstance, usersMockIntance, loggerMockInstance, httpMockInstance) => {
      permissions = permissionsInstance;
      usersMock = usersMockIntance;
      httpMock = httpMockInstance;
      loggerMock = loggerMockInstance;
    }
  ));

  beforeEach(() => {
    httpMock.post.mockClear();
    httpMock.post
      .mockReturnValueOnce(of(httpResponse1))
      .mockReturnValueOnce(of(httpResponse2));
    usersMock.getUserIds.mockClear();
    usersMock.getUserIds.mockReturnValue(of(users));
    loggerMock.info.mockClear();
    loggerMock.info.mockReturnValue(of({}));
    loggerMock.error.mockClear();
    loggerMock.error.mockReturnValue(of({}));
  });

  it('Should create http post request to get permissions for each user', () => {
    permissions.getAllUsersPermissions().subscribe(() => {
      expect(httpMock.post).toHaveBeenCalledTimes(2);
      for (const user of users) {
        expect(httpMock.post).toHaveBeenCalledWith('https://httpbin.org/post', {
          userId: user,
          permissions: expect.any(Array)
        });
      }
    });
  });

  it('Should get users from UsersService', () => {
    permissions.getAllUsersPermissions().subscribe(() => {
      expect(usersMock.getUserIds).toHaveBeenCalledTimes(1);
    });
  });

  it('Should return mapping from user ids to permissions', () => {
    permissions.getAllUsersPermissions().subscribe(result => {
      expect(result).toEqual({
        1: ['blah1', 'blah2'],
        2: ['blah3']
      });
    });
  });

  it('Should log error if failed to get permissions', () => {
    httpMock.post.mockReset();
    httpMock.post
      .mockReturnValueOnce(throwError('Error'))
      .mockReturnValueOnce(of(httpResponse2));
    permissions.getAllUsersPermissions().subscribe(() => {
      expect(loggerMock.error).toHaveBeenCalledTimes(1);
    });
  });

  it('Should log error if failed to get users', () => {
    usersMock.getUserIds.mockReset();
    usersMock.getUserIds.mockReturnValue(throwError('Error'));
    permissions.getAllUsersPermissions().subscribe(() => {
      expect(loggerMock.error).toHaveBeenCalledTimes(1);
    });
  });

  it('Should log success after successful retrieval of permissions', () => {
    // TODO: implement
    expect(false).toBeTruthy();
  });

  it('Should send permission requests for all the users in parallel', () => {
    // TODO: implement
    expect(false).toBeTruthy();
  });
});
