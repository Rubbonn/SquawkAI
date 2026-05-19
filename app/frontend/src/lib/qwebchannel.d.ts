export interface QWebChannelTransport {
  send: (message: string | object) => void;
  onmessage?: (message: { data: string | object }) => void;
}

export interface QWebChannelConverter {
  (response: any): any;
}

// Interfaccia per il tipo dell'istanza (quello che ricevi nel callback)
export interface QWebChannelInstance {
  transport: QWebChannelTransport;
  objects: { [id: string]: any };
  usedConverters: QWebChannelConverter[];
  send(data: string | object): void;
  addConverter(converter: QWebChannelConverter | string): void;
  exec(data: object, callback?: (response: any) => void): void;
  debug(message: string): void;
}

export interface QWebChannelInitCallback {
  (channel: QWebChannelInstance): void;
}

export declare class QWebChannel {
  transport: QWebChannelTransport;
  objects: { [id: string]: any };
  usedConverters: QWebChannelConverter[];

  constructor(
    transport: QWebChannelTransport,
    initCallback?: QWebChannelInitCallback,
    converters?: QWebChannelConverter[] | QWebChannelConverter | string
  );

  send(data: string | object): void;
  addConverter(converter: QWebChannelConverter | string): void;
  exec(data: object, callback?: (response: any) => void): void;
  debug(message: string): void;
}