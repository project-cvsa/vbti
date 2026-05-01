interface ProgressBarProps {
	answered: number;
	total: number;
}

function ProgressBar({ answered, total }: ProgressBarProps) {
	const pct = total > 0 ? (answered / total) * 100 : 0;

	return (
		<div className="sticky top-0 z-40 bg-card py-3 flex items-center gap-4 flex-wrap">
			<div className="flex-1 min-w-55 h-2.5 rounded-full bg-primary/20 overflow-hidden">
				<div
					className="h-full rounded-full bg-linear-to-r from-primary to-primary/70 transition-[width] duration-300 ease-out"
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
