export interface IUser {
  //for rider and book keeper
  username?: string;
  //for company
  email?: string;
  password: string;
  role: "COMPANY" | "RIDER" | "DISTRIBUTOR" | "ADMIN" | "BOOKKEEPER";
}
