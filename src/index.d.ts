declare namespace toy {
    /** 支持的能力能力类型 */
    type AbilityType = "navigate" | "saveImageToAlbum" | "closeBrowser" | "getUserProfile";

    /** 页面类型 */
    type PageType = "video" | "space" | "search" | "opus" | "tribee" | "toy";

    /** 跳转页面参数 */
    interface NavigateRequest {
        /** 页面类型 */
        type: PageType;
        /** 资源 ID，如视频 BV 号、用户 mid、动态 id */
        id: string;
        /** 额外参数 */
        extra?: Record<string, string>;
    }

    /** 保存图片参数（url 和 base64Data 二选一） */
    type SaveImageRequest = {
        /** 申请相册权限时的提示文案 */
        hintMsg?: string;
    } & ({ url: string; base64Data?: never } | { base64Data: string; url?: never });

    /** 用户信息返回值 */
    interface UserProfileResult {
        /** 用户头像 */
        avatar: string;
        /** 用户昵称 */
        nickname: string;
    }

    /** 保存图片返回值 */
    interface SaveImageResult {
        /** 本地保存路径 */
        localPath: string;
    }

    /**
     * 判断当前环境是否支持指定能力。
     * @param ability 能力名称
     */
    function isSupport(ability: AbilityType): Promise<boolean>;

    /**
     * 跳转到指定页面。必须在用户手势事件（如 click）中调用。
     * @param req 跳转参数
     */
    function navigate(req: NavigateRequest): Promise<void>;

    /**
     * 保存图片到相册（仅 APP 端支持，Web 端调用会抛错）。
     * @param req 保存图片参数
     */
    function saveImageToAlbum(req: SaveImageRequest): Promise<SaveImageResult>;

    /**
     * 关闭当前 WebView 容器（仅 APP 端支持，Web 端调用会抛错）。
     */
    function closeBrowser(): Promise<void>;

    /**
     * 获取当前用户头像和昵称。APP 端和 Web 端均支持。
     */
    function getUserProfile(): Promise<UserProfileResult>;
}
