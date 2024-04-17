export interface ResponseGI<L, R>{
    status: string;
    message: string;
    statusCode: string;
    L: R;
    token: string;
}
export interface ResponseDataI<T>{
    status: string;
    message: string;
    statusCode: string;
    data: T;
    token: string;
}
export interface GetLoggedInUserDetailI<T>{
    status: string;
    message: string;
    statusCode: string;
    data: T
}

export interface ResponseIterableI<R>{
    status: string;
    message: string;
    statusCode: string;
    iterableData: R;
    token: string;
}
export interface GetMessageI<R>{
    status: string;
    message: string;
    statusCode: string;
    data: {
        data:R,
        systemToken: string;
        isBlockedUser:boolean;

    };
}