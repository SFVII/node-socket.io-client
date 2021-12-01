/***********************************************************
 **  @project
 **  @file
 **  @author Brice Daupiard <brice.daupiard@nowbrains.com>
 **  @Date 01/12/2021
 **  @Description
 ***********************************************************/
declare module "rxjs";

export type Transport = "pooling" | "websocket";
export type Transports = Array<Transport>;

export interface SocketConfig {
  path?: string; // default = '/socket.io'
  reconnection?: boolean; // default true
  reconnectionAttempts?: number; // default Infinity
  reconnectionDelay?: number; // default 1000
  reconnectionDelayMax?: number; // default 5000
  randomizationFactor?: number; // default 0.5,
  timeout?: number; // default 20000,
  autoConnect?: boolean; // default true,
  query?: any; // default {}
  url?: any;
  auth?: boolean;
  extraHeaders?: any; // default {}
  transports?: Transports;
  transportOptions?: any;
}
