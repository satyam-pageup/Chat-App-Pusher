export interface UserI{
    id: number;
    name: string;
    email: string;
    employeeType: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    departmentID: string;
    systemToken: string;
    departmentName: string;
    createdAt: string;
    updatedAt: string;
}

export interface IGetAllUser{
    city: string;
    country: string;
    departmentName: string;
    email: string;
    employeeName: string;
    employeeType: string;
    id: number;
    phone: string;
}
export class CGetAllUser{
    city: string = '';
    country: string = '';
    departmentName: string = '';
    email: string = '';
    employeeName: string = '';
    employeeType: string = '';
    id: number = -1;
    phone: string = '';
}