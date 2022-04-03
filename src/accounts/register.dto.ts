export interface RegisterDTO {
    email:string;
    password: string;
    name:string;
    phone:string; 
    selectedPlan:string;
    selectedLocation:string;
  }

export interface LoginDTO {
  email: string;
  password: string;
}
