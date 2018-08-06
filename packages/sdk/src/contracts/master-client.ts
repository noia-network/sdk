export interface FileData {
    src: string;
    // infoHash: string;
    // originalSource?: string;
}

export interface Location {
    latitude: string;
    longitude: string;
    country: string;
    city: string;
}

export interface Client {
    ip: string;
    infoHash: string;
    originalSource: string;
    location: Location;
}

export interface TorrentData {
    infoHash: string;
    name: string;
    urlList: string[];
    files: File[];
    length: number;
    pieceLength: number;
    lastPieceLength: number;
    pieces: string[];
}

export interface MasterResponse {
    src: string;
    peers: { [peer: string]: string };
    torrent: TorrentData;
    client: Client;
    // tslint:disable-next-line:no-any
    nl: any;
    settings: MasterResponseSettings;
}

export interface MasterResponseSettings {
    proxyControlAddress: string;
}
