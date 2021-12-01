/***********************************************************
 **  @project
 **  @file
 **  @author Brice Daupiard <brice.daupiard@nowbrains.com>
 **  @Date 01/12/2021
 **  @Description
 ***********************************************************/
import { SocketConfig, Transports } from "./types/socketWrapper";
import { BehaviorSubject, Observable } from "rxjs";
export declare const DefaultSocketConfig: {
    url: string;
    path: string;
    reconnection: boolean;
    reconnectionAttempts: number;
    reconnectionDelay: number;
    reconnectionDelayMax: number;
    randomizationFactor: number;
    timeout: number;
    autoConnect: boolean;
    query: {};
    transports: Transports;
    extraHeaders: {};
};
export declare class SocketWrapper {
    private Config;
    tokenUpdater: BehaviorSubject<string | null>;
    socket: any;
    url: string;
    auth: boolean | undefined;
    private subscribersCounter;
    private roomList;
    private readonly SocketConfig;
    constructor(Config: SocketConfig);
    unsubscribe(name: string): Promise<void>;
    unsubscribeAll(): Promise<void>;
    subscribe(name: string): Promise<void>;
    of(namespace: string): void;
    on(eventName: string, callback: (data: any) => void): void;
    once(eventName: string, callback: (data: any) => void): void;
    connect(): import("socket.io-client").Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
    disconnect(close?: any): any;
    emit(eventName: string, data?: any, callback?: (data: any) => void): any;
    removeListener(eventName: string, callback?: () => void): any;
    removeAllListeners(eventName?: string): any;
    fromEvent<T>(eventName: string): Observable<any>;
    fromOneTimeEvent<T>(eventName: string): Promise<any>;
    private onReconnect;
}
export default SocketWrapper;
export { SocketConfig, Transports };
