interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
    FT_URL_LOGIN: string;
    FT_URL_REGISTER: string;
    FT_URL_CLIENT_UPLOAD: string;
    FT_URL_FINANCIER_PROVIDER: string;
    FT_URL_NEGOTIATION: string;
    FT_URN: string;

    FT_AUTH_LOGIN: string;
    FT_AUTH_REGISTER: string;
    FT_AUTH_CONFIG_USER: string;
    FT_AUTH_CHANGE_PASSWORD: string;
    FT_AUTH_FORGOT_PASSWORD: string;

    FT_REGISTER_VERIFY_TOKEN: string;
    FT_REGISTER_LIST_DOCUMENT: string;
    FT_REGISTER_RENEW_UPDATE_FILES_TOKEN: string;
    FT_REGISTER_UPDATE_FAILED_LEGAL_DOCUMENT: string;

    FT_CLIENT_UPLOAD_DATA: string;
}
