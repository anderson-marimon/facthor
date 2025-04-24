export type TApi<T> = {
    ok: boolean;
    internalCode: number;
    internalCodePrefix: string;
    message: string;
    data: T;
};
