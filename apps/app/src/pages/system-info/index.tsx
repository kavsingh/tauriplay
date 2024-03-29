import Page from "#layouts/page";

import SystemInfoList from "./system-info-list";

export default function SystemInfo() {
	return (
		<>
			<Page.Header>System Info</Page.Header>
			<Page.Content>
				<SystemInfoList />
			</Page.Content>
		</>
	);
}
