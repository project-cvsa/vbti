import { toast as sonnerToast } from 'sonner';

interface ToastProps {
	id: string | number;
	title: string;
}

/** I recommend abstracting the toast function
 *  so that you can call it without having to use toast.custom everytime. */
export function toast(str: string) {
	return sonnerToast.custom((id) => (
		<Toast
			id={id}
			title={str}
		/>
	), { position: "top-center" });
}

/** A fully custom toast that still maintains the animations and interactions. */
function Toast(props: ToastProps) {
	const { title } = props;

	return (
		<div className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4">
			<div className="flex flex-1 items-center">
				<div className="w-full">
					<p className="text-sm font-medium text-neutral-900">{title}</p>
				</div>
			</div>
		</div>
	);
}