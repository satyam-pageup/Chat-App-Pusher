export interface MessaageResponse{
    collapseKey:string|undefined;
    from:string;
    messageId:string;
    notification:{
        id:number;
        title:string;
        body:string;
    }
}