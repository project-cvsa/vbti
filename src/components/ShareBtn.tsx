import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { report } from "@/lib/telemetry";

interface ShareBtnProps {
    characterName: string;
    mbti: string;
}

const SHARE_URL = "https://vbti-test.com";

export function ShareBtn({ characterName, mbti }: ShareBtnProps) {
    const shareText = `和我共鸣的灵魂歌姬是「${characterName}」！${mbti}型人格，来看看你的是谁？`;

    const handleShare = async () => {
        const fullText = `${shareText} ${SHARE_URL}`;

        if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
            try {
                await navigator.share({
                    title: "VBTI · 测测你的灵魂歌姬",
                    text: shareText,
                    url: SHARE_URL,
                });
                report("share", { method: "native" });
            } catch {
                await navigator.clipboard.writeText(fullText);
                toast("文案已复制，快去和好友分享吧～");
                report("share", { method: "clipboard" });
            }
        } else {
            await navigator.clipboard.writeText(fullText);
            toast("文案已复制，快去和好友分享吧～");
            report("share", { method: "clipboard" });
        }
    };

    return (
        <Button variant="outline" onClick={() => handleShare()}>
            分享结果
        </Button>
    );
}
