export const protoJson = {
    nested: {
        ContentResponseData: {
            fields: {
                contentId: {
                    type: "string",
                    id: 1
                },
                offset: {
                    type: "int32",
                    id: 2
                },
                index: {
                    type: "int32",
                    id: 3
                },
                buffer: {
                    type: "bytes",
                    id: 4
                }
            }
        },
        ContentResponse: {
            fields: {
                status: {
                    type: "int32",
                    id: 1
                },
                error: {
                    type: "string",
                    id: 2
                },
                data: {
                    type: "ContentResponseData",
                    id: 3
                }
            }
        }
    }
};
