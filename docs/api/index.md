# Table of contents

* [index.ts][SourceFile-0]
    * Interfaces
        * [Dictionary][InterfaceDeclaration-8]
        * [NoiaRequest][InterfaceDeclaration-9]
        * [NoiaPieceRequest][InterfaceDeclaration-16]
        * [FileInfo][InterfaceDeclaration-13]
        * [NoiaEmitter][InterfaceDeclaration-11]
        * [NoiaStreamDto][InterfaceDeclaration-10]
        * [NoiaClient][InterfaceDeclaration-17]
        * [NoiaPieceDto][InterfaceDeclaration-14]
        * [NoiaPieceStartDto][InterfaceDeclaration-15]
        * [NoiaClientEventMap][InterfaceDeclaration-12]
        * [PiecePromiseResolver][InterfaceDeclaration-5]

# index.ts

## Interfaces

### Dictionary

```typescript
interface Dictionary<TValue = any> {
    [key: string]: TValue;
}
```

**Type parameters**

| Name   | Default |
| ------ | ------- |
| TValue | any     |
#### Index

```typescript
[key: string]: TValue;
```

* *Parameter* `key` - string
* *Type* TValue


----------

### NoiaRequest

```typescript
interface NoiaRequest {
    src: string;
}
```

**Properties**

| Name | Type   | Optional |
| ---- | ------ | -------- |
| src  | string | false    |

----------

### NoiaPieceRequest

```typescript
interface NoiaPieceRequest extends NoiaRequest {
    pieceIndex: number;
}
```

**Extends**

[NoiaRequest][InterfaceDeclaration-9]

**Properties**

| Name       | Type   | Optional |
| ---------- | ------ | -------- |
| pieceIndex | number | false    |

----------

### FileInfo

```typescript
interface FileInfo {
    piecesCount: number;
    contentLength: number;
    pieceLength: number;
}
```

**Properties**

| Name          | Type   | Optional |
| ------------- | ------ | -------- |
| piecesCount   | number | false    |
| contentLength | number | false    |
| pieceLength   | number | false    |

----------

### NoiaEmitter

```typescript
interface NoiaEmitter {
    addListener<TKey extends keyof NoiaClientEventMap>(eventType: TKey, listener: (event: NoiaClientEventMap[TKey]) => void | Promise<void>): EventSubscription;
    fileInfo: Promise<FileInfo>;
}
```
#### Method

```typescript
addListener<TKey extends keyof NoiaClientEventMap>(eventType: TKey, listener: (event: NoiaClientEventMap[TKey]) => void | Promise<void>): EventSubscription;
```

**Type parameters**

| Name | Constraint                                          |
| ---- | --------------------------------------------------- |
| TKey | keyof [NoiaClientEventMap][InterfaceDeclaration-12] |

**Parameters**

| Name      | Type                                                           |
| --------- | -------------------------------------------------------------- |
| eventType | TKey                                                           |
| listener  | (event: NoiaClientEventMap[TKey]) => void &#124; Promise<void> |

**Return type**

EventSubscription


**Properties**

| Name     | Type                                         | Optional |
| -------- | -------------------------------------------- | -------- |
| fileInfo | Promise<[FileInfo][InterfaceDeclaration-13]> | false    |

----------

### NoiaStreamDto

```typescript
interface NoiaStreamDto {
    emitter: NoiaEmitter;
    start: () => void;
}
```

**Properties**

| Name    | Type                                   | Optional |
| ------- | -------------------------------------- | -------- |
| emitter | [NoiaEmitter][InterfaceDeclaration-11] | false    |
| start   | () => void                             | false    |

----------

### NoiaClient

```typescript
interface NoiaClient {
    download(dto: NoiaRequest): Promise<Buffer>;
    downloadPiece(dto: NoiaPieceRequest): Promise<Buffer>;
    stream(dto: NoiaRequest): NoiaStreamDto;
}
```
#### Method

```typescript
download(dto: NoiaRequest): Promise<Buffer>;
```

**Parameters**

| Name | Type                                  |
| ---- | ------------------------------------- |
| dto  | [NoiaRequest][InterfaceDeclaration-9] |

**Return type**

Promise<Buffer>

```typescript
downloadPiece(dto: NoiaPieceRequest): Promise<Buffer>;
```

**Parameters**

| Name | Type                                        |
| ---- | ------------------------------------------- |
| dto  | [NoiaPieceRequest][InterfaceDeclaration-16] |

