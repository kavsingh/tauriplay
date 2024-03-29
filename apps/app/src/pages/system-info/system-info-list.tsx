import { Show } from "solid-js";

import useSystemInfo from "#hooks/use-system-info";

import type { ParentProps } from "solid-js";

export default function SystemInfoList() {
	const infoQuery = useSystemInfo();

	return (
		<Show when={infoQuery.data} fallback={<>Loading...</>} keyed>
			{(info) => (
				<ul class="m-0 flex select-text list-none flex-col gap-2 p-0">
					<InfoEntry>
						<InfoEntryLabel>os</InfoEntryLabel>
						<span>
							{info.osFullname} | {info.osArch}
						</span>
					</InfoEntry>
					<InfoEntry>
						<InfoEntryLabel>total memory</InfoEntryLabel>
						<span>{formatMem(info.memTotal ?? "")}</span>
					</InfoEntry>
					<InfoEntry>
						<InfoEntryLabel>available memory</InfoEntryLabel>
						<span>{formatMem(info.memAvailable ?? "")}</span>
					</InfoEntry>
				</ul>
			)}
		</Show>
	);
}

function InfoEntry(props: ParentProps) {
	return (
		<li class="flex gap-2 border-b border-b-neutral-200 pb-2 last:border-b-0 last:pb-0 dark:border-b-neutral-700">
			{props.children}
		</li>
	);
}

function InfoEntryLabel(props: ParentProps) {
	return <span class="font-semibold text-neutral-500">{props.children}</span>;
}

function formatMem(mem: string) {
	const num = Number(mem);

	for (const [threshold, unit] of thresholds) {
		if (num >= threshold) return `${(num / threshold).toFixed(2)} ${unit}`;
	}

	return "-";
}

const thresholds = [
	[1024 * 1024 * 1024, "GB"],
	[1024 * 1024, "MB"],
	[1024, "KB"],
	[0, "B"],
] as const;
