declare namespace Express {
    interface Header {
        authorization: string
    }

    export interface Request {
       header: Header
    }
 }