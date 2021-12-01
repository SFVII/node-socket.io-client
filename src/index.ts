/***********************************************************
 **  @project
 **  @file
 **  @author Brice Daupiard <brice.daupiard@nowbrains.com>
 **  @Date 01/12/2021
 **  @Description
 ***********************************************************/

import io from "socket.io-client";
import { EventEmitter } from "events";
import { SocketConfig, Transports } from "./types/socketWrapper";
import { Observable, share } from "rxjs";

export const DefaultSocketConfig = {
  url: "",
  path: "/socket.io",
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 20000,
  autoConnect: true,
  query: {},
  transports: ["polling", "websocket"] as Transports,
  extraHeaders: {},
};

export class SocketWrapper {
  public tokenUpdater: Observable<string> = new Observable();
  public socket: any;
  public url: string;
  public auth: boolean | undefined;
  private subscribersCounter: number = 0;
  private roomList: string[] = [];
  private readonly SocketConfig: SocketConfig = DefaultSocketConfig;

  constructor(private Config: SocketConfig) {
    if (Config) {
      this.Config = Config;
      this.SocketConfig = Config;
    }

    this.url = !Config || (Config && !Config.url) ? "" : Config.url;
    this.socket = this.connect();
    if ((Config && !Config.auth) || !Config) {
      this.onReconnect();
    } else {
      this.tokenUpdater.subscribe((token: string) => {
        if (this.socket) {
          this.disconnect();
        }
        if (token) {
          if (!this.SocketConfig.extraHeaders) {
            this.SocketConfig.extraHeaders = {};
          }
          if (!this.SocketConfig.transportOptions) {
            this.SocketConfig.transportOptions = {};
          }
          // @ts-ignore
          for (let en of this.SocketConfig.transports) {
            this.SocketConfig.transportOptions[en] = {
              extraHeaders: {
                Authorization: `Baerer ${token}`,
              },
            };
          }
          this.SocketConfig.extraHeaders.Authorization = `Baerer ${token}`;
          this.SocketConfig.query.token = `${token}`;
          this.socket = this.connect();
          this.onReconnect();
        }
      });
    }
  }

  async unsubscribe(name: string) {
    this.socket.emit("unsubscribe", name);
    const index = this.roomList.findIndex((room: string) => room === name);
    if (index > -1) {
      this.roomList.splice(index, 1);
      console.log("unsubscribe room %s", name);
    } else {
      console.log("no joined room");
    }
  }

  async unsubscribeAll() {
    if (this.roomList.length) {
      this.roomList.forEach((room: string) => {
        this.unsubscribe(room);
      });
    }
  }

  async subscribe(name: string) {
    if (this.roomList.indexOf(name) > -1) {
      await this.unsubscribe(name);
    }
    if (this.roomList.indexOf(name) === -1) {
      this.roomList.push(name);
    }
    console.log("subscribe room %s", name);
    await this.socket.emit("subscribe", name);
  }

  of(namespace: string): void {
    this.socket.of(namespace);
  }

  on(eventName: string, callback: (data: any) => void): void {
    this.socket.on(eventName, callback);
  }

  once(eventName: string, callback: (data: any) => void): void {
    this.socket.once(eventName, callback);
  }

  connect() {
    console.log("Config", this.SocketConfig);
    const ioSocket = (io as any).default ? (io as any).default : io;
    return ioSocket(this.url, this.SocketConfig).connect();
  }

  disconnect(close?: any): any {
    return this.socket.disconnect.apply(this.socket, arguments);
  }

  emit(eventName: string, data?: any, callback?: (data: any) => void): any {
    this.socket.emit(eventName, data, callback);
  }

  removeListener(eventName: string, callback?: () => void): any {
    return this.socket.removeListener.apply(this.socket, arguments);
  }

  removeAllListeners(eventName?: string): any {
    return this.socket.removeAllListeners.apply(this.socket, arguments);
  }

  fromEvent<T>(eventName: string): Observable<any> {
    this.subscribersCounter++;
    return new Observable((observer: any) => {
      this.socket.on(eventName, (data: any) => {
        observer.next(data);
      });
      return () => {
        if (this.subscribersCounter === 1) {
          this.socket.removeListener(eventName);
        }
      };
    }).pipe(share());
  }

  fromOneTimeEvent<T>(eventName: string): Promise<any> {
    return new Promise((resolve) => this.once(eventName, resolve));
  }

  private onReconnect() {
    if (this.socket) {
      this.socket.on("reconnect", () => {
        if (this.roomList && this.roomList.length) {
          this.roomList.forEach((name: string) => {
            this.subscribe(name).catch((err: any) =>
              console.log("error socket reconnect", err)
            );
          });
        } else {
          console.log("room is empty");
        }
      });
    } else {
      console.log("socket does not exist");
    }
  }

  private redirectLogin(loginPage: string) {
    if (this.socket && loginPage) {
      this.socket.on("session-time-out", (msg: any) => {
        console.log("session-time-out");
      });
    }
  }
}
