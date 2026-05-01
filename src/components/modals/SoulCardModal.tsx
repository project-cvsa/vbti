import { useEffect, useRef, useState, useCallback } from "react";
import type { Character } from "@/core/types";
import { CHARACTER_IMAGES } from "@/data/images";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QRCode from "qrcode";

const CARD_URL = "https://vbti-test.com";

interface SoulCardModalProps {
	open: boolean;
	onClose: () => void;
	characterName: string;
	character: Character;
}

const CARD_BG = "#e0f0f5";
const CARD_ACCENT = "#1cbaa8";
const CARD_TEXT = "#0d6362";
const CARD_MUTED = "#4a6b7a";
const CARD_PILL = "#b0e8e7";
const CARD_LINE = "#81dfdd";

export function SoulCardModal({ open, onClose, characterName, character }: SoulCardModalProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [cardDataURL, setCardDataURL] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const generateCard = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const scale = 2;
		const cardWidth = 400;
		const cardHeight = 580;
		canvas.width = cardWidth * scale;
		canvas.height = cardHeight * scale;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.scale(scale, scale);
		ctx.fillStyle = CARD_BG;
		ctx.fillRect(0, 0, cardWidth, cardHeight);

		ctx.fillStyle = CARD_ACCENT;
		ctx.font = "bold 16px sans-serif";
		ctx.textAlign = "center";
		ctx.fillText("你的灵魂歌姬已降临", 200, 35);

		ctx.fillStyle = CARD_TEXT;
		ctx.font = "bold 36px sans-serif";
		ctx.fillText(characterName, 200, 80);

		const mbtiText = `歌手MBTI推测：${character.mbti}`;
		const mbtiWidth = ctx.measureText(mbtiText).width + 24;
		ctx.fillStyle = CARD_PILL;
		const rx = 200 - mbtiWidth / 2;
		const ry = 92;
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

		ctx.fillStyle = CARD_TEXT;
		ctx.font = "bold 13px sans-serif";
		ctx.fillText(mbtiText, 200, 110);

		const imgSrc = CHARACTER_IMAGES[characterName];
		if (!imgSrc) {
			setError("角色图片加载失败");
			return;
		}

		const img = new Image();
		img.crossOrigin = "anonymous";
		img.src = imgSrc;

		img.onload = async () => {
			try {
				const imgMaxW = 220;
				const imgMaxH = 260;
				const ratio = Math.min(imgMaxW / img.width, imgMaxH / img.height);
				const imgW = img.width * ratio;
				const imgH = img.height * ratio;
				ctx.drawImage(img, (cardWidth - imgW) / 2, 130, imgW, imgH);

				const descY = 400;
				ctx.fillStyle = CARD_TEXT;
				ctx.font = "bold 15px sans-serif";
				ctx.fillText("灵魂解读", 200, descY);

				ctx.fillStyle = CARD_TEXT;
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

				let lineY = descY + 20;
				for (let j = 0; j < Math.min(lines.length, 4); j++) {
					ctx.fillText(lines[j], 200, lineY);
					lineY += 18;
				}

				const qrY = Math.min(lineY + 16, 496);
				ctx.font = "10px sans-serif";
				ctx.fillStyle = CARD_MUTED;
				ctx.textAlign = "left";
				ctx.fillText("分享给更多朋友", 110, qrY + 30);
				ctx.fillText("测出你的灵魂虚拟歌姬", 110, qrY + 48);

				ctx.strokeStyle = CARD_LINE;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(30, qrY - 10);
				ctx.lineTo(370, qrY - 10);
				ctx.stroke();

				const qrSize = 70;
				const qrX = 30;
				const qrCanvas = document.createElement("canvas");
				await QRCode.toCanvas(qrCanvas, CARD_URL, {
					width: qrSize,
					margin: 1,
					color: { dark: "#000", light: "#fff" },
				});
				ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

				const dataURL = canvas.toDataURL();
				setCardDataURL(dataURL);
			} catch {
				setError("生成卡片失败，请长按结果页的图片保存。");
			}
		};

		img.onerror = () => {
			setError("角色图片加载失败，请检查网络后重试。");
		};
	}, [characterName, character]);

	useEffect(() => {
		if (open) {
			setCardDataURL(null);
			setError(null);
			setTimeout(() => generateCard(), 100);
		}
	}, [open, generateCard]);

	const handleDownload = () => {
		if (!cardDataURL) return;
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
							<Button onClick={handleDownload}>保存到本地</Button>
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
