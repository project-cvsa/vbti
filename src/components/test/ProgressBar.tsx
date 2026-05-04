interface ProgressBarProps {
	answered: number;
	total: number;
}

function ProgressBar({ answered, total }: ProgressBarProps) {
	const pct = total > 0 ? (answered / total) * 100 : 0;

	return (
		<div className="top-0 z-40 py-3 flex items-center gap-4 flex-wrap">
			<div className="flex-1 min-w-55 h-[0.625rem] rounded-full bg-white md:bg-border overflow-hidden">
				<div
					className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
					style={{ width: `${pct}%` }}
				/>
			</div>
			<span className="text-sm text-muted-foreground whitespace-nowrap font-medium tabular-nums">
				{answered} / {total}
			</span>
		</div>
	);
}

export default ProgressBar;
