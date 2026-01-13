import { Document } from 'mongoose';
export type NavigationHeadingDocument = NavigationHeading & Document;
export declare class NavigationHeading {
    name: string;
    url: string;
    description?: string;
    isActive: boolean;
    lastScrapedAt?: Date;
    metadata?: Record<string, any>;
}
export declare const NavigationHeadingSchema: import("mongoose").Schema<NavigationHeading, import("mongoose").Model<NavigationHeading, any, any, any, (Document<unknown, any, NavigationHeading, any, import("mongoose").DefaultSchemaOptions> & NavigationHeading & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, NavigationHeading, any, import("mongoose").DefaultSchemaOptions> & NavigationHeading & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, NavigationHeading>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NavigationHeading, Document<unknown, {}, NavigationHeading, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<NavigationHeading & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, NavigationHeading, Document<unknown, {}, NavigationHeading, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<NavigationHeading & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    url?: import("mongoose").SchemaDefinitionProperty<string, NavigationHeading, Document<unknown, {}, NavigationHeading, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<NavigationHeading & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, NavigationHeading, Document<unknown, {}, NavigationHeading, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<NavigationHeading & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, NavigationHeading, Document<unknown, {}, NavigationHeading, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<NavigationHeading & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastScrapedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, NavigationHeading, Document<unknown, {}, NavigationHeading, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<NavigationHeading & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metadata?: import("mongoose").SchemaDefinitionProperty<Record<string, any> | undefined, NavigationHeading, Document<unknown, {}, NavigationHeading, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<NavigationHeading & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, NavigationHeading>;
