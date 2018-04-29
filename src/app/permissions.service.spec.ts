import {inject, TestBed} from '@angular/core/testing';

jest.mock('./users.service');
jest.mock('./logging.service');
jest.mock('@angular/common/http');

import {PermissionsService} from './permissions.service';
import {UsersService} from './users.service';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs/observable/of';
import {LoggingService} from './logging.service';
import {cold} from 'jest-marbles';

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
  let logger;
  let logInfo$;
  let logError$;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionsService, UsersService, HttpClient, LoggingService]
    });
  });

  beforeEach(
    inject([PermissionsService, UsersService, LoggingService, HttpClient], (_permissions, _usersMock, _logger, _httpMock) => {
      permissions = _permissions;
      usersMock = _usersMock;
      httpMock = _httpMock;
      logger = _logger;
    })
  );

  function mockLogger() {
    logger.info.mockReset();
    logger.error.mockReset();
    logInfo$ = cold('-i-|');
    logError$ = cold('-e-|');
    logger.info.mockReturnValue(logInfo$);
    logger.error.mockReturnValue(logError$);
  }

  function mockHttpPost() {
    httpMock.post.mockReset();
    httpMock.post.mockReturnValueOnce(of(httpResponse1)).mockReturnValueOnce(of(httpResponse2));
  }

  function mockUsers() {
    usersMock.getUserIds.mockReset();
    usersMock.getUserIds.mockReturnValue(cold('--u-|', {u: users}));
  }

  beforeEach(() => {
    mockHttpPost();
    mockLogger();
    mockUsers();
  });

  it('Should create http post request to get permissions for each user', () => {
    permissions.getAllUsersPermissions().subscribe(() => {
      expect(httpMock.post).toHaveBeenCalledTimes(2);
      for (const user of users) {
        expect(httpMock.post).toHaveBeenCalledWith('https://httpbin.org/post', {userId: user, permissions: expect.any(Array)});
      }
    });
  });

  it('Should get users from UsersService', () => {
    permissions.getAllUsersPermissions().subscribe(() => {
      expect(usersMock.getUserIds).toHaveBeenCalledTimes(1);
    });
  });

  it('Should return mapping from user ids to permissions', () => {
    // --p
    //   -i-|
    // ---r-|
    const expected = cold('---r-|', {
      r: {
        1: ['blah1', 'blah2'],
        2: ['blah3']
      }
    });
    expect(permissions.getAllUsersPermissions()).toBeObservable(expected);
  });

  it('Should log error if failed to get permissions', () => {
    httpMock.post.mockReset();
    httpMock.post.mockReturnValueOnce(cold('-#')).mockReturnValueOnce(cold('----p|', {p: httpResponse1}));

    // --u
    //   -#
    //    -e-|
    // ---^--!
    permissions.getAllUsersPermissions().subscribe(() => {
      expect(logError$).toHaveSubscriptions('---^--!');
    });
  });

  it('Should log error if failed to get users', () => {
    usersMock.getUserIds.mockReset();
    usersMock.getUserIds.mockReturnValue(cold('--#'));

    // --#
    //   -e-|
    // --^--!
    permissions.getAllUsersPermissions().subscribe(() => {
      expect(logError$).toHaveSubscriptions('--^--!');
    });
  });

  it('Should log success after successful retrieval of permissions', () => {
    // --u
    //   x
    //   y
    //   -i-|
    permissions.getAllUsersPermissions().subscribe(() => {
      expect(logInfo$).toHaveSubscriptions('--^--!');
    });

  });

  it('Should send permission requests for all the users in parallel', () => {
    httpMock.post.mockReset();
    const user1Permission$ = cold('----p|', {p: httpResponse1});
    const user2Permission$ = cold('--p|', {p: httpResponse2});
    // --u
    //   ----p|
    //   --p|
    //       -i-|
    // --^----!
    // --^--!
    httpMock.post.mockReturnValueOnce(user1Permission$).mockReturnValueOnce(user2Permission$);
    permissions.getAllUsersPermissions().subscribe(() => {
      expect(user1Permission$).toHaveSubscriptions('--^----!');
      expect(user2Permission$).toHaveSubscriptions('--^--!');
    });
  });
});
