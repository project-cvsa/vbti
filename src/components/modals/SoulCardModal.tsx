import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { Character } from "@/core/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QRCode from "qrcode";
import { generateCardPalette } from "@/core/color";
import { report } from "@/lib/telemetry";
import { CARD_IMG_MAP } from "@/data/imgMap";

const CARD_URL = "https://vbti-test.com";

const DEFAULT_PALETTE = {
	bg: "#f6fbfa",
	accent: "#1cbaa8",
	text: "#0d6362",
	muted: "#4a6b7a",
	pill: "#b0e8e7",
	line: "#bee7e5",
};

interface SoulCardModalProps {
	open: boolean;
	onClose: () => void;
	characterName: string;
	character: Character;
}

export function SoulCardModal({ open, onClose, characterName, character }: SoulCardModalProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [cardDataURL, setCardDataURL] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const palette = useMemo(
		() => (character.color ? generateCardPalette(character.color) : DEFAULT_PALETTE),
		[character.color]
	);

	const generateCard = useCallback(() => {
		report("generate_card")
		const imgSrc = CARD_IMG_MAP[character.image]
		if (!imgSrc) {
			setError("角色图片加载失败");
			return;
		}

		const img = new Image();
		img.crossOrigin = "anonymous";
		img.referrerPolicy = "no-referrer"
		img.src = imgSrc;

		img.onload = async () => {
			try {
				const canvas = canvasRef.current;
				if (!canvas) return;

				const scale = 3;
				const cardWidth = 400;
				const cardHeight = 730;
				canvas.width = cardWidth * scale;
				canvas.height = cardHeight * scale;

				const ctx = canvas.getContext("2d");
				if (!ctx) return;

				ctx.scale(scale, scale);

				const cardRadius = 16;
				ctx.beginPath();
				ctx.moveTo(cardRadius, 0);
				ctx.lineTo(cardWidth - cardRadius, 0);
				ctx.arcTo(cardWidth, 0, cardWidth, cardRadius, cardRadius);
				ctx.lineTo(cardWidth, cardHeight - cardRadius);
				ctx.arcTo(cardWidth, cardHeight, cardWidth - cardRadius, cardHeight, cardRadius);
				ctx.lineTo(cardRadius, cardHeight);
				ctx.arcTo(0, cardHeight, 0, cardHeight - cardRadius, cardRadius);
				ctx.lineTo(0, cardRadius);
				ctx.arcTo(0, 0, cardRadius, 0, cardRadius);
				ctx.closePath();
				ctx.clip();

				ctx.fillStyle = palette.bg;
				ctx.fillRect(0, 0, cardWidth, cardHeight);
				const imgMaxW = 350;
				const imgMaxH = 1000;
				const ratio = Math.min(imgMaxW / img.width, imgMaxH / img.height);
				const imgW = img.width * ratio;
				const imgH = img.height * ratio;
				ctx.drawImage(img, (cardWidth - imgW) / 2, 15, imgW, imgH);

				ctx.fillStyle = palette.accent;
				ctx.font = "bold 16px sans-serif";
				ctx.textAlign = "center";
				ctx.fillText("你的灵魂歌姬已降临", 200, imgH + 45);

				const descY = imgH + 160;
				ctx.fillStyle = palette.text;
				ctx.font = "bold 15px sans-serif";
				ctx.fillText("灵魂解读", 200, descY);

				ctx.fillStyle = palette.text;
				ctx.font = "bold 36px sans-serif";
				ctx.fillText(characterName, 200, imgH + 85);

				const mbtiText = `歌手MBTI推测：${character.mbti}`;
				const mbtiWidth = 200;
				ctx.fillStyle = palette.pill;
				const rx = 200 - mbtiWidth / 2;
				const ry = imgH + 102;
				const rw = mbtiWidth;
				const rh = 26;
				const radius = 13;
				ctx.beginPath();
				ctx.moveTo(rx + radius, ry);
				ctx.lineTo(rx + rw - radius, ry);
				ctx.arcTo(rx + rw, ry, rx + rw, ry + radius, radius);
				ctx.lineTo(rx + rw, ry + rh - radius);
				ctx.arcTo(rx + rw, ry + rh, rx + rw - radius, ry + rh, radius);
				ctx.lineTo(rx + radius, ry + rh);
				ctx.arcTo(rx, ry + rh, rx, ry + rh - radius, radius);
				ctx.lineTo(rx, ry + radius);
				ctx.arcTo(rx, ry, rx + radius, ry, radius);
				ctx.closePath();
				ctx.fill();

				ctx.fillStyle = palette.text;
				ctx.font = "bold 13px sans-serif";
				ctx.fillText(mbtiText, 200, imgH + 102 + 18);

				ctx.fillStyle = palette.text;
				ctx.font = "11px sans-serif";
				const maxWidth = 340;
				const words = character.shortDesc.split("");
				const lines: string[] = [];
				let currentLine = "";
				for (const ch of words) {
					const testLine = currentLine + ch;
					if (ctx.measureText(testLine).width > maxWidth && currentLine.length > 0) {
						lines.push(currentLine);
						currentLine = ch;
					} else {
						currentLine = testLine;
					}
				}
				if (currentLine) lines.push(currentLine);
				ctx.textAlign = "left";
				let lineY = descY + 20;
				for (let j = 0; j < Math.min(lines.length, 4); j++) {
					ctx.fillText(lines[j], 30, lineY);
					lineY += 18;
				}

				const qrY = cardHeight - 100;
				ctx.font = "10px sans-serif";
				ctx.fillStyle = palette.accent;
				ctx.textAlign = "left";
				ctx.font = "bold 15px sans-serif";
				ctx.fillText("扫码测测", 190, qrY + 23);
				ctx.font = "13px sans-serif";
				ctx.fillStyle = palette.muted;
				ctx.fillText("你的灵魂歌姬是谁？", 190, qrY + 45);

				ctx.strokeStyle = palette.line;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(30, qrY - 13);
				ctx.lineTo(370, qrY - 13);
				ctx.stroke();

				const qrSize = 55;
				const qrX = 125;
				const qrCanvas = document.createElement("canvas");
				await QRCode.toCanvas(qrCanvas, CARD_URL, {
					width: qrSize,
					margin: 1,
					color: { dark: palette.text, light: "#ffffff00" },
				});
				ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

				ctx.fillStyle = palette.muted;
				ctx.font = "12px sans-serif";
				ctx.textAlign = "center";
				ctx.fillText("VBTI · 测测你的灵魂歌姬 分享给更多朋友", 205, qrY + 83)

				const dataURL = canvas.toDataURL();
				setCardDataURL(dataURL);
			} catch {
				setError("生成卡片失败，请长按结果页的图片保存。");
			}
		};

		img.onerror = () => {
			setError("角色图片加载失败，请检查网络后重试。");
		};
	}, [characterName, character, palette]);

	useEffect(() => {
		if (open) {
			setCardDataURL(null);
			setError(null);
			setTimeout(() => generateCard(), 100);
		}
	}, [open, generateCard]);

	const handleDownload = () => {
		if (!cardDataURL) return;
		report("download_card", { characterName });
		const link = document.createElement("a");
		link.download = `VBTI_灵魂卡片_${characterName}.png`;
		link.href = cardDataURL;
		link.click();
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) onClose();
			}}
		>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>灵魂卡片</DialogTitle>
				</DialogHeader>

				<canvas ref={canvasRef} className="hidden" />

				{error && <p className="text-sm text-destructive text-center">{error}</p>}

				{cardDataURL && (
					<div className="flex flex-col items-center gap-4">
						<img
							src={cardDataURL}
							alt={`${characterName} 灵魂卡片`}
							className="max-w-90 max-h-[70vh] rounded-xl"
						/>
						<div className="flex gap-3">
							<Button style={{ background: palette.accent }} onClick={handleDownload}>保存到本地</Button>
							<Button variant="outline" onClick={onClose}>
								关闭
							</Button>
						</div>
					</div>
				)}

				{!cardDataURL && !error && (
					<p className="text-sm text-muted-foreground text-center">生成中...</p>
				)}
			</DialogContent>
		</Dialog>
	);
}
