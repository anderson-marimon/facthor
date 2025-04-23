interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
    readonly FT_URN: string;

    readonly FT_URL_LOGIN: string;
    readonly FT_AUTH_PATH: string;
    readonly FT_AUTH_CONFIG_USER: string;
    readonly FT_AUTH_CHANGE_PASSWORD: string;
    readonly FT_AUTH_FORGOT_PASSWORD: string;

    readonly FT_URL_REGISTER: string;
    readonly FT_REGISTER_PATH: string;
    readonly FT_REGISTER_VERIFY_TOKEN: string;
    readonly FT_REGISTER_LIST_DOCUMENT: string;
    readonly FT_REGISTER_RENEW_UPDATE_FILES_TOKEN: string;
    readonly FT_REGISTER_UPDATE_FAILED_LEGAL_DOCUMENT: string;

    readonly FT_URL_CLIENT_UPLOAD: string;
    readonly FT_NEGOTIATION: string;

    readonly FT_URL_FINANCIER_PROVIDER: string;
    [key: string]: any;
}
