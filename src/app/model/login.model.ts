import { FormControl } from "@angular/forms";

export interface LoginModelI{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
}
export interface LoginDataI{
    email: string | null;
    password: string | null;
}