**Return type**

Promise<Buffer>

```typescript
stream(dto: NoiaRequest): NoiaStreamDto;
```

**Parameters**

| Name | Type                                  |
| ---- | ------------------------------------- |
| dto  | [NoiaRequest][InterfaceDeclaration-9] |

**Return type**

[NoiaStreamDto][InterfaceDeclaration-10]


----------

### NoiaPieceDto

```typescript
interface NoiaPieceDto {
    index: number;
    data: Buffer;
}
```

**Properties**

| Name  | Type   | Optional |
| ----- | ------ | -------- |
| index | number | false    |
| data  | Buffer | false    |

----------

### NoiaPieceStartDto

```typescript
interface NoiaPieceStartDto {
    index: number;
    promise: Promise<NodeResult>;
}
```

**Properties**

| Name    | Type                                          | Optional |
| ------- | --------------------------------------------- | -------- |
| index   | number                                        | false    |
| promise | Promise<NodeResult> | false    |

----------

### NoiaClientEventMap

```typescript
interface NoiaClientEventMap {
    fileInfo: FileInfo;
    fileDone: Buffer;
    pieceDone: NoiaPieceDto;
    pieceStart: NoiaPieceStartDto;
    allPiecesStarted: {};
}
```

**Properties**

| Name             | Type                                         | Optional |
| ---------------- | -------------------------------------------- | -------- |
| fileInfo         | [FileInfo][InterfaceDeclaration-13]          | false    |
| fileDone         | Buffer                                       | false    |
| pieceDone        | [NoiaPieceDto][InterfaceDeclaration-14]      | false    |
| pieceStart       | [NoiaPieceStartDto][InterfaceDeclaration-15] | false    |
| allPiecesStarted | {}                                           | false    |

----------

### PiecePromiseResolver

```typescript
interface PiecePromiseResolver {
    pieceIndex: number;
    resolve: (result: NodeResult) => void;
    reject: (reason: string) => void;
    done: boolean;
}
```

**Properties**

| Name       | Type                         | Optional |
| ---------- | ---------------------------- | -------- |
| pieceIndex | number                       | false    |
| resolve    | (result: NodeResult) => void | false    |
| reject     | (reason: string) => void     | false    |
| done       | boolean                      | false    |

----------

### [PiecePromiseResolver][InterfaceDeclaration-5]

## Classes

### [NoiaClient][ClassDeclaration-0]


----------

### [NoiaClient][ClassDeclaration-0]

----------

### [NoiaClient][ClassDeclaration-0]

----------

### [NodeClient][ClassDeclaration-1]


----------

### [NoiaClient][ClassDeclaration-0]

----------

### [NodeClient][ClassDeclaration-1]

[SourceFile-0]: index.md#indexts
[InterfaceDeclaration-8]: index.md#dictionary
[InterfaceDeclaration-9]: index.md#noiarequest
[InterfaceDeclaration-16]: index.md#noiapiecerequest
[InterfaceDeclaration-9]: index.md#noiarequest
[InterfaceDeclaration-13]: index.md#fileinfo
[InterfaceDeclaration-11]: index.md#noiaemitter
[InterfaceDeclaration-12]: index.md#noiaclienteventmap
[InterfaceDeclaration-13]: index.md#fileinfo
[InterfaceDeclaration-10]: index.md#noiastreamdto
[InterfaceDeclaration-11]: index.md#noiaemitter
[InterfaceDeclaration-17]: index.md#noiaclient
[InterfaceDeclaration-9]: index.md#noiarequest
[InterfaceDeclaration-16]: index.md#noiapiecerequest
[InterfaceDeclaration-9]: index.md#noiarequest
[InterfaceDeclaration-10]: index.md#noiastreamdto
[InterfaceDeclaration-14]: index.md#noiapiecedto
[InterfaceDeclaration-15]: index.md#noiapiecestartdto
[InterfaceDeclaration-12]: index.md#noiaclienteventmap
[InterfaceDeclaration-13]: index.md#fileinfo
[InterfaceDeclaration-14]: index.md#noiapiecedto
[InterfaceDeclaration-15]: index.md#noiapiecestartdto
[InterfaceDeclaration-5]: index.md#piecepromiseresolver
[ClassDeclaration-0]: index/noiaclient.md#noiaclient
[ClassDeclaration-1]: index/nodeclient.md#nodeclient