export class User {
    id: number;
    email: string;
    fullname: string;
    address: string;
    status: boolean;
    role: string;
    constructor(id: number, email: string, fullname: string, address: string, status: boolean, role: string) {
      this.id = id;
      this.email = email;
      this.fullname = fullname;
      this.address = address;
      this.status = status;
      this.role = role;
    }
  }
  