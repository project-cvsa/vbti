import { useEffect, useRef, useState, useCallback } from "react";
import type { Character } from "@/core/types";
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

const CARD_BG = "#f6fbfa";
const CARD_ACCENT = "#1cbaa8";
const CARD_TEXT = "#0d6362";
const CARD_MUTED = "#4a6b7a";
const CARD_PILL = "#b0e8e7";
const CARD_LINE = "#bee7e5";

export function SoulCardModal({ open, onClose, characterName, character }: SoulCardModalProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [cardDataURL, setCardDataURL] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const generateCard = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const scale = 3;
		const cardWidth = 400;
		const cardHeight = 650;
		canvas.width = cardWidth * scale;
		canvas.height = cardHeight * scale;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.scale(scale, scale);
		ctx.fillStyle = CARD_BG;
		ctx.fillRect(0, 0, cardWidth, cardHeight);

		const imgSrc = character.image;
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
				ctx.drawImage(img, (cardWidth - imgW) / 2, 20, imgW, imgH);

				ctx.fillStyle = CARD_ACCENT;
				ctx.font = "bold 16px sans-serif";
				ctx.textAlign = "center";
				ctx.fillText("你的灵魂歌姬已降临", 200, imgH + 60);

				const descY = imgH + 180;
				ctx.fillStyle = CARD_TEXT;
				ctx.font = "bold 15px sans-serif";
				ctx.fillText("灵魂解读", 200, descY);

				ctx.fillStyle = CARD_TEXT;
				ctx.font = "bold 36px sans-serif";
				ctx.fillText(characterName, 200, imgH + 105);

				const mbtiText = `歌手MBTI推测：${character.mbti}`;
				const mbtiWidth = 200;
				ctx.fillStyle = CARD_PILL;
				const rx = 200 - mbtiWidth / 2;
				const ry = imgH + 122;
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
				ctx.fillText(mbtiText, 200, imgH + 122 + 18);

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

				const qrY = cardHeight - 70;
				ctx.font = "10px sans-serif";
				ctx.fillStyle = CARD_MUTED;
				ctx.textAlign = "left";
				ctx.font = "bold 15px sans-serif";
				ctx.fillText("扫码测测", 190, qrY + 23);
				ctx.font = "13px sans-serif";
				ctx.fillText("你的灵魂歌姬是谁？", 190, qrY + 45);

				ctx.strokeStyle = CARD_LINE;
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
					color: { dark: CARD_TEXT, light: "#ffffff00" },
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
