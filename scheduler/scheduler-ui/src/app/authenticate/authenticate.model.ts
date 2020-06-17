//This will store the current logged in user and validates the user

export class User {

  private jwtToken: String;
  private userDetails: { sub: string, exp: number, iat: number };


  constructor(jwtToken: String) {
    this.jwtToken = jwtToken;
    this.userDetails = this.parseJwt(jwtToken);
  }

  private parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  get token():String{
  //  check if the token is valid if valid send the token else return null

    if(this.userDetails.exp == null || new Date()>new Date(this.userDetails.exp*10000)){
      return null ;
    }

    return  this.jwtToken;
  }

}
