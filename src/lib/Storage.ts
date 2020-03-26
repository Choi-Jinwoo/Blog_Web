export class Token {

  static getToken() {
    return sessionStorage.getItem('x-access-token');
  };

  static setToken(token: string) {
    sessionStorage.setItem('x-access-token', token);
  };

  static removeToken() {
    sessionStorage.removeItem('x-access-token');
  }

  static getSavedToken() {
    return localStorage.getItem('x-access-token');
  };

  static setSavedToken(token: string) {
    localStorage.setItem('x-access-token', token);
  };

  static removeSavedToken() {
    localStorage.removeItem('x-access-token');
  }
};
