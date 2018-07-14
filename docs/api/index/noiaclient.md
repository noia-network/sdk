# Table of contents

* [NoiaClient][ClassDeclaration-0]
    * Constructor
        * [constructor(workerConstructor)][Constructor-0]
    * Methods
        * [download(dto)][MethodDeclaration-4]
        * [stream(dto)][MethodDeclaration-5]
        * [startStream(dto, emitter)][MethodDeclaration-6]
        * [downloadPiece(dto)][MethodDeclaration-7]
        * [ensureRequest(dto)][MethodDeclaration-8]
        * [nextNode(request)][MethodDeclaration-9]
        * [fallback(dto)][MethodDeclaration-10]
        * [fallbackPiece(dto, pieceLength)][MethodDeclaration-11]
    * Properties
        * [requests][PropertyDeclaration-0]
        * [nodes][PropertyDeclaration-5]
        * [lastUsedNodeIndex][PropertyDeclaration-6]

# NoiaClient

```typescript
class NoiaClient implements NoiaClient
```
## Constructor

### constructor(workerConstructor)

```typescript
public constructor(workerConstructor: () => Worker);
```

**Parameters**

| Name              | Type         |
| ----------------- | ------------ |
| workerConstructor | () => Worker |

## Methods

### download(dto)

```typescript
public async download(dto: NoiaRequest): Promise<Buffer>;
```

**Parameters**

| Name | Type                                  |
| ---- | ------------------------------------- |
| dto  | NoiaRequest |

**Return type**

Promise<Buffer>

----------

### stream(dto)

```typescript
public stream(dto: NoiaRequest): NoiaStreamDto;
```

**Parameters**

| Name | Type                                  |
| ---- | ------------------------------------- |
| dto  | NoiaRequest |

**Return type**

NoiaStreamDto

----------

### startStream(dto, emitter)

```typescript
protected async startStream(dto: NoiaRequest, emitter: NoiaEmitter): Promise<void>;
```

**Parameters**

| Name    | Type                                  |
| ------- | ------------------------------------- |
| dto     | NoiaRequest |
| emitter | NoiaEmitter     |

**Return type**

Promise<void>

----------

### downloadPiece(dto)

```typescript
public async downloadPiece(dto: NoiaPieceRequest): Promise<Buffer>;
```

**Parameters**

| Name | Type                                        |
| ---- | ------------------------------------------- |
| dto  | NoiaPieceRequest |

**Return type**

Promise<Buffer>

----------

### ensureRequest(dto)

```typescript
protected async ensureRequest(dto: NoiaRequest): Promise<RequestData>;
```

**Parameters**

| Name | Type                                  |
| ---- | ------------------------------------- |
| dto  | NoiaRequest |

**Return type**

Promise<RequestData>

----------

### nextNode(request)

```typescript
protected nextNode(request: RequestData): NodeClient | undefined;
```

**Parameters**

| Name    | Type                                  |
| ------- | ------------------------------------- |
| request | RequestData |

**Return type**

NodeClient | undefined

----------

### fallback(dto)

```typescript
protected async fallback(dto: NoiaRequest): Promise<Buffer>;
```

**Parameters**

| Name | Type                                  |
| ---- | ------------------------------------- |
| dto  | NoiaRequest |

**Return type**

Promise<Buffer>

----------

### fallbackPiece(dto, pieceLength)

```typescript
protected async fallbackPiece(dto: NoiaPieceRequest, pieceLength: number = 16384): Promise<Buffer>;
```

**Parameters**

| Name        | Type                                        | Default value |
| ----------- | ------------------------------------------- | ------------- |
| dto         | NoiaPieceRequest |               |
| pieceLength | number                                      | 16384         |

**Return type**

Promise<Buffer>

## Properties

### requests

```typescript
protected requests: Dictionary<RequestData>;
```

**Type**

Dictionary][InterfaceDeclaration-8]<[RequestData>

----------

### nodes

```typescript
protected nodes: NodeClient[];
```

**Type**

NodeClient[]

----------

### lastUsedNodeIndex

```typescript
protected lastUsedNodeIndex: number;
```

**Type**

number

[ClassDeclaration-0]: noiaclient.md#noiaclient
[Constructor-0]: noiaclient.md#constructorworkerconstructor
[MethodDeclaration-4]: noiaclient.md#downloaddto
[MethodDeclaration-5]: noiaclient.md#streamdto
[MethodDeclaration-6]: noiaclient.md#startstreamdto-emitter
[MethodDeclaration-7]: noiaclient.md#downloadpiecedto
[MethodDeclaration-8]: noiaclient.md#ensurerequestdto
[MethodDeclaration-9]: noiaclient.md#nextnoderequest
[MethodDeclaration-10]: noiaclient.md#fallbackdto
[MethodDeclaration-11]: noiaclient.md#fallbackpiecedto-piecelength
[PropertyDeclaration-0]: noiaclient.md#requests
[PropertyDeclaration-5]: noiaclient.md#nodes
[PropertyDeclaration-6]: noiaclient.md#lastusednodeindex