export interface IGroupResponse<CG, ID>{
    status: string;
    message: string;
    statusCode: string;
    chatGroup: CG;
    iterableData: ID;
    count: number;
}

export interface IGroupChatResponse{
    id:number;
    employeeName: string;
    email: string;
    city: string;
    country: string;
    phone: string;
    employeeType: string;
    departmentName: string;
}

// export interface IGroupChat{
//     id: number;
//     groupName: string;
//     employeeIds: Array<number>;
//     admins: Array<number>;
// }

export class CGroupChat{
    id: number = -1;
    groupName: string = '';
    employeeIds: Array<number> = [];
    admins: Array<number> = [];
}
