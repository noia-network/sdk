# Table of contents

* [NodeClient][ClassDeclaration-1]
    * Constructor
        * [constructor(nodeAddress, workerConstructor)][Constructor-1]
    * Methods
        * [isBusy()][MethodDeclaration-0]
        * [downloadPiece(pieceRequest)][MethodDeclaration-1]
        * [nextWorker()][MethodDeclaration-2]
    * Properties
        * [workers][PropertyDeclaration-1]
        * [lastUsedWorkerIndex][PropertyDeclaration-2]
        * [piecePromiseResolvers][PropertyDeclaration-3]

# NodeClient

```typescript
class NodeClient
```
## Constructor

### constructor(nodeAddress, workerConstructor)

```typescript
public constructor(nodeAddress: string, workerConstructor: () => Worker);
```

**Parameters**

| Name              | Type         |
| ----------------- | ------------ |
| nodeAddress       | string       |
| workerConstructor | () => Worker |

## Methods

### isBusy()

```typescript
public isBusy(): boolean;
```

**Return type**

boolean

----------

### downloadPiece(pieceRequest)

```typescript
public async downloadPiece(pieceRequest: PieceRequest): Promise<NodeResult>;
```

**Parameters**

| Name         | Type                                   |
| ------------ | -------------------------------------- |
| pieceRequest | PieceRequest |

**Return type**

Promise<NodeResult>

----------

### nextWorker()

```typescript
protected nextWorker(): Worker | undefined;
```

**Return type**

Worker | undefined

## Properties

### workers

```typescript
protected workers: Worker[];
```

**Type**

Worker[]

----------

### lastUsedWorkerIndex

```typescript
protected lastUsedWorkerIndex: number;
```

**Type**

number

----------

### piecePromiseResolvers

```typescript
protected piecePromiseResolvers: PiecePromiseResolver[];
```

**Type**

[PiecePromiseResolver][InterfaceDeclaration-5][]

[ClassDeclaration-1]: nodeclient.md#nodeclient
[Constructor-1]: nodeclient.md#constructornodeaddress-workerconstructor
[MethodDeclaration-0]: nodeclient.md#isbusy
[MethodDeclaration-1]: nodeclient.md#downloadpiecepiecerequest
[MethodDeclaration-2]: nodeclient.md#nextworker
[PropertyDeclaration-1]: nodeclient.md#workers
[PropertyDeclaration-2]: nodeclient.md#lastusedworkerindex
[PropertyDeclaration-3]: nodeclient.md#piecepromiseresolvers
[InterfaceDeclaration-5]: ../index.md#piecepromiseresolver