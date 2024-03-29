import { A } from "@solidjs/router";

import WindowDragRegion from "#components/window-drag-region";

import type { ParentProps } from "solid-js";

export default function App(props: ParentProps) {
	return (
		<>
			<div class="grid h-full grid-cols-[min-content_1fr]">
				<div class="min-h-full p-4 pt-9">
					<nav class="flex flex-col gap-2">
						<A href="/">System Info</A>
						<A href="/files">Files</A>
						<A href="/preferences">Preferences</A>
					</nav>
				</div>
				<div class="h-full overflow-y-auto overflow-x-hidden">
					<div class="min-h-full bg-white dark:bg-neutral-900">
						{props.children}
					</div>
				</div>
			</div>
			<WindowDragRegion class="fixed inset-x-0 top-0 z-10 h-8" />
		</>
	);
}
