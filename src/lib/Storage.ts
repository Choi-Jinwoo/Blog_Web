export class Token {

  static getToken() {
    return sessionStorage.getItem('x-access-token');
  };

  static setToken(token: string) {
    sessionStorage.setItem('x-access-token', token);
  };

  static getSavedToken() {
    return localStorage.getItem('x-access-token');
  };

  static setSaedToken(token: string) {
    localStorage.setItem('x-access-token', token);
  };
};
