/***********************************************************
 **  @project
 **  @file
 **  @author Brice Daupiard <brice.daupiard@nowbrains.com>
 **  @Date 01/12/2021
 **  @Description
 ***********************************************************/
declare module "rxjs";
export declare type Transport = "pooling" | "websocket";
export declare type Transports = Array<Transport>;
export interface SocketConfig {
    path?: string;
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
    reconnectionDelayMax?: number;
    randomizationFactor?: number;
    timeout?: number;
    autoConnect?: boolean;
    query?: any;
    url?: any;
    auth?: boolean;
    extraHeaders?: any;
    transports?: Transports;
    transportOptions?: any;
}
