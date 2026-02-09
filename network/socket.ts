export interface SocketConfig {
  url: string;
  room: string;
}

export interface SocketClient {
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, payload: unknown) => void;
}

export const createSocketClient = (config: SocketConfig): SocketClient => {
  let connected = false;

  const connect = () => {
    connected = true;
    console.info(`[socket] connected to ${config.url} room ${config.room}`);
  };

  const disconnect = () => {
    connected = false;
    console.info("[socket] disconnected");
  };

  const emit = (event: string, payload: unknown) => {
    if (!connected) {
      console.warn("[socket] emit ignored, not connected", event);
      return;
    }
    console.info(`[socket] emit ${event}`, payload);
  };

  return {
    connect,
    disconnect,
    emit,
  };
};
