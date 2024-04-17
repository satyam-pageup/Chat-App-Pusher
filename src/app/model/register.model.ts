import { FormControl } from "@angular/forms"

export interface RegisterModelI {
    name: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    employeeType:FormControl<number | null>;
    address: FormControl<string | null>;
    city: FormControl<string | null>;
    country: FormControl<string | null>;
    phone: FormControl<string | null>;
    departmentID: FormControl<number | null>;
}

export interface RegisterDataI{
    name: string | null;
    email: string | null;
    password: string | null;
    employeeType:number | null;
    address: string | null;
    city: string | null;
    country: string | null;
    phone: string | null;
    departmentID: number | null;
}