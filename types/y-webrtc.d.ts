declare module "y-webrtc" {
  import * as Y from "yjs";
  export class WebrtcProvider {
    constructor(
      roomName: string,
      doc: Y.Doc,
      opts?: {
        signaling?: string[];
        password?: string;
        awareness?: any;
        maxConns?: number;
        filterBcConns?: boolean;
        peerOpts?: any;
      }
    );
    on(event: "status", cb: (event: { status: "connected" | "disconnected" }) => void): void;
    disconnect(): void;
    destroy(): void;
  }
}
