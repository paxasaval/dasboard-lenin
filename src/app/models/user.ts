export interface User{
  name?: string,
  rol?: string,
  mail?:string,
  uid?: string,
}
export interface UserId extends User{id:string}
