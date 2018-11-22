export const enum ConnectionType {
    WebRtc = "webrtc",
    Wss = "wss",
    Ws = "ws"
}

export interface MasterRequest extends NoiaRequest {
    connectionTypes: ConnectionType[];
}

export interface MasterResponse<TData extends {} = MasterData> {
    data: TData;
    status: number;
}

export interface Metadata {
    bufferLength: number;
    contentId: string;
    pieceBufferLength: number;
    piecesIntegrity: string[];
}

export interface Location {
    city: string;
    countryCode: string;
    latitude: number;
    longitude: number;
}

export interface Ports {
    webrtc: number | null;
    ws: number | null;
    wss: number | null;
}

export interface Peer {
    host: string;
    location: Location;
    ports: Ports;
    secretKey: string | null;
}

export interface Settings {
    proxyControlAddress: string;
}

export interface MasterData {
    metadata: Metadata;
    peers: Peer[];
    settings: Settings;
    src: string;
}

export interface NoiaRequest {
    src: string;
}

export interface FileData {
    src: string;
    // infoHash: string;
    // originalSource?: string;
}
