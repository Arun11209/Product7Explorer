import { Document } from 'mongoose';
export type ScrapingJobDocument = ScrapingJob & Document;
export declare enum ScrapingJobType {
    NAVIGATION_HEADINGS = "navigation_headings",
    CATEGORIES = "categories",
    PRODUCTS = "products",
    PRODUCT_DETAIL = "product_detail"
}
export declare enum ScrapingJobStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare class ScrapingJob {
    type: ScrapingJobType;
    status: ScrapingJobStatus;
    targetUrl?: string;
    parameters?: Record<string, any>;
    priority: number;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
    retryCount: number;
    maxRetries: number;
    result?: Record<string, any>;
    metadata?: Record<string, any>;
}
export declare const ScrapingJobSchema: import("mongoose").Schema<ScrapingJob, import("mongoose").Model<ScrapingJob, any, any, any, (Document<unknown, any, ScrapingJob, any, import("mongoose").DefaultSchemaOptions> & ScrapingJob & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, ScrapingJob, any, import("mongoose").DefaultSchemaOptions> & ScrapingJob & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, ScrapingJob>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ScrapingJob, Document<unknown, {}, ScrapingJob, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ScrapingJob & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    type?: import("mongoose").SchemaDefinitionProperty<ScrapingJobType, ScrapingJob, Document<unknown, {}, ScrapingJob, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ScrapingJob & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<ScrapingJobStatus, ScrapingJob, Document<unknown, {}, ScrapingJob, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ScrapingJob & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, ScrapingJob, Document<unknown, {}, ScrapingJob, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ScrapingJob & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    parameters?: import("mongoose").SchemaDefinitionProperty<Record<string, any> | undefined, ScrapingJob, Document<unknown, {}, ScrapingJob, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ScrapingJob & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    priority?: import("mongoose").SchemaDefinitionProperty<number, ScrapingJob, Document<unknown, {}, ScrapingJob, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ScrapingJob & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, ScrapingJob, Document<unknown, {}, ScrapingJob, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ScrapingJob & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    completedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, ScrapingJob, Document<unknown, {}, ScrapingJob, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ScrapingJob & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    error?: import("mongoose").SchemaDefinitionProperty<string | undefined, ScrapingJob, Document<unknown, {}, ScrapingJob, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ScrapingJob & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    retryCount?: import("mongoose").SchemaDefinitionProperty<number, ScrapingJob, Document<unknown, {}, ScrapingJob, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ScrapingJob & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    maxRetries?: import("mongoose").SchemaDefinitionProperty<number, ScrapingJob, Document<unknown, {}, ScrapingJob, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ScrapingJob & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    result?: import("mongoose").SchemaDefinitionProperty<Record<string, any> | undefined, ScrapingJob, Document<unknown, {}, ScrapingJob, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ScrapingJob & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metadata?: import("mongoose").SchemaDefinitionProperty<Record<string, any> | undefined, ScrapingJob, Document<unknown, {}, ScrapingJob, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ScrapingJob & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ScrapingJob>;
