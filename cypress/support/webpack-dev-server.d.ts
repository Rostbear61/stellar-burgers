declare global {
  interface Window {
    __webpack_dev_server_client__?: {
      overlay: {
        sendStats: (stats: any) => void;
        close: () => void;
      };
    };
  }
}

export {};