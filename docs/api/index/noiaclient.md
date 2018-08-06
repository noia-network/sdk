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
| dto  | [NoiaRequest][InterfaceDeclaration-9] |

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
| dto  | [NoiaRequest][InterfaceDeclaration-9] |

**Return type**

[NoiaStreamDto][InterfaceDeclaration-10]

----------

### startStream(dto, emitter)

```typescript
protected async startStream(dto: NoiaRequest, emitter: NoiaEmitter): Promise<void>;
```

**Parameters**

| Name    | Type                                  |
| ------- | ------------------------------------- |
| dto     | [NoiaRequest][InterfaceDeclaration-9] |
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
| dto  | [NoiaPieceRequest][InterfaceDeclaration-16] |

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
| dto  | [NoiaRequest][InterfaceDeclaration-9] |

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

[NodeClient][ClassDeclaration-1] | undefined

----------

### fallback(dto)

```typescript
protected async fallback(dto: NoiaRequest): Promise<Buffer>;
```

**Parameters**

| Name | Type                                  |
| ---- | ------------------------------------- |
| dto  | [NoiaRequest][InterfaceDeclaration-9] |

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
| dto         | [NoiaPieceRequest][InterfaceDeclaration-16] |               |
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

[NodeClient][ClassDeclaration-1][]

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
[InterfaceDeclaration-9]: ../index.md#noiarequest
[MethodDeclaration-5]: noiaclient.md#streamdto
[InterfaceDeclaration-9]: ../index.md#noiarequest
[InterfaceDeclaration-10]: ../index.md#noiastreamdto
[MethodDeclaration-6]: noiaclient.md#startstreamdto-emitter
[InterfaceDeclaration-9]: ../index.md#noiarequest
[MethodDeclaration-7]: noiaclient.md#downloadpiecedto
[InterfaceDeclaration-16]: ../index.md#noiapiecerequest
[MethodDeclaration-8]: noiaclient.md#ensurerequestdto
[InterfaceDeclaration-9]: ../index.md#noiarequest
[MethodDeclaration-9]: noiaclient.md#nextnoderequest
[ClassDeclaration-1]: nodeclient.md#nodeclient
[MethodDeclaration-10]: noiaclient.md#fallbackdto
[InterfaceDeclaration-9]: ../index.md#noiarequest
[MethodDeclaration-11]: noiaclient.md#fallbackpiecedto-piecelength
[InterfaceDeclaration-16]: ../index.md#noiapiecerequest
[PropertyDeclaration-0]: noiaclient.md#requests
[InterfaceDeclaration-8]: ../index.md#dictionary
[PropertyDeclaration-5]: noiaclient.md#nodes
[ClassDeclaration-1]: nodeclient.md#nodeclient
[PropertyDeclaration-6]: noiaclient.md#lastusednodeindex